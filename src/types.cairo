use ekubo::interfaces::core::SwapParameters;
use ekubo::types::delta::Delta;
use ekubo::types::keys::PoolKey;
use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
pub struct SwapResult {
    pub delta: Delta,
}

#[derive(Copy, Drop, Serde)]
pub struct SwapData {
    pub params: SwapParameters,
    pub pool_key: PoolKey,
    pub caller: ContractAddress
}
