import asyncio

from starknet_py.net.full_node_client import FullNodeClient


async def main():
    node = FullNodeClient(node_url="http://178.32.172.148:6060")

    borrowing_key_output = [
        442150749710818778059430935486738358608566890420557042714133150282782342977
    ]
    deposit_key_output = [
        256702315380875556620535413554505018969076471135601079992472732711650693874
    ]

    borrowing_selector = (
        "0xfa3f9acdb7b24dcf6d40d77ff2f87a87bca64a830a2169aebc9173db23ff41"
    )
    deposit_selector = (
        "0x9149d2123147c5f43d258257fef0b7b969db78269369ebcf5ebb9eef8592f2"
    )

    # Query
    deposit_and_borrowing_events = await node.get_events(
        address="0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05",
        from_block_number=850152,
        to_block_number="latest",
        keys=[[deposit_selector, borrowing_selector]],
        chunk_size=9999,
    )

    # Initialize lists to store results
    borrowing_results = []
    deposit_results = []

    # Extracting the events
    for event in deposit_and_borrowing_events.events:
        print(event)
        print("Event Keys:", event.keys)  # Check the keys
        print("Event Data:", event.data)  # Check the data

        # Check for borrowing event using the selector
        if borrowing_key_output[0] in event.keys:
            user = event.data[0]  # Assuming data[0] is user
            raw_amount = event.data[2]  # Assuming data[2] is raw_amount
            face_amount = event.data[3]  # Assuming data[3] is face_amount
            borrowing_results.append(
                (
                    user,
                    raw_amount,
                    face_amount,
                )
            )

        # Check for deposit event using the selector
        elif deposit_key_output[0] in event.keys:
            user = event.data[0]  # Assuming data[0] is user
            face_amount = event.data[2]  # Assuming data[2] is face_amount
            deposit_results.append((user, face_amount))

    # Print results
    print("Borrowing Results (user, raw_amount, face_amount):", borrowing_results)
    print("Deposit Results (user, face_amount):", deposit_results)


if __name__ == "__main__":
    asyncio.run(main())
