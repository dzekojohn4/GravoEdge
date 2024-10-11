use ekubo::interfaces::core::{SwapParameters};
use ekubo::interfaces::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
use ekubo::types::i129::{i129};
use ekubo::types::keys::{PoolKey};

use openzeppelin::upgrades::interface::{IUpgradeableDispatcher, IUpgradeableDispatcherTrait};

use snforge_std::cheatcodes::execution_info::caller_address::{
    start_cheat_caller_address, stop_cheat_caller_address
};
use snforge_std::{declare, DeclareResultTrait, ContractClassTrait, get_class_hash};
use spotnet::constants::{EKUBO_CORE_MAINNET};
use spotnet::interfaces::{
    ICoreDispatcher, ICoreDispatcherTrait, IDepositDispatcher, IDepositDispatcherTrait
};
use spotnet::types::{SwapData, DepositData};

use starknet::{ContractAddress, ClassHash};

fn deploy_core(ekubo_core: felt252) -> ICoreDispatcher {
    // let _ = declare("Deposit");
    let core = declare("Core").unwrap().contract_class();
    let users_contract_hash = declare("Deposit").unwrap().contract_class().class_hash;
    let core_owner = 0x123;
    let (contract_address, _) = core
        .deploy(@array![core_owner, (*users_contract_hash).try_into().unwrap()])
        .expect('Deploy failed');

    ICoreDispatcher { contract_address }
}

#[test]
#[fork("MAINNET")]
fn test_deploy_valid() {
    let swapper = deploy_core(EKUBO_CORE_MAINNET);
    let disp = ICoreDispatcher { contract_address: swapper.contract_address };
    let deposit_contract = disp.deploy_user_contract();
}

#[test]
#[should_panic(expected: 'Contract already exists')]
#[fork("MAINNET")]
fn test_deploy_exists() {
    let core = deploy_core(EKUBO_CORE_MAINNET);
    let disp = ICoreDispatcher { contract_address: core.contract_address };
    disp.deploy_user_contract();
    disp.deploy_user_contract();
}

#[test]
#[fork("MAINNET")]
fn test_quote_for_base_mainnet() {
    let user: ContractAddress = 0x0038925b0bcf4dce081042ca26a96300d9e181b910328db54a6c89e5451503f5
        .try_into()
        .unwrap();
    let strk_addr: ContractAddress =
        0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
        .try_into()
        .unwrap();
    let eth_addr: ContractAddress =
        0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
        .try_into()
        .unwrap();
    let core = deploy_core(EKUBO_CORE_MAINNET);
    let user_contract = core.deploy_user_contract();

    let pool_key = PoolKey {
        token0: strk_addr,
        token1: eth_addr,
        fee: 170141183460469235273462165868118016,
        tick_spacing: 1000,
        extension: 0.try_into().unwrap()
    };
    let params = SwapParameters {
        amount: i129 { mag: 10000000000000, sign: false },
        is_token1: false,
        sqrt_ratio_limit: 18446748437148339061,
        skip_ahead: 0
    };
    let token_disp = IERC20Dispatcher {
        contract_address: if params.is_token1 {
            eth_addr
        } else {
            strk_addr
        }
    };
    let deposit_dispatcher = IDepositDispatcher { contract_address: user_contract };
    let disp = IERC20Dispatcher { contract_address: strk_addr };
    println!("My bal ETH: {}", token_disp.balanceOf(user));
    println!("My bal STRK: {}", disp.balanceOf(user));

    start_cheat_caller_address(token_disp.contract_address, user);
    token_disp.approve(user_contract, params.amount.mag.into());
    stop_cheat_caller_address(token_disp.contract_address);

    let res = deposit_dispatcher.swap(SwapData { params: params, pool_key, caller: user });
    assert(res.delta.amount0.mag == params.amount.mag, 'Amount not swapped');
}

#[test]
#[fork("MAINNET")]
fn test_both_directions_mainnet() {
    let user: ContractAddress = 0x0038925b0bcf4dce081042ca26a96300d9e181b910328db54a6c89e5451503f5
        .try_into()
        .unwrap();
    let usdc_addr: ContractAddress =
        0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
        .try_into()
        .unwrap();
    let eth_addr: ContractAddress =
        0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
        .try_into()
        .unwrap();

    let swapper = deploy_core(EKUBO_CORE_MAINNET);
    let core = deploy_core(EKUBO_CORE_MAINNET);
    let user_contract = core.deploy_user_contract();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: 170141183460469235273462165868118016,
        tick_spacing: 1000,
        extension: 0.try_into().unwrap()
    };
    let params = SwapParameters {
        amount: i129 { mag: 1000000, sign: false },
        is_token1: true,
        sqrt_ratio_limit: 6277100250585753475930931601400621808602321654880405518632,
        skip_ahead: 0
    };
    let token_disp = IERC20Dispatcher {
        contract_address: if params.is_token1 {
            usdc_addr
        } else {
            eth_addr
        }
    };
    let disp = IERC20Dispatcher { contract_address: eth_addr };
    println!("My bal USDC: {}", token_disp.balanceOf(user));
    println!("My bal ETH: {}", disp.balanceOf(user));
    start_cheat_caller_address(token_disp.contract_address, user);
    token_disp.approve(user_contract, params.amount.mag.into());
    stop_cheat_caller_address(token_disp.contract_address);
    let deposit_disp = IDepositDispatcher { contract_address: user_contract };

    let res = deposit_disp.swap(SwapData { params: params, pool_key, caller: user });
    println!("Swapped: {}", res.delta.amount0.mag);

    let params2 = SwapParameters {
        amount: i129 { mag: res.delta.amount0.mag, sign: false },
        is_token1: false,
        sqrt_ratio_limit: 18446748437148339061,
        skip_ahead: 0
    };

    let token_disp = IERC20Dispatcher {
        contract_address: if params2.is_token1 {
            usdc_addr
        } else {
            eth_addr
        }
    };
    start_cheat_caller_address(token_disp.contract_address, user);
    token_disp.approve(user_contract, params2.amount.mag.into());
    stop_cheat_caller_address(token_disp.contract_address);
    let deposit_disp = IDepositDispatcher { contract_address: user_contract };
    let res = deposit_disp.swap(SwapData { params: params2, pool_key, caller: user });
    println!("My bal USDC: {}", IERC20Dispatcher { contract_address: usdc_addr }.balanceOf(user));
    println!("Swapped: {}", res.delta.amount0.mag);
}

#[test]
#[fork("MAINNET")]
fn test_loop_base_token_zklend() {
    let core = deploy_core(EKUBO_CORE_MAINNET);
    let disp = ICoreDispatcher { contract_address: core.contract_address };

    let usdc_addr: ContractAddress =
        0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
        .try_into()
        .unwrap();
    let eth_addr: ContractAddress =
        0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
        .try_into()
        .unwrap();
    let user: ContractAddress = 0x0582d5Bc3CcfCeF2F7aF1FdA976767B010E453fF487A7FD2ccf9df1524f4D8fC
        .try_into()
        .unwrap();

    let deposit_contract = disp.deploy_user_contract();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: 170141183460469235273462165868118016,
        tick_spacing: 1000,
        extension: 0.try_into().unwrap()
    };
    let pool_price = 2350000000;
    let token_disp = IERC20Dispatcher { contract_address: eth_addr };
    let deposit_disp = IDepositDispatcher { contract_address: deposit_contract };
    start_cheat_caller_address(eth_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_contract, 685000000000000);
    stop_cheat_caller_address(eth_addr);
    deposit_disp
        .loop_liquidity(
            DepositData { token: eth_addr, amount: 685000000000000, multiplier: 2 },
            pool_key,
            pool_price,
            user
        );
}

#[test]
#[fork("MAINNET")]
fn test_loop_quote_token_zklend() {
    let usdc_addr: ContractAddress =
        0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
        .try_into()
        .unwrap();
    let eth_addr: ContractAddress =
        0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
        .try_into()
        .unwrap();
    let user = 0x0038925b0bcf4dce081042ca26a96300d9e181b910328db54a6c89e5451503f5
        .try_into()
        .unwrap();

    let core = deploy_core(EKUBO_CORE_MAINNET);
    let disp = ICoreDispatcher { contract_address: core.contract_address };
    let deposit_contract = disp.deploy_user_contract();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: 170141183460469235273462165868118016,
        tick_spacing: 1000,
        extension: 0.try_into().unwrap()
    };
    let pool_price = 410000000000000;
    let token_disp = IERC20Dispatcher { contract_address: usdc_addr };

    start_cheat_caller_address(usdc_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_contract, 10000000);
    stop_cheat_caller_address(usdc_addr);

    let disp = IDepositDispatcher { contract_address: deposit_contract };
    disp
        .loop_liquidity(
            DepositData { token: usdc_addr, amount: 10000000, multiplier: 4 },
            pool_key,
            pool_price,
            user
        );
}

#[test]
#[should_panic(expected: ('Caller is not the owner',))]
#[fork("MAINNET")]
fn test_loop_unauthorized() {
    let usdc_addr: ContractAddress =
        0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
        .try_into()
        .unwrap();
    let eth_addr: ContractAddress =
        0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
        .try_into()
        .unwrap();
    let user = 0x0038925b0bcf4dce081042ca26a96300d9e181b910328db54a6c89e5451503f5
        .try_into()
        .unwrap();

    let core = deploy_core(EKUBO_CORE_MAINNET);
    let disp = ICoreDispatcher { contract_address: core.contract_address };
    let deposit_contract = disp.deploy_user_contract();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: 170141183460469235273462165868118016,
        tick_spacing: 1000,
        extension: 0.try_into().unwrap()
    };
    let pool_price = 390000000000000;

    let disp = IDepositDispatcher { contract_address: deposit_contract };
    start_cheat_caller_address(deposit_contract, user);
    disp
        .loop_liquidity(
            DepositData { token: usdc_addr, amount: 10000000, multiplier: 4 },
            pool_key,
            pool_price,
            user
        );
    stop_cheat_caller_address(deposit_contract);
}

#[test]
#[fork("MAINNET")]
fn test_upgrade_core() {
    let owner: ContractAddress = 0x123.try_into().unwrap();
    let new_class_hash: ClassHash =
        0x030e64ecb769ff832478ed5ce52fc5b81ffc7d32dd36cd9b8937135683339a2c
        .try_into()
        .unwrap();
    let core = deploy_core(EKUBO_CORE_MAINNET);
    let upgr = IUpgradeableDispatcher { contract_address: core.contract_address };
    start_cheat_caller_address(core.contract_address, owner);
    upgr.upgrade(new_class_hash);
    stop_cheat_caller_address(core.contract_address);
    assert(get_class_hash(core.contract_address) == new_class_hash, 'Not upgraded');
}

#[test]
#[should_panic(expected: ('Caller is not the owner',))]
#[fork("MAINNET")]
fn test_upgrade_core_unauthorized() {
    let new_class_hash: ClassHash =
        0x030e64ecb769ff832478ed5ce52fc5b81ffc7d32dd36cd9b8937135683339a2c
        .try_into()
        .unwrap();
    let core = deploy_core(EKUBO_CORE_MAINNET);
    let upgr = IUpgradeableDispatcher { contract_address: core.contract_address };
    upgr.upgrade(new_class_hash);
}

#[test]
#[fork("MAINNET")]
fn test_close_position_base_token() {
    let core = deploy_core(EKUBO_CORE_MAINNET);
    let disp = ICoreDispatcher { contract_address: core.contract_address };

    let usdc_addr: ContractAddress =
        0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
        .try_into()
        .unwrap();
    let eth_addr: ContractAddress =
        0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
        .try_into()
        .unwrap();
    let user: ContractAddress = 0x0582d5Bc3CcfCeF2F7aF1FdA976767B010E453fF487A7FD2ccf9df1524f4D8fC
        .try_into()
        .unwrap();

    let deposit_contract = disp.deploy_user_contract();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: 170141183460469235273462165868118016,
        tick_spacing: 1000,
        extension: 0.try_into().unwrap()
    };
    let pool_price = 2330000000;
    let quote_token_price = 390182369224320;
    let token_disp = IERC20Dispatcher { contract_address: eth_addr };
    let deposit_disp = IDepositDispatcher { contract_address: deposit_contract };
    start_cheat_caller_address(eth_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_contract, 685000000000000);
    stop_cheat_caller_address(eth_addr);
    deposit_disp
        .loop_liquidity(
            DepositData { token: eth_addr, amount: 685000000000000, multiplier: 4 },
            pool_key,
            pool_price,
            user
        );
    deposit_disp.close_position(eth_addr, usdc_addr, pool_key, pool_price, quote_token_price);
}

#[test]
#[fork("MAINNET")]
fn test_close_position_quote_token() {
    let core = deploy_core(EKUBO_CORE_MAINNET);
    let disp = ICoreDispatcher { contract_address: core.contract_address };

    let usdc_addr: ContractAddress =
        0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
        .try_into()
        .unwrap();
    let eth_addr: ContractAddress =
        0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
        .try_into()
        .unwrap();
    let user: ContractAddress = 0x0038925b0bcf4dce081042ca26a96300d9e181b910328db54a6c89e5451503f5
        .try_into()
        .unwrap();

    let deposit_contract = disp.deploy_user_contract();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: 170141183460469235273462165868118016,
        tick_spacing: 1000,
        extension: 0.try_into().unwrap()
    };
    let supply_price = 390182369224320;
    let debt_price = 2330000000;
    let token_disp = IERC20Dispatcher { contract_address: usdc_addr };
    let deposit_disp = IDepositDispatcher { contract_address: deposit_contract };
    start_cheat_caller_address(usdc_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_contract, 10000000);
    stop_cheat_caller_address(usdc_addr);
    deposit_disp
        .loop_liquidity(
            DepositData { token: usdc_addr, amount: 10000000, multiplier: 3 },
            pool_key,
            supply_price,
            user
        );
    deposit_disp.close_position(usdc_addr, eth_addr, pool_key, supply_price, debt_price);
}

#[test]
#[fork("MAINNET")]
fn test_get_deposit() {
    let core = deploy_core(EKUBO_CORE_MAINNET);
    let disp = ICoreDispatcher { contract_address: core.contract_address };
    let deposit_contract = disp.deploy_user_contract();
    let deposit_disp = IDepositDispatcher { contract_address: deposit_contract };
    deposit_disp
        .get_user_deposit(
            0x123.try_into().unwrap(),
            0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d.try_into().unwrap()
        );
}

#[test]
#[fork("MAINNET")]
fn test_get_loan() {
    let core = deploy_core(EKUBO_CORE_MAINNET);
    let disp = ICoreDispatcher { contract_address: core.contract_address };
    let deposit_contract = disp.deploy_user_contract();
    let deposit_disp = IDepositDispatcher { contract_address: deposit_contract };
    deposit_disp
        .get_user_loan(
            0x123.try_into().unwrap(),
            0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d.try_into().unwrap()
        );
}
//// Implement looping through STRK and other tokens
// #[test]
// #[fork("MAINNET")]
// fn test_loop_eth_strk_token_zklend() {
//     let strk_addr: ContractAddress =
//         0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
//         .try_into()
//         .unwrap();
//     let eth_addr: ContractAddress =
//         0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
//         .try_into()
//         .unwrap();
//     let user = 0x0038925b0bcf4dce081042ca26a96300d9e181b910328db54a6c89e5451503f5
//         .try_into()
//         .unwrap();

//     let swapper = deploy_core(EKUBO_CORE_MAINNET);
//     let pool_key = PoolKey {
//         token0: strk_addr,
//         token1: eth_addr,
//         fee: 0x28f5c28f5c28f5c28f5c28f5c28f5c2,
//         tick_spacing: 19802,
//         extension: 0.try_into().unwrap()
//     };
//     let pool_price = 6000000000000000000000;
//     let token_disp = IERC20Dispatcher { contract_address: eth_addr };
//     // 41600000000000000000
//     // 84674241142648157000
//     start_cheat_caller_address(eth_addr.try_into().unwrap(), user);
//     token_disp.approve(swapper.contract_address, 10000000000000000);
//     stop_cheat_caller_address(eth_addr);

//     let disp = ICoreDispatcher { contract_address: swapper.contract_address };
//     disp
//         .loop_liquidity(
//             DepositData {
//                 token: eth_addr, amount: 10000000000000000, multiplier: 3
//             }, // For now multiplier is a number of iterations
//             pool_key,
//             pool_price,
//             user
//         );
// }


