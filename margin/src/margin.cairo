#[starknet::contract]
pub mod Margin {
    use openzeppelin_token::erc20::interface::IERC20DispatcherTrait;
    use core::num::traits::Zero;
    use starknet::{
        event::EventEmitter,
        storage::{StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map},
        ContractAddress, get_contract_address, get_caller_address,
    };
    use margin::{
        interface::IMargin, 
        types::{Position, TokenAmount, PositionParameters, SwapData}
    };
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher};
    use ekubo::{interfaces::core::{ICoreDispatcher, ILocker, ICoreDispatcherTrait}, types::delta::Delta};

    #[derive(starknet::Event, Drop)]
    struct Deposit {
        depositor: ContractAddress,
        token: ContractAddress,
        amount: TokenAmount,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Deposit: Deposit,
    }

    #[storage]
    struct Storage {
        ekubo_core: ICoreDispatcher,
        treasury_balances: Map<(ContractAddress, ContractAddress), TokenAmount>,
        pools: Map<ContractAddress, TokenAmount>,
        positions: Map<ContractAddress, Position>,
    }


    #[generate_trait]
    pub impl InternalImpl of InternalTrait {
        fn swap(ref self: ContractState, swap_data: SwapData) -> Delta {
            ekubo::components::shared_locker::call_core_with_callback(
                self.ekubo_core.read(), @swap_data
            )
        }
    }


    #[abi(embed_v0)]
    impl Margin of IMargin<ContractState> {
        /// Deposits specified amount of ERC20 tokens into the contract's treasury
        /// @param token The contract address of the ERC20 token to deposit
        /// @param amount The amount of tokens to deposit
        /// @dev Transfers tokens from caller to contract and updates balances
        fn deposit(ref self: ContractState, token: ContractAddress, amount: TokenAmount) {
            assert(amount.is_non_zero(), 'Amount is zero');
            let token_dispatcher = IERC20Dispatcher { contract_address: token };
            let (depositor, contract) = (get_caller_address(), get_contract_address());

            assert(
                token_dispatcher.allowance(depositor, contract) >= amount, 'Insufficient allowance',
            );
            assert(token_dispatcher.balance_of(depositor) >= amount, 'Insufficient balance');

            let user_balance = self.treasury_balances.entry((depositor, token)).read();
            self.treasury_balances.entry((depositor, token)).write(user_balance + amount);

            let pool_value = self.pools.entry(token).read();
            self.pools.entry(token).write(pool_value + amount);

            token_dispatcher.transfer_from(depositor, contract, amount);

            self.emit(Deposit { depositor, token, amount });
        }

        fn withdraw(ref self: ContractState, token: ContractAddress, amount: TokenAmount) {}

        // TODO: Add Ekubo data for swap
        fn open_margin_position(ref self: ContractState, position_parameters: PositionParameters) {}
        fn close_position(ref self: ContractState) {}
        fn liquidate(ref self: ContractState, user: ContractAddress) {}
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
            ekubo::components::shared_locker::handle_delta(
                core, pool_key.token0, delta.amount0, caller
            );
            ekubo::components::shared_locker::handle_delta(
                core, pool_key.token1, delta.amount1, caller
            );

            let mut arr: Array<felt252> = ArrayTrait::new();
            Serde::serialize(@delta, ref arr);
            arr.span()
        }
    }
}
