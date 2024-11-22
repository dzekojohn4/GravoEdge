use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};

use spotnet::interfaces::{
    IVaultDispatcher, IVaultDispatcherTrait,
};
use snforge_std::{
     replace_bytecode, store, cheat_caller_address, CheatSpan
};
use starknet::ContractAddress;
const HYPOTHETICAL_OWNER_ADDR: felt252 = 0x56789;

#[test]
fn call_and_invoke() {
    let user: ContractAddress = 0x059a943ca214c10234b9a3b61c558ac20c005127d183b86a99a8f3c60a08b4ff
    .try_into()
    .unwrap();

    let contract = declare("Vault").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@array![HYPOTHETICAL_OWNER_ADDR.try_into().unwrap()]).unwrap();

    // Create a Dispatcher object that will allow interacting with the deployed contract
    let dispatcher = IVaultDispatcher { contract_address };

    // Call a view function of the contract
    let balance = dispatcher.store_liquidity();
    assert(balance == 0, 'balance == 0');

    // Call a function of the contract
    // Here we mutate the state of the storage
    dispatcher.increase_balance(100);

    // Check that transaction took effect
    let balance = dispatcher.get_balance();
    assert(balance == 100, 'balance == 100');
}