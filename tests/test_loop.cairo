use ekubo::interfaces::core::{SwapParameters};
use ekubo::interfaces::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
use ekubo::types::i129::{i129};
use ekubo::types::keys::{PoolKey};

use snforge_std::cheatcodes::execution_info::caller_address::{
    start_cheat_caller_address, stop_cheat_caller_address
};
use snforge_std::{declare, DeclareResultTrait, ContractClassTrait};
use spotnet::interfaces::{IDepositDispatcher, IDepositDispatcherTrait};
use spotnet::types::{DepositData};

use starknet::{ContractAddress, get_caller_address};

pub const EKUBO_CORE_MAINNET: felt252 =
    0x00000005dd3d2f4429af886cd1a3b08289dbcea99a294197e9eb43b0e0325b4b;

pub const ZKLEND_MARKET: felt252 =
    0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05;

fn deploy_user_contract(user: ContractAddress) -> IDepositDispatcher {
    let deposit_contract = declare("Deposit").unwrap().contract_class();
    let (deposit_address, _) = deposit_contract
        .deploy(@array![user.try_into().unwrap(), EKUBO_CORE_MAINNET, ZKLEND_MARKET])
        .expect('Deploy failed');
    IDepositDispatcher { contract_address: deposit_address }
}

#[test]
#[fork("MAINNET")]
fn test_loop_base_token_zklend() {
    // println!("2: {amount}");
    let usdc_addr: ContractAddress =
        0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
        .try_into()
        .unwrap();
    let eth_addr: ContractAddress =
        0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
        .try_into()
        .unwrap();
    let user: ContractAddress = 0x059a943ca214c10234b9a3b61c558ac20c005127d183b86a99a8f3c60a08b4ff
        .try_into()
        .unwrap();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: 170141183460469235273462165868118016,
        tick_spacing: 1000,
        extension: 0.try_into().unwrap()
    };
    let pool_price = 2600000000;
    let token_disp = IERC20Dispatcher { contract_address: eth_addr };
    let deposit_disp = deploy_user_contract(user);
    start_cheat_caller_address(eth_addr.try_into().unwrap(), user);
    // token_disp.approve(deposit_disp.contract_address, amount.into());
    token_disp.approve(deposit_disp.contract_address, 68500000000000);
    stop_cheat_caller_address(eth_addr);

    deposit_disp
        .loop_liquidity(
            DepositData { token: eth_addr, amount: 68500000000000, multiplier: 4 },
            pool_key,
            pool_price
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

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: 170141183460469235273462165868118016,
        tick_spacing: 1000,
        extension: 0.try_into().unwrap()
    };
    let pool_price = 370000000000000;
    let token_disp = IERC20Dispatcher { contract_address: usdc_addr };
    let disp = deploy_user_contract(user);
    start_cheat_caller_address(usdc_addr.try_into().unwrap(), user);
    token_disp.approve(disp.contract_address, 60000000);
    stop_cheat_caller_address(usdc_addr);

    disp
        .loop_liquidity(
            DepositData { token: usdc_addr, amount: 60000000, multiplier: 4 }, pool_key, pool_price
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

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: 170141183460469235273462165868118016,
        tick_spacing: 1000,
        extension: 0.try_into().unwrap()
    };
    let pool_price = 410000000000000;

    let disp = deploy_user_contract(0x1223.try_into().unwrap());
    start_cheat_caller_address(disp.contract_address, user);
    disp
        .loop_liquidity(
            DepositData { token: usdc_addr, amount: 10000000, multiplier: 4 }, pool_key, pool_price
        );
    stop_cheat_caller_address(disp.contract_address);
}

#[test]
#[fork("MAINNET")]
fn test_close_position_base_token() {
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

    // let deposit_contract = disp.deploy_user_contract();
    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: 170141183460469235273462165868118016,
        tick_spacing: 1000,
        extension: 0.try_into().unwrap()
    };
    let pool_price = 2400000000;
    let quote_token_price = 410182369224320;
    let token_disp = IERC20Dispatcher { contract_address: eth_addr };
    let deposit_disp = deploy_user_contract(user);
    println!("Balance before: {}", token_disp.balanceOf(user));
    start_cheat_caller_address(eth_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, 685000000000000);
    stop_cheat_caller_address(eth_addr);
    deposit_disp
        .loop_liquidity(
            DepositData { token: eth_addr, amount: 685000000000000, multiplier: 3 },
            pool_key,
            pool_price
        );
    println!("Balance mid: {}", token_disp.balanceOf(user));
    deposit_disp.close_position(eth_addr, usdc_addr, pool_key, pool_price, quote_token_price);
    println!("Balance after: {}", token_disp.balanceOf(user));
}

#[test]
#[fork("MAINNET")]
fn test_loop_dai() {
    let usdc_addr: ContractAddress =
        0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
        .try_into()
        .unwrap();
    let dai_addr: ContractAddress =
        0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3
        .try_into()
        .unwrap();
    let user: ContractAddress = 0x0038925b0bcf4dce081042ca26a96300d9e181b910328db54a6c89e5451503f5
        .try_into()
        .unwrap();

    let pool_key = PoolKey {
        token0: dai_addr,
        token1: usdc_addr,
        fee: 0xa7c6a3aab97597fb9b6713851eb8,
        tick_spacing: 10,
        extension: 0.try_into().unwrap()
    };
    let pool_price = 960904;
    let quote_token_price = 1033974330230609190;
    let token_disp = IERC20Dispatcher { contract_address: dai_addr };
    let deposit_disp = deploy_user_contract(user);
    println!("Balance before: {}", token_disp.balanceOf(user));
    start_cheat_caller_address(dai_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, 6850000000000000000);
    stop_cheat_caller_address(dai_addr);
    deposit_disp
        .loop_liquidity(
            DepositData { token: dai_addr, amount: 6850000000000000000, multiplier: 2 },
            pool_key,
            pool_price
        );
    println!("Balance after: {}", token_disp.balanceOf(user));
}
// #[test]
// #[fork("MAINNET")]
// fn test_close_position_quote_token() {
//     // let core = deploy_core(EKUBO_CORE_MAINNET);
//     // let disp = ICoreDispatcher { contract_address: core.contract_address };

//     let usdc_addr: ContractAddress =
//         0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
//         .try_into()
//         .unwrap();
//     let eth_addr: ContractAddress =
//         0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
//         .try_into()
//         .unwrap();
//     let user: ContractAddress =
//     0x0038925b0bcf4dce081042ca26a96300d9e181b910328db54a6c89e5451503f5
//         .try_into()
//         .unwrap();
//     let deposit_contract = 0.try_into().unwrap();
//     // let deposit_contract = disp.deploy_user_contract();

//     let pool_key = PoolKey {
//         token0: eth_addr,
//         token1: usdc_addr,
//         fee: 170141183460469235273462165868118016,
//         tick_spacing: 1000,
//         extension: 0.try_into().unwrap()
//     };
//     let supply_price = 390182369224320;
//     let debt_price = 2330000000;
//     let token_disp = IERC20Dispatcher { contract_address: usdc_addr };
//     let deposit_disp = IDepositDispatcher { contract_address: deposit_contract };
//     start_cheat_caller_address(usdc_addr.try_into().unwrap(), user);
//     token_disp.approve(deposit_contract, 10000000);
//     stop_cheat_caller_address(usdc_addr);
//     deposit_disp
//         .loop_liquidity(
//             DepositData { token: usdc_addr, amount: 10000000, multiplier: 3 },
//             pool_key,
//             supply_price,
//             user
//         );
//     deposit_disp.close_position(usdc_addr, eth_addr, pool_key, supply_price, debt_price);
// }


