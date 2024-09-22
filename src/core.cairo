use ekubo::types::keys::PoolKey;
use spotnet::types::{SwapData, SwapResult, DepositData};
use starknet::{ContractAddress};

#[starknet::interface]
pub trait ICore<TContractState> {
    fn swap(ref self: TContractState, swap_data: SwapData) -> SwapResult;

    fn loop_liquidity(
        ref self: TContractState,
        deposit_data: DepositData,
        pool_key: PoolKey,
        pool_price: u256,
        caller: ContractAddress
    );
}

#[starknet::contract]
pub mod Core {
    use ekubo::components::shared_locker::handle_delta;
    use ekubo::interfaces::core::SwapParameters;
    use ekubo::interfaces::core::{ICoreDispatcher, ICoreDispatcherTrait, ILocker};
    use ekubo::interfaces::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
    use ekubo::types::i129::i129;
    use ekubo::types::keys::PoolKey;
    use spotnet::constants::ZK_PERCENTS_DECIMALS;

    use spotnet::interfaces::{IMarketDispatcher, IMarketDispatcherTrait};
    use spotnet::types::{SwapData, SwapResult, DepositData};

    use starknet::storage::StoragePointerReadAccess;
    use starknet::storage::StoragePointerWriteAccess;
    use starknet::{ContractAddress};
    use starknet::{get_contract_address};
    use super::{ICore};

    #[storage]
    struct Storage {
        ekubo_core: ICoreDispatcher,
        zk_market: IMarketDispatcher
    }

    #[constructor]
    fn constructor(
        ref self: ContractState, ekubo_core: ICoreDispatcher, zk_market: IMarketDispatcher
    ) {
        self.ekubo_core.write(ekubo_core);
        self.zk_market.write(zk_market);
    }

    fn div(a: u256, b: u256) -> felt252 {
        assert(b != 0, 'zero division');

        let a: u256 = a.into();
        let b: u256 = b.into();
        let quotient = a / b;

        quotient.try_into().unwrap()
    }

    fn get_borrow_amount(
        borrow_capacity: u256, token_price: u256, decimals_difference: u256, total_borrowed: u256
    ) -> felt252 {
        let borrow_const = 80;
        let amount_base_token = token_price * borrow_capacity;
        println!("ABT {amount_base_token}");
        let amount_quote_token = amount_base_token / decimals_difference;
        println!("AQT {amount_quote_token}");
        div(amount_quote_token - total_borrowed, 100) * borrow_const
    }

    fn get_left_integer(number: u256) -> u256 {
        let mut temp_num = number;
        while temp_num > 9 {
            temp_num = temp_num / 10;
        };
        temp_num
    }

    #[abi(embed_v0)]
    impl CoreImpl of ICore<ContractState> {
        fn swap(ref self: ContractState, swap_data: SwapData) -> SwapResult {
            if swap_data.caller != get_contract_address() { // if called externally just for swap
                let token_disp = IERC20Dispatcher {
                    contract_address: if swap_data.params.is_token1 {
                        swap_data.pool_key.token1
                    } else {
                        swap_data.pool_key.token0
                    }
                };
                println!("PASSED0");
                token_disp
                    .transferFrom(
                        swap_data.caller,
                        get_contract_address(),
                        swap_data.params.amount.mag.try_into().unwrap()
                    );
            }

            println!("PASSED1");
            // Ekubo Callback
            ekubo::components::shared_locker::call_core_with_callback(
                self.ekubo_core.read(), @swap_data
            )
        }

        fn loop_liquidity(
            ref self: ContractState,
            deposit_data: DepositData,
            pool_key: PoolKey,
            pool_price: u256,
            caller: ContractAddress
        ) {
            let DepositData { token, amount, multiplier } = deposit_data;
            let token_dispatcher = IERC20Dispatcher { contract_address: token };
            let zk_market = self.zk_market.read();
            let is_token1 = token == pool_key.token0;
            let contract_address = get_contract_address();

            token_dispatcher.transferFrom(caller, contract_address, amount);

            let usdc_disp = IERC20Dispatcher {
                contract_address: 0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
                    .try_into()
                    .unwrap()
            };
            let reserve_data = zk_market.get_reserve_data(token);

            let collateral_factor: u256 = reserve_data.collateral_factor.into();

            zk_market.enable_collateral(token);

            let decimal_difference: u256 = 1000000000000000000; // TODO: Create pow function

            token_dispatcher.approve(zk_market.contract_address, amount);
            zk_market.deposit(token, amount.try_into().expect('Overflow'));

            let mut total_deposited = amount;
            let mut total_borrowed = 0;
            let mut accumulated = 0;
            let mut i = 0;

            while i < multiplier {
                let borrow_capacity = div(total_deposited * collateral_factor, ZK_PERCENTS_DECIMALS)
                    .into();

                let to_borrow = get_borrow_amount(
                    borrow_capacity, pool_price, decimal_difference, total_borrowed.into()
                );

                total_borrowed += to_borrow;
                zk_market.borrow(usdc_disp.contract_address, to_borrow);
                let params = SwapParameters {
                    amount: i129 { mag: to_borrow.try_into().unwrap(), sign: false },
                    is_token1,
                    sqrt_ratio_limit: 6277100250585753475930931601400621808602321654880405518632,
                    skip_ahead: 0
                };

                let swapped_delta = self
                    .swap(SwapData { params, caller: contract_address, pool_key });
                let amount_swapped = swapped_delta.delta.amount0.mag.into();

                token_dispatcher.approve(zk_market.contract_address, amount_swapped.into());
                zk_market.deposit(token, amount_swapped);

                total_deposited += amount_swapped.into();
                accumulated += amount_swapped;
                i += 1;
            };
        }
    }

    #[abi(embed_v0)]
    impl Locker of ILocker<ContractState> {
        fn locked(ref self: ContractState, id: u32, data: Span<felt252>) -> Span<felt252> {
            let core = self.ekubo_core.read();
            let SwapData { pool_key, params, caller } =
                ekubo::components::shared_locker::consume_callback_data::<
                SwapData
            >(core, data);

            let delta = core.swap(pool_key, params);

            handle_delta(core, pool_key.token0, delta.amount0, caller);
            handle_delta(core, pool_key.token1, delta.amount1, caller);

            let swap_result = SwapResult { delta };

            let mut arr: Array<felt252> = ArrayTrait::new();
            Serde::serialize(@swap_result, ref arr);
            arr.span()
        }
    }
}
