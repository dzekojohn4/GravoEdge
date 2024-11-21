#[starknet::interface]
trait IVaultContract<TContractState> {
    fn store_liquidity(ref self: TContractState, amount: u256);
    fn withdraw_liquidity(ref self: TContractState, amount: u256);
}

#[starknet::contract]
mod Vault {
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map
    };
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

        use starknet::ContractAddress;
        use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::upgrades::UpgradeableComponent;
    use openzeppelin::upgrades::interface::IUpgradeable;

    use starknet::ClassHash;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    /// Ownable
    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    /// Upgradeable
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        token_address: ContractAddress,
        amounts: Map<ContractAddress, u256>,

        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage

    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        LiquidityAdded: LiquidityAdded,
        LiquidityWithdrawn: LiquidityWithdrawn,
    }

    #[derive(Drop, starknet::Event)]
    struct LiquidityAdded {
        #[key]
        user: ContractAddress,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct LiquidityWithdrawn {
        #[key]
        user: ContractAddress,
        amount: u256,
    }



    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl UpgradeableImpl of IUpgradeable<ContractState> {
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            // This function can only be called by the owner
            self.ownable.assert_only_owner();

            // Replace the class hash upgrading the contract
            self.upgradeable.upgrade(new_class_hash);
        }
    }




    #[abi(embed_v0)]
    impl VaultContractImpl of super::IVaultContract<ContractState> {
        fn store_liquidity(ref self: ContractState, amount: u256) {
            let caller = starknet::get_caller_address();
            let vault_contract = starknet::get_contract_address();
            let token_address = self.token_address.read();

            // transfer token to vault
            IERC20Dispatcher{contract_address: token_address}.transfer_from(caller, vault_contract, amount);

            // update new amount 
            self.amounts.entry(caller).write(self.amounts.entry(caller).read() + amount);

            self.emit(LiquidityAdded{user: caller, amount: amount});
        }
        
        fn withdraw_liquidity(ref self: ContractState, amount: u256) {
            let caller = starknet::get_caller_address();
            let token_address = self.token_address.read();
            let current_amount = self.amounts.entry(caller).read();
            assert(current_amount >= amount, 'Not enough tokens to withdraw');

            // transfer token to user
            IERC20Dispatcher{contract_address: token_address}.transfer(caller, amount);

            // update new amount 
            self.amounts.entry(caller).write(self.amounts.entry(caller).read() - amount);

            self.emit(LiquidityWithdrawn{user: caller, amount: amount});
        }
    }
}
