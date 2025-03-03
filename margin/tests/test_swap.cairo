use starknet::{ContractAddress};
use openzeppelin_token::erc20::interface::{IERC20DispatcherTrait, IERC20Dispatcher};
use snforge_std::cheatcodes::execution_info::caller_address::{
    start_cheat_caller_address, stop_cheat_caller_address,
};
use margin::{
    margin::{Margin, Margin::InternalTrait}, 
    interface::{IMarginDispatcherTrait, IMarginDispatcher},
    types::{TokenAmount, SwapData}
};
use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};
use ekubo::{interfaces::core::{SwapParameters, ICoreDispatcher, ICoreDispatcherTrait}, types::{delta::Delta, keys::PoolKey, i129::i129}};

use super::{
    utils::{setup_test_suite, deploy_erc20_mock, setup_user},
    constants::{
        DEPOSIT_MOCK_USER, DEPOSIT_MOCK_USER_2, HYPOTHETICAL_OWNER_ADDR,
        tokens, pool_key, contracts::EKUBO_CORE_SEPOLIA
    },
};

#[test]
#[fork("SEPOLIA")]
fn test_swap() {
    // Declare constants
    let initial_amount = 202;
    let user: ContractAddress = DEPOSIT_MOCK_USER.try_into().unwrap();
    let usdc_addr: ContractAddress = tokens::USDC.try_into().unwrap();
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();
    let eth_test_contract: ContractAddress = 
        0x061fa009f87866652b6fcf4d8ea4b87a12f85e8cb682b912b0a79dafdbb7f362.try_into().unwrap();

    let eth_disp = IERC20Dispatcher { contract_address: eth_test_contract };
    // let contract = declare("Margin").unwrap().contract_class();

    // let (margin_contract, _) = contract.deploy(@array![]).unwrap();

    // let margin_disp = IMarginDispatcher { contract_address: margin_contract };

    println!("Before transfer");

    // Transfer tokens to user
    eth_disp.transfer(user, initial_amount);

    println!("After transfer");

    // Approve tokens

    // println!("Before approve");
    // start_cheat_caller_address(eth_owner, user);
    // eth_disp.approve(margin_disp.contract_address, initial_amount);
    // stop_cheat_caller_address(eth_owner);

    // println!("After approve");

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: pool_key::FEE,
        tick_spacing: pool_key::TICK_SPACING,
        extension: pool_key::EXTENSION.try_into().unwrap(),
    };

    // Create test state
    let mut state = Margin::contract_state_for_testing();
    state.ekubo_core.write(
        ICoreDispatcher { contract_address: EKUBO_CORE_SEPOLIA.try_into().unwrap() }
    );

    // Get sqrt_ratio from ekubo core
    let sqrt_ratio = state.ekubo_core.read().get_pool_price(pool_key).sqrt_ratio;
    
    let swap_data =  SwapData{
        params: SwapParameters {
            amount: i129 {mag: initial_amount.try_into().unwrap(), sign: false},
            is_token1: false,
            sqrt_ratio_limit: sqrt_ratio,
            skip_ahead: 0,
        },
        pool_key,
        caller: user
    };

    // Get delta afert swapping
    println!("Before swap");
    let delta = state.swap(swap_data);
    println!("After swap");

    println!("Delta: {:?}", delta);
}

