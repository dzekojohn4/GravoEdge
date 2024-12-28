"""
Script to verify if a position was liquidated in zkLend.

This script checks the event logs of the zkLend contract to determine
if a specific position was liquidated.
"""

from starknet_py.net.full_node_client import FullNodeClient

# Load environment variables
node_url = "https://starknet-mainnet.public.blastapi.io/rpc/v0_7"
ZKLEND_CONTRACT_ADDRESS = "0x05685d6b0b493c7c939d65c175305b893870cacad780842c79a611ad9122815f"

async def check_liquidation_proof(user_address):
    # Initialize the StarkNet client
    client = FullNodeClient(node_url=node_url)

    liquidation_key_output = [
        1004689575290523089480265033644810625213175352109340690572687136992269442551
    ]

    liquidation_selector = (
        "0x238a25785a13ab3138feb8f8f517e5a21a377cc1ad47809e9fd5e76daf01df7"
    )


    # Fetch liquidation events
    events_chunk = await client.get_events(
        from_block_number= 101302,
        to_block_number="latest",
        follow_continuation_token=True,
        chunk_size=150,
        keys=  [[liquidation_selector]]
    )

    events = events_chunk.events 

    liquid_results = []


    # Analyze events for the specific user
    for event in events:
        # print(event)
        if event.data[1] == int(user_address, 16):
            # Extract relevant data from the event
            liquidator = event.data[0]
            debt_token = event.data[2]
            debt_amount = event.data[3]
            collateral_token = event.data[5]
            collateral_amount = event.data[6]

            liquid_results.append(
                (
                    event.data[1],
                    debt_amount,
                    collateral_amount,
                )
            )

            # Print or log the details of the liquidation
            print(f"Liquidation Event: {liquidator} liquidated {user_address}'s position.")
            print(f"Debt Token: {debt_token}, Amount: {debt_amount}")
            print(f"Collateral Token: {collateral_token}, Amount: {collateral_amount}")

    # Print all liquidation results after processing all events
    if liquid_results:
        print("Liquidation Results:", liquid_results)
    else:
        print(f"No liquidation events found for user {user_address}.")


if __name__ == "__main__":
    import asyncio
    asyncio.run(check_liquidation_proof("0x05685d6b0b493c7c939d65c175305b893870cacad780842c79a611ad9122815f")) 