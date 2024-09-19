use spotnet::types::{SwapData, SwapResult};

#[starknet::interface]
pub trait ISwapper<TContractState> {
    fn swap(ref self: TContractState, swap_data: SwapData) -> SwapResult;
}

#[starknet::contract]
pub mod Swapper {
    use ekubo::components::shared_locker::handle_delta;
    use ekubo::interfaces::core::{ICoreDispatcher, ICoreDispatcherTrait, ILocker};
    use ekubo::interfaces::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
    use spotnet::types::{SwapData, SwapResult};
    use starknet::storage::StoragePointerReadAccess;
    use starknet::storage::StoragePointerWriteAccess;
    use starknet::{get_contract_address};
    use super::ISwapper;

    #[storage]
    struct Storage {
        pub core: ICoreDispatcher,
    }

    #[constructor]
    fn constructor(ref self: ContractState, core: ICoreDispatcher) {
        self.core.write(core);
    }

    #[abi(embed_v0)]
    impl SwapperImpl of ISwapper<ContractState> {
        fn swap(ref self: ContractState, swap_data: SwapData) -> SwapResult {
            let token_disp = IERC20Dispatcher {
                contract_address: if swap_data.params.is_token1 {
                    swap_data.pool_key.token1
                } else {
                    swap_data.pool_key.token0
                }
            };
            token_disp
                .approve(
                    get_contract_address(), swap_data.params.amount.mag.try_into().unwrap()
                ); // For the future, tests couldn't be mocked
            token_disp
                .transferFrom(
                    swap_data.caller,
                    get_contract_address(),
                    swap_data.params.amount.mag.try_into().unwrap()
                );

            // Ekubo Callback
            ekubo::components::shared_locker::call_core_with_callback(self.core.read(), @swap_data)
        }
    }

    #[abi(embed_v0)]
    impl Locker of ILocker<ContractState> {
        fn locked(ref self: ContractState, id: u32, data: Span<felt252>) -> Span<felt252> {
            let core = self.core.read();
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
