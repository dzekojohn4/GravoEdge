# Spotnet functionality documentation

## Overview
Spotnet is a dApp designed for increasing of initial collateral deposit deposit by utilizing lending 
protocols and AMMs for borrowing tokens, swapping them and redepositing up to x4 of starting capital(as for now).

## Spotnet Smart Contract
Smart contract consists of a constructor and two methods for public use.

### Constructor
Constructor of our contract receives three parameters(ekubo_core and zk_market are serialized to Dispatcher types for starknet::interfaces):
* `owner`: ContractAddress
* `ekubo_core`: ContractAddress
* `zk_market`: ContractAddress
Onwer address is an account address of the user who deploys it, only owner can deposit funds and close position on lending protocol.

### loop_liquidity
The `loop_liquidity` method is responsible for deposit of collateral token. For now only one position can be opened, to create the new you need to close old one.
This method has next parameters:
* `deposit_data`: DepositData - Object of internal type which stores main deposit information.
* `pool_key`: PoolKey - Ekubo type for obtaining info about the pool and swapping tokens.
* `pool_price`: felt252 - Price of `deposit` token in terms of `debt` token in Ekubo pool(so for ex. 2400000000 USDC for ETH when depositing ETH).

It's flow can be described as follows:

```
assertions

constants & dispatchers created

tokens transferred to contract from user

enabling token as collateral on lending protocol

approve & deposit initial amount

while total_deposited < initial_amount * multiplier {
    calculate borrow amount

    borrow

    swap on AMM to deposit token

    approve & deposit
}

emit event
```

### close_position
The `close_position` method is responsible for repaying debts and withdrawing all tokens from zklend. Can be called only if there is active position. 
The method has next parameters:
* `supply_token`: ContractAddress - Address of the token used as collateral.
* `debt_token`: ContractAddress - Address of the token used as borrowing.
* `pool_key`: PoolKey - Ekubo type for obtaining info about the pool and swapping tokens.
* `supply_price`: felt252 - Price of `supply` token in terms of `debt` token in Ekubo pool(so for ex. 2400000000 USDC for ETH).
* `debt_price`: felt252 - Price of `debt` token in terms of `supply` token in Ekubo pool(for ex. 410000000000000 ETH for USDC).

It's flow can be described as follows:
```
assertions

constants & dispatchers created

while debt != 0 {
    calculate amount available for withdraw

    withdraw

    swap to debt token

    repay
}
swap back extra debt token

emit event
```

## Important types, events and constants
### Types
```
struct DepositData {
    token: ContractAddress,
    amount: u256,
    multiplier: u32
}
```

### Events
```
struct LiquidityLooped {
    initial_amount: u256,
    deposited: u256,
    token_deposit: ContractAddress,
    borrowed: u256,
    token_borrowed: ContractAddress
}
```
```
struct PositionClosed {
    deposit_token: ContractAddress,
    debt_token: ContractAddress,
    withdrawn_amount: u256,
    repaid_amount: u256
}
```

### Constants
* For swaps the EKUBO_LOWER_SQRT_LIMIT and EKUBO_UPPER_SQRT_LIMIT constants used. They define how much price can be moved by swappng. For now it is set to limiting values (`18446748437148339061` and `6277100250585753475930931601400621808602321654880405518632` respectively).

* ZK_SCALE_DECIMALS is used for scaling down values obtained by multiplying on zklend collateral and borrow factor.
