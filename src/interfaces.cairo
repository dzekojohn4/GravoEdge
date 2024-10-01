use ekubo::types::keys::PoolKey;
use spotnet::types::{MarketReserveData, SwapData, SwapResult, DepositsHistory, DepositData};
use starknet::ContractAddress;

#[starknet::interface]
pub trait ICore<TContractState> {
    fn deploy_user_contract(ref self: TContractState) -> ContractAddress;

    fn get_users_account(self: @TContractState, address: ContractAddress) -> ContractAddress;
}

#[starknet::interface]
pub trait IDeposit<TContractState> {
    fn swap(ref self: TContractState, swap_data: SwapData) -> SwapResult;

    fn loop_liquidity(
        ref self: TContractState,
        deposit_data: DepositData,
        pool_key: PoolKey,
        pool_price: u256,
        caller: ContractAddress
    );

    fn get_deposits_data(self: @TContractState) -> DepositsHistory;
}

#[starknet::interface]
pub trait IERC20<TContractState> {
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;

    fn balanceOf(self: @TContractState, account: ContractAddress) -> u256;

    fn approve(ref self: TContractState, spender: ContractAddress, amount: u256) -> bool;

    fn transferFrom(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;

    fn allowance(self: @TContractState, owner: ContractAddress, spender: ContractAddress) -> u256;

    fn decimals(self: @TContractState) -> u8;
}

#[starknet::interface]
pub trait IMarket<TContractState> {
    fn get_reserve_data(self: @TContractState, token: ContractAddress) -> MarketReserveData;
    fn get_user_debt_for_token(
        self: @TContractState, user: ContractAddress, token: ContractAddress
    ) -> felt252;

    fn deposit(ref self: TContractState, token: ContractAddress, amount: felt252);
    fn borrow(ref self: TContractState, token: ContractAddress, amount: felt252);
    fn enable_collateral(ref self: TContractState, token: ContractAddress);
}
