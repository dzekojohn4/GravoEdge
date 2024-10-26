use my_project::interfaces::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
use my_project::interfaces::airdrop::{IAirdropDispatcher, IAirdropDispatcherTrait};
use my_project::types::keys::{AirdropKey};
use my_project::types::i129::{i129};

use starknet::{ContractAddress};

pub const AIRDROP_CONTRACT_ADDRESS: felt252 =
    0x00000001abcdef1234567890abcdef1234567890abcdef1234567890abcdef;

fn deploy_airdrop_contract(user: ContractAddress) -> IAirdropDispatcher {
    let airdrop_contract = declare("Airdrop").unwrap().contract_class();
    let (airdrop_address, _) = airdrop_contract.deploy(@array![user.try_into().unwrap()]).expect('Deploy failed');
    IAirdropDispatcher {contract_address: airdrop_address}
}

#[test]
#[fork("MAINNET")]
fn test_airdrop_distribution() {
    let user: ContractAddress = 0x0038925b0bcf4dce081042ca26a96300d9e181b910328db54a6c89e5451503f5
        .try_into()
        .unwrap();
    let token_addr: ContractAddress =
        0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
        .try_into()
        .unwrap();

    let airdrop_disp = deploy_airdrop_contract(user);
    let amount_to_airdrop = i129 { mag: 1000000, sign: false };

    // Simulating the airdrop distribution
    airdrop_disp.airdrop(token_addr, amount_to_airdrop, user);

    // Asserting the balance after airdrop
    let token_disp = IERC20Dispatcher { contract_address: token_addr };
    let balance_after_airdrop = token_disp.balanceOf(user);
    
    assert(balance_after_airdrop.mag == amount_to_airdrop.mag, 'Airdrop amount not distributed correctly');
}

#[test]
#[fork("MAINNET")]
fn test_airdrop_with_invalid_user() {
    let invalid_user: ContractAddress = 0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff
        .try_into()
        .unwrap();
    let token_addr: ContractAddress =
        0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
        .try_into()
        .unwrap();

    let airdrop_disp = deploy_airdrop_contract(invalid_user);
    let amount_to_airdrop = i129 { mag: 500000, sign: false };

    // Expecting a panic due to invalid user
    assert_panics({
        airdrop_disp.airdrop(token_addr, amount_to_airdrop, invalid_user);
    }, 'Expected a panic when attempting to airdrop to an invalid user');
}

#[test]
#[fork("MAINNET")]
fn test_airdrop_limit_exceeded() {
    let user: ContractAddress = 0x0038925b0bcf4dce081042ca26a96300d9e181b910328db54a6c89e5451503f5
        .try_into()
        .unwrap();
    let token_addr: ContractAddress =
        0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
        .try_into()
        .unwrap();

    let airdrop_disp = deploy_airdrop_contract(user);
    let exceeding_amount = i129 { mag: 100000000000, sign: false }; // Amount exceeds limit

    // Expecting a panic due to amount exceeding limit
    assert_panics({
        airdrop_disp.airdrop(token_addr, exceeding_amount, user);
    }, 'Expected a panic when attempting to airdrop amount exceeding limit');
}

#[test]
#[fork("MAINNET")]
fn test_airdrop_multiple_users() {
    let user1: ContractAddress = 0x0038925b0bcf4dce081042ca26a96300d9e181b910328db54a6c89e5451503f5
        .try_into()
        .unwrap();
    let user2: ContractAddress = 0x0abcdeff1234567890abcdefabcdefabcdefabcdefabcdef1234567890abcdef
        .try_into()
        .unwrap();
    let token_addr: ContractAddress =
        0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
        .try_into()
        .unwrap();

    let airdrop_disp = deploy_airdrop_contract(user1);
    let amount_to_airdrop = i129 { mag: 100000, sign: false };

    // Simulating airdrop to multiple users
    airdrop_disp.airdrop(token_addr, amount_to_airdrop, user1);
    airdrop_disp.airdrop(token_addr, amount_to_airdrop, user2);

    // Asserting the balances after airdrop
    let token_disp1 = IERC20Dispatcher { contract_address: token_addr };
    let token_disp2 = IERC20Dispatcher { contract_address: token_addr };

    assert(token_disp1.balanceOf(user1).mag == amount_to_airdrop.mag, 'Airdrop amount not distributed to user1');
    assert(token_disp2.balanceOf(user2).mag == amount_to_airdrop.mag, 'Airdrop amount not distributed to user2');
}
