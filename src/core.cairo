#[starknet::contract]
pub mod Core {
    use OwnableComponent::InternalTrait;
    use core::num::traits::Zero;

    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::upgrades::UpgradeableComponent;
    use openzeppelin::upgrades::interface::IUpgradeable;

    use spotnet::constants::{EKUBO_CORE_MAINNET, ZKLEND_MARKET};

    use spotnet::interfaces::{ICore};
    use starknet::storage::StoragePointerReadAccess;
    use starknet::storage::StoragePointerWriteAccess;

    use starknet::storage::{Map, StorageMapWriteAccess, StorageMapReadAccess};
    use starknet::syscalls::deploy_syscall;
    use starknet::{ContractAddress, ClassHash};
    use starknet::{get_caller_address};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    #[abi(embed_v0)]
    impl OwnableMixinImpl = OwnableComponent::OwnableMixinImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        user_contracts: Map<ContractAddress, ContractAddress>,
        user_contract_class_hash: ClassHash,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage
    }

    #[constructor]
    fn constructor(
        ref self: ContractState, owner: ContractAddress, user_contract_class_hash: ClassHash
    ) {
        self.ownable.initializer(owner);
        self.user_contract_class_hash.write(user_contract_class_hash);
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event
    }

    #[abi(embed_v0)]
    impl CoreImpl of ICore<ContractState> {
        fn deploy_user_contract(ref self: ContractState) -> ContractAddress {
            let caller = get_caller_address();
            assert(self.user_contracts.read(caller).is_zero(), 'Contract already exists');
            let res = deploy_syscall(
                self.user_contract_class_hash.read(),
                caller.into(),
                array![caller.try_into().unwrap(), EKUBO_CORE_MAINNET, ZKLEND_MARKET].span(),
                false
            );
            let (address, _) = res.expect('Could not deploy your contract');
            self.user_contracts.write(caller, address);
            address
        }

        fn get_users_account(self: @ContractState, address: ContractAddress) -> ContractAddress {
            self.user_contracts.read(address)
        }

        fn upgrade_user_contract(ref self: ContractState, new_hash: ClassHash) {
            self.ownable.assert_only_owner();
            assert(new_hash.is_non_zero(), 'Class hash is zero');
            self.user_contract_class_hash.write(new_hash);
        }
    }

    #[abi(embed_v0)]
    impl UpgradeableImpl of IUpgradeable<ContractState> {
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();

            self.upgradeable.upgrade(new_class_hash);
        }
    }
}
