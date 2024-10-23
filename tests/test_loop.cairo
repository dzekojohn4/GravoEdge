use core::panic_with_felt252;

use alexandria_math::fast_power::fast_power;
use ekubo::interfaces::core::{SwapParameters, ICoreDispatcher, ICoreDispatcherTrait};
use ekubo::interfaces::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
use ekubo::types::i129::{i129};
use ekubo::types::keys::{PoolKey};
use openzeppelin_token::erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait};

use pragma_lib::abi::{IPragmaABIDispatcher, IPragmaABIDispatcherTrait};
use pragma_lib::types::{AggregationMode, DataType, PragmaPricesResponse};
use snforge_std::cheatcodes::execution_info::account_contract_address::{
    start_cheat_account_contract_address, stop_cheat_account_contract_address
};
use snforge_std::cheatcodes::execution_info::caller_address::{
    start_cheat_caller_address, stop_cheat_caller_address
};
use snforge_std::{declare, DeclareResultTrait, ContractClassTrait};
use spotnet::interfaces::{
    IDepositDispatcher, IDepositSafeDispatcher, IDepositSafeDispatcherTrait, IDepositDispatcherTrait
};
use spotnet::types::{DepositData};

use starknet::syscalls::{deploy_syscall, get_execution_info_syscall};
use starknet::{ContractAddress, get_caller_address};

mod contracts {
    pub const EKUBO_CORE_MAINNET: felt252 =
        0x00000005dd3d2f4429af886cd1a3b08289dbcea99a294197e9eb43b0e0325b4b;

    pub const ZKLEND_MARKET: felt252 =
        0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05;

    pub const PRAGMA_ADDRESS: felt252 =
        0x02a85bd616f912537c50a49a4076db02c00b29b2cdc8a197ce92ed1837fa875b;
}

mod tokens {
    pub const ETH: felt252 = 0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7;
    pub const USDC: felt252 = 0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8;
}

fn deploy_deposit_contract(user: ContractAddress) -> ContractAddress {
    let deposit_contract = declare("Deposit").unwrap().contract_class();
    let (deposit_address, _) = deposit_contract
        .deploy(
            @array![
                user.try_into().unwrap(), contracts::EKUBO_CORE_MAINNET, contracts::ZKLEND_MARKET
            ]
        )
        .expect('Deploy failed');
    deposit_address
}

fn get_deposit_dispatcher(user: ContractAddress) -> IDepositDispatcher {
    IDepositDispatcher { contract_address: deploy_deposit_contract(user) }
}

fn get_safe_deposit_dispatcher(user: ContractAddress) -> IDepositSafeDispatcher {
    IDepositSafeDispatcher { contract_address: deploy_deposit_contract(user) }
}

fn get_asset_price_pragma(pair: felt252) -> u128 {
    let oracle_dispatcher = IPragmaABIDispatcher {
        contract_address: contracts::PRAGMA_ADDRESS.try_into().unwrap()
    };
    let output: PragmaPricesResponse = oracle_dispatcher
        .get_data(DataType::SpotEntry(pair), AggregationMode::Median(()));
    output.price / 100 // Make 6 decimals wide instead of 8.
}

// fn get_token_addresses(pair: felt252) -> (ContractAddress, ContractAddress) {
//     match pair {
//         'ETH/USDC' => (tokens::ETH.try_into().unwrap(), tokens::USDC.try_into().unwrap()),
//         _ => (0.try_into().unwrap(), 1.try_into().unwrap()),
//     }
// }

// TODO: Add tests for asserts.

#[test]
#[fork("MAINNET")]
fn test_loop_eth_valid() {
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
    let pool_price = get_asset_price_pragma('ETH/USD').into();
    let token_disp = ERC20ABIDispatcher { contract_address: eth_addr };
    let deposit_disp = get_deposit_dispatcher(user);
    start_cheat_caller_address(eth_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, 685000000000000);
    stop_cheat_caller_address(eth_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp
        .loop_liquidity(
            DepositData { token: eth_addr, amount: 685000000000000, multiplier: 4 },
            pool_key,
            pool_price,
            pool_price
        );
    stop_cheat_account_contract_address(deposit_disp.contract_address);
}

#[test]
#[fuzzer(runs: 10)]
#[feature("safe_dispatcher")]
#[fork("MAINNET")]
fn test_loop_eth_fuzz(amount: u64) {
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

    let pool_price = get_asset_price_pragma('ETH/USD').into();
    let token_disp = ERC20ABIDispatcher { contract_address: eth_addr };
    let deposit_disp = get_safe_deposit_dispatcher(user);

    start_cheat_caller_address(eth_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, amount.into());
    stop_cheat_caller_address(eth_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    if let Result::Err(panic_data) = deposit_disp
        .loop_liquidity(
            DepositData { token: eth_addr, amount: amount.into(), multiplier: 4 },
            pool_key,
            pool_price,
            pool_price
        ) {
            let message = *panic_data.at(0);
            assert(
                message == 'Parameters cannot be zero'
                    || message == 'Loop amount is too small'
                    || message == 'Approved amount incuficient'
                    || message == 'Insufficient balance',
                message
            ); // Acceptable panics which can be triggered by fuzzers' values
    };
    stop_cheat_account_contract_address(deposit_disp.contract_address);
}

#[test]
#[fork("MAINNET")]
fn test_loop_usdc_valid() {
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

    let token_disp = ERC20ABIDispatcher { contract_address: usdc_addr };
    let decimals_sum_power: u128 = fast_power(
        10,
        (ERC20ABIDispatcher { contract_address: eth_addr }.decimals() + token_disp.decimals())
            .into()
    );
    let pool_price = 1 * decimals_sum_power.into() / get_asset_price_pragma('ETH/USD');
    let deposit_disp = get_deposit_dispatcher(user);
    start_cheat_caller_address(usdc_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, 60000000);
    stop_cheat_caller_address(usdc_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp
        .loop_liquidity(
            DepositData { token: usdc_addr, amount: 60000000, multiplier: 4 },
            pool_key,
            pool_price.into(),
            1000000
        );
    stop_cheat_account_contract_address(deposit_disp.contract_address);
}

#[test]
#[should_panic(expected: 'Caller is not the owner')]
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

    let decimals_sum_power: u128 = fast_power(
        10,
        (ERC20ABIDispatcher { contract_address: eth_addr }.decimals()
            + ERC20ABIDispatcher { contract_address: usdc_addr }.decimals())
            .into()
    );
    let pool_price = 1 * decimals_sum_power.into() / get_asset_price_pragma('ETH/USD');

    let disp = get_deposit_dispatcher(user);

    disp
        .loop_liquidity(
            DepositData { token: usdc_addr, amount: 10000000, multiplier: 4 },
            pool_key,
            pool_price.into(),
            1000000
        );
}

#[test]
#[should_panic(expected: 'Open position already exists')]
#[fork("MAINNET")]
fn test_loop_position_exists() {
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

    let token_disp = ERC20ABIDispatcher { contract_address: usdc_addr };
    let decimals_sum_power: u128 = fast_power(
        10,
        (ERC20ABIDispatcher { contract_address: eth_addr }.decimals() + token_disp.decimals())
            .into()
    );
    let pool_price = 1 * decimals_sum_power.into() / get_asset_price_pragma('ETH/USD');
    let deposit_disp = get_deposit_dispatcher(user);
    start_cheat_caller_address(usdc_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, 60000000);
    stop_cheat_caller_address(usdc_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp
        .loop_liquidity(
            DepositData { token: usdc_addr, amount: 60000000, multiplier: 4 },
            pool_key,
            pool_price.into(),
            1000000
        );
    deposit_disp
        .loop_liquidity(
            DepositData { token: usdc_addr, amount: 60000000, multiplier: 4 },
            pool_key,
            pool_price.into(),
            1000000
        );
    stop_cheat_account_contract_address(deposit_disp.contract_address);
}

#[test]
#[fuzzer(runs: 10)]
#[feature("safe_dispatcher")]
#[fork("MAINNET")]
fn test_loop_position_exists_fuzz(amount: u64) {
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

    let pool_price = get_asset_price_pragma('ETH/USD').into();
    let token_disp = ERC20ABIDispatcher { contract_address: eth_addr };
    let deposit_disp = get_safe_deposit_dispatcher(user);

    start_cheat_caller_address(eth_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, amount.into());
    stop_cheat_caller_address(eth_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);

    if let Result::Err(_) = deposit_disp
        .loop_liquidity(
            DepositData { token: eth_addr, amount: amount.into(), multiplier: 2 },
            pool_key,
            pool_price,
            pool_price
        ) {
        return;
    };
    match deposit_disp.loop_liquidity(
        DepositData { token: eth_addr, amount: amount.into(), multiplier: 2 },
        pool_key,
        pool_price,
        pool_price
    ) {
        Result::Ok(_) => panic_with_felt252('Not panicked with position open'),
        Result::Err(panic_data) => assert(*panic_data.at(0) == 'Open position already exists', *panic_data.at(0))
    };
    stop_cheat_account_contract_address(deposit_disp.contract_address);
}

fn test_

// #[test]
// #[fork("MAINNET")]
// fn test_close_position_base_token() {
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

//     // let deposit_contract = disp.deploy_user_contract();
//     let pool_key = PoolKey {
//         token0: eth_addr,
//         token1: usdc_addr,
//         fee: 170141183460469235273462165868118016,
//         tick_spacing: 1000,
//         extension: 0.try_into().unwrap()
//     };
//     let pool_price = 2400000000;
//     let quote_token_price = 410182369224320;
//     let token_disp = IERC20Dispatcher { contract_address: eth_addr };
//     let deposit_disp = deploy_user_contract(user);
//     println!("Balance before: {}", token_disp.balanceOf(user));
//     start_cheat_caller_address(eth_addr.try_into().unwrap(), user);
//     token_disp.approve(deposit_disp.contract_address, 685000000000000);
//     stop_cheat_caller_address(eth_addr);
//     deposit_disp
//         .loop_liquidity(
//             DepositData { token: eth_addr, amount: 685000000000000, multiplier: 3 },
//             pool_key,
//             pool_price,
//             pool_price
//         );
//     println!("Balance mid: {}", token_disp.balanceOf(user));
//     deposit_disp.close_position(eth_addr, usdc_addr, pool_key, pool_price, quote_token_price);
//     println!("Balance after: {}", token_disp.balanceOf(user));
// }

// #[test]
// #[fork("MAINNET")]
// fn test_loop_dai() {
//     let usdc_addr: ContractAddress =
//         0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8
//         .try_into()
//         .unwrap();
//     let dai_addr: ContractAddress =
//         0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3
//         .try_into()
//         .unwrap();
//     let user: ContractAddress =
//     0x0038925b0bcf4dce081042ca26a96300d9e181b910328db54a6c89e5451503f5
//         .try_into()
//         .unwrap();

//     let pool_key = PoolKey {
//         token0: dai_addr,
//         token1: usdc_addr,
//         fee: 0xa7c6a3aab97597fb9b6713851eb8,
//         tick_spacing: 10,
//         extension: 0.try_into().unwrap()
//     };
//     let pool_price = 960904;
//     let quote_token_price = 1033974330230609190;
//     let token_disp = IERC20Dispatcher { contract_address: dai_addr };
//     let deposit_disp = deploy_user_contract(user);
//     println!("Balance before: {}", token_disp.balanceOf(user));
//     start_cheat_caller_address(dai_addr.try_into().unwrap(), user);
//     token_disp.approve(deposit_disp.contract_address, 6850000000000000000);
//     stop_cheat_caller_address(dai_addr);
//     deposit_disp
//         .loop_liquidity(
//             DepositData { token: dai_addr, amount: 6850000000000000000, multiplier: 2 },
//             pool_key,
//             pool_price,
//             980000
//         );
//     println!("Balance after: {}", token_disp.balanceOf(user));
// }
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


