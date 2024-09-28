export const abi = [
    {"type": "impl", "name": "CoreImpl", "interface_name": "spotnet::core::ICore"},
    {
        "type": "enum",
        "name": "core::bool",
        "variants": [{"name": "False", "type": "()"}, {"name": "True", "type": "()"}]
    }, {
        "type": "struct",
        "name": "ekubo::types::i129::i129",
        "members": [{"name": "mag", "type": "core::integer::u128"}, {"name": "sign", "type": "core::bool"}]
    }, {
        "type": "struct",
        "name": "core::integer::u256",
        "members": [{"name": "low", "type": "core::integer::u128"}, {"name": "high", "type": "core::integer::u128"}]
    }, {
        "type": "struct",
        "name": "ekubo::interfaces::core::SwapParameters",
        "members": [{"name": "amount", "type": "ekubo::types::i129::i129"}, {
            "name": "is_token1",
            "type": "core::bool"
        }, {"name": "sqrt_ratio_limit", "type": "core::integer::u256"}, {
            "name": "skip_ahead",
            "type": "core::integer::u128"
        }]
    }, {
        "type": "struct",
        "name": "ekubo::types::keys::PoolKey",
        "members": [{"name": "token0", "type": "core::starknet::contract_address::ContractAddress"}, {
            "name": "token1",
            "type": "core::starknet::contract_address::ContractAddress"
        }, {"name": "fee", "type": "core::integer::u128"}, {
            "name": "tick_spacing",
            "type": "core::integer::u128"
        }, {"name": "extension", "type": "core::starknet::contract_address::ContractAddress"}]
    }, {
        "type": "struct",
        "name": "spotnet::types::SwapData",
        "members": [{"name": "params", "type": "ekubo::interfaces::core::SwapParameters"}, {
            "name": "pool_key",
            "type": "ekubo::types::keys::PoolKey"
        }, {"name": "caller", "type": "core::starknet::contract_address::ContractAddress"}]
    }, {
        "type": "struct",
        "name": "ekubo::types::delta::Delta",
        "members": [{"name": "amount0", "type": "ekubo::types::i129::i129"}, {
            "name": "amount1",
            "type": "ekubo::types::i129::i129"
        }]
    }, {
        "type": "struct",
        "name": "spotnet::types::SwapResult",
        "members": [{"name": "delta", "type": "ekubo::types::delta::Delta"}]
    }, {
        "type": "struct",
        "name": "spotnet::types::DepositData",
        "members": [{"name": "token", "type": "core::starknet::contract_address::ContractAddress"}, {
            "name": "amount",
            "type": "core::integer::u256"
        }, {"name": "multiplier", "type": "core::integer::u32"}]
    }, {
        "type": "struct",
        "name": "core::array::Span::<(core::starknet::contract_address::ContractAddress, core::integer::u256)>",
        "members": [{
            "name": "snapshot",
            "type": "@core::array::Array::<(core::starknet::contract_address::ContractAddress, core::integer::u256)>"
        }]
    }, {
        "type": "struct",
        "name": "spotnet::types::DepositsHistory",
        "members": [{
            "name": "deposited",
            "type": "core::array::Span::<(core::starknet::contract_address::ContractAddress, core::integer::u256)>"
        }, {
            "name": "borrowed",
            "type": "core::array::Span::<(core::starknet::contract_address::ContractAddress, core::integer::u256)>"
        }]
    }, {
        "type": "interface",
        "name": "spotnet::core::ICore",
        "items": [{
            "type": "function",
            "name": "swap",
            "inputs": [{"name": "swap_data", "type": "spotnet::types::SwapData"}],
            "outputs": [{"type": "spotnet::types::SwapResult"}],
            "state_mutability": "external"
        }, {
            "type": "function",
            "name": "loop_liquidity",
            "inputs": [{"name": "deposit_data", "type": "spotnet::types::DepositData"}, {
                "name": "pool_key",
                "type": "ekubo::types::keys::PoolKey"
            }, {"name": "pool_price", "type": "core::integer::u256"}, {
                "name": "caller",
                "type": "core::starknet::contract_address::ContractAddress"
            }],
            "outputs": [],
            "state_mutability": "external"
        }, {
            "type": "function",
            "name": "get_deposits_data",
            "inputs": [],
            "outputs": [{"type": "spotnet::types::DepositsHistory"}],
            "state_mutability": "view"
        }]
    }, {"type": "impl", "name": "Locker", "interface_name": "ekubo::interfaces::core::ILocker"}, {
        "type": "struct",
        "name": "core::array::Span::<core::felt252>",
        "members": [{"name": "snapshot", "type": "@core::array::Array::<core::felt252>"}]
    }, {
        "type": "interface",
        "name": "ekubo::interfaces::core::ILocker",
        "items": [{
            "type": "function",
            "name": "locked",
            "inputs": [{"name": "id", "type": "core::integer::u32"}, {
                "name": "data",
                "type": "core::array::Span::<core::felt252>"
            }],
            "outputs": [{"type": "core::array::Span::<core::felt252>"}],
            "state_mutability": "external"
        }]
    }, {
        "type": "struct",
        "name": "ekubo::interfaces::core::ICoreDispatcher",
        "members": [{"name": "contract_address", "type": "core::starknet::contract_address::ContractAddress"}]
    }, {
        "type": "struct",
        "name": "spotnet::interfaces::IMarketDispatcher",
        "members": [{"name": "contract_address", "type": "core::starknet::contract_address::ContractAddress"}]
    }, {
        "type": "constructor",
        "name": "constructor",
        "inputs": [{"name": "ekubo_core", "type": "ekubo::interfaces::core::ICoreDispatcher"}, {
            "name": "zk_market",
            "type": "spotnet::interfaces::IMarketDispatcher"
        }]
    }, {
        "type": "event",
        "name": "spotnet::core::Core::LiquidityLooped",
        "kind": "struct",
        "members": [{"name": "initial_amount", "type": "core::integer::u256", "kind": "data"}, {
            "name": "deposited",
            "type": "core::integer::u256",
            "kind": "data"
        }, {
            "name": "token_deposit",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
        }, {"name": "borrowed", "type": "core::integer::u256", "kind": "data"}, {
            "name": "token_borrowed",
            "type": "core::starknet::contract_address::ContractAddress",
            "kind": "data"
        }]
    }, {
        "type": "event",
        "name": "spotnet::core::Core::Event",
        "kind": "enum",
        "variants": [{"name": "LiquidityLooped", "type": "spotnet::core::Core::LiquidityLooped", "kind": "nested"}]
    }
];
