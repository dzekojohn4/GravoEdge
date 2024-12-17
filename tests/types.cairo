use openzeppelin::token::erc20::interface::IERC20Dispatcher;
use spotnet::interfaces::IVaultDispatcher;
use starknet::ContractAddress;
use spotnet::types::{DepositData, EkuboSlippageLimits, TokenPrice};
use ekubo::types::keys::PoolKey;

#[derive(Drop)]
pub struct VaultTestSuite {
    pub vault: IVaultDispatcher,
    pub token: IERC20Dispatcher,
    pub owner: ContractAddress,
}

#[derive(Drop)]
pub struct DepositTestSuite {
    pub deposit_address: ContractAddress,
    pub deposit_data: DepositData,
    pub pool_key: PoolKey,
    pub ekubo_limits: EkuboSlippageLimits,
    pub pool_price: TokenPrice
}
