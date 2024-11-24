#[starknet::contract]
mod Vault {
    use core::num::traits::Zero;
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin::upgrades::UpgradeableComponent;
    use openzeppelin::upgrades::interface::IUpgradeable;
    use spotnet::interfaces::IVault;
    use spotnet::types::{TokenAmount};

    use starknet::ContractAddress;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map
    };
    use starknet::{ClassHash, get_caller_address, get_contract_address};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    /// Ownable
    #[abi(embed_v0)]
    impl OwnableTwoStepMixinImpl =
        OwnableComponent::OwnableTwoStepMixinImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    /// Upgradeable
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        token: ContractAddress,
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
        #[key]
        token: ContractAddress,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct LiquidityWithdrawn {
        #[key]
        user: ContractAddress,
        #[key]
        token: ContractAddress,
        amount: u256,
    }


    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress, token: ContractAddress) {
        assert(owner.is_non_zero(), 'Owner address is zero');
        self.ownable.initializer(owner);
        self.token.write(token);
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
    impl VaultImpl of IVault<ContractState> {
        /// Store liquidity on the vault.
        ///
        /// # Panics
        ///
        /// `is_position_open` storage variable is set to true('Open position already exists')
        /// the user holdings of `self.token` is leess than the `amount` field
        ///
        /// # Parameters
        /// * `deposit_data`: DepositData - Object which stores main deposit information.
        /// * `pool_key`: PoolKey - Ekubo type which represents data about pool.
        /// * `ekubo_limits`: EkuboSlippageLimits - Represents upper and lower sqrt_ratio values on
        /// Ekubo. Used to control slippage while swapping.
        /// * `pool_price`: TokenPrice - Price of `deposit` token in terms of `debt` token.
        fn store_liquidity(ref self: ContractState, amount: TokenAmount) {
            let user = get_caller_address();
            let vault_contract = get_contract_address();
            let current_amount = self.amounts.entry(user).read();

            let token = self.token.read();
            let token_dispatcher = IERC20Dispatcher { contract_address: token };
            assert(
                token_dispatcher.allowance(user, vault_contract) >= amount,
                'Approved amount insufficient'
            );
            assert(token_dispatcher.balance_of(user) >= amount, 'Insufficient balance');

            // update new amount
            self.amounts.entry(user).write(current_amount + amount);

            // transfer token to vault
            token_dispatcher.transfer_from(user, vault_contract, amount);

            self.emit(LiquidityAdded { user, token, amount });
        }

        fn withdraw_liquidity(ref self: ContractState, amount: TokenAmount) {
            let user = get_caller_address();
            let token = self.token.read();
            let current_amount = self.amounts.entry(user).read();
            assert(current_amount >= amount, 'Not enough tokens to withdraw');

            // update new amount
            self.amounts.entry(user).write(current_amount - amount);

            // transfer token to user
            IERC20Dispatcher { contract_address: token }.transfer(user, amount);

            self.emit(LiquidityWithdrawn { user, token, amount });
        }
    }
}
