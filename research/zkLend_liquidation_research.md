# Research on zkLend Liquidation

This research explored how to check and verify that zkLend closed a position due to liquidation rather than by a user through the Spotnet smart contract, particularly focusing on the deployed spotnet smart contract, the events emitted by the zkLend contract and the state changes associated with liquidation.

## Introduction

zkLend liquidation process is triggered when a borrower's Health Factor falls to 1 or lower, indicating that
the value of their collateral may not be enough to cover their debt, posing risks to the lenders and zkLend
protocol. The liquidation process incentivises external party(ies) to actively monitor zkLend's loan
portfolios to seek out borrowings that have Health Factor below 1 and to actively repay these loans to
ensure liquidity safety and health of the protocol. 

A borrower whose outstanding loan exceeds his/her borrowing capacity will be liquidated at market rate.
Instead of a static close factor, zkLend will implement a variable close factor where liquidators can only
repay the portion (or part) of loan position that has exceeded the borrowing capacity. While the liquidation
threshold for each borrower varies on his/her assets pledged as well as the borrowing asset, liquidations
happen when the underlying collateral decreases in value relative to the borrowed asset and/or if the
outstanding loan value (asset value + accrued interest) now exceeds the borrowing capacity. Examples
may include large price increases in a borrowed asset, or dramatic price decrease in the underlying
collateral.

Upon reaching liquidation threshold, any Starknet address (i.e. Liquidator) can initiate a liquidationCall()
contract to repay the debt on behalf of the borrower and receive a Liquidation Bonus (of usually 10%). 

## Research Methodology

To verify if a position was liquidated in zkLend, the following steps were taken:

### User Activity
1. **Check Events in Deployed Spotnet Contract**: The `Events` logs of the spotnet contract were examined on [Starkscan](https://starkscan.co/contract/0x05685d6b0b493c7c939d65c175305b893870cacad780842c79a611ad9122815f#events). Only two events were observed; `LiquidityLooped` and `OwnershipTransferred`
2. **[Check Read Functions](https://starkscan.co/contract/0x05685d6b0b493c7c939d65c175305b893870cacad780842c79a611ad9122815f#read-write-contract-sub-read)**: `is_position_open()` returned 1 (true), while `owner()` returned 0x5c0846b4a80bb664b2f865e4dbc9a5e5eb3c454d124124ab891acc55a7e6fd.
3. **Check Owner/User Transaction History**: The [transaction hash](https://voyager.online/tx/0x6e916a00518bc6ed69f397188e749d48cf6b33e92057970c3c2d1a312500047#internalCalls) of the user was analyzed to check for any calls related to the liquidation process. The last 2 calls were `loop_liquidity()` and `approve()` respectively. No `close_position()` call was found.

### zkLend: Market Contract Activity
1. **Identify Relevant Events Using Starkscan**: The event logs in "Events" tab of the zkLend: Market contract were examined on Starkscan to identify any liquidation events. Identified `Liquidation` event.
2. **Analyze Event Data**: Clicked on `Liquidation` event to view its details, and found the following data including liquidator, user, debt_token, debt_raw_amount, debt_face_amount, collateral_token, collateral_amount.
3. **zkLend: Market Contract Read Functions**: Found and explored the following view functions to check if our deployed spotnet contract's position in zkLend has been closed; `get_user_debt_for_token(user, token)`, `is_user_undercollateralized(user, apply_borrow_factor)` and `user_has_debt(user)`. `is_user_undercollateralized()` and `user_has_debt()` both returned 1, indicating `true`.

### Portfolio Check

Upon checking the portfolio of the deployed Spotnet contract, it was found that there is a balance of **1.744172753867558899 zSTRK Token**, while `LiquidityLooped` event showed that the user was able to deposit **1.744172753867558898 STRK** with an initial deposit **1 STRK**. This indicates that the position is not fully liquidated, as the user still holds assets in the zkLend protocol.

`LiquidityLooped` event from Spotnet contract showed 473917 amount of token borrowed from USDC token contract. While `get_user_debt_for_token()` on zkLend Market contract returned 475401, 475529.


## Conclusion

The zkLend liquidation process is unique compared to other lending protocols, such as Aave. Unlike these protocols, zkLend does not allow liquidators to fully liquidate a position, regardless of how low the health factor is. Instead, the current design permits liquidators to partially liquidate undercollateralized positions, ensuring that the user remains undercollateralized after the liquidation. This means that the health factor should not be exactly 1 or higher after the execution of a liquidation event. This system protects users from unfair liquidations by jut allowing liquidations to be small and progressive, hopefully giving the users more time to act and increase their collateral.

