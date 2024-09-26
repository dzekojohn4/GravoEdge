async function connectWallet() {
    try {
        const starknet = window.starknet;
        const wallet = await starknet.enable();

        if (wallet) {
            console.log("Wallet object:", wallet); // Logs the entire wallet object

            const walletAddress = starknet.selectedAddress;
            console.log("Wallet Address:", walletAddress); // Logs the wallet address
            alert(`Wallet connected: ${walletAddress}`);

            // Save wallet address in session
            const formData = new FormData();
            formData.append("wallet_id", walletAddress);

            await fetch("/login", {
                method: "POST",
                body: formData
            });

            // Redirect or reload the page after connection
            window.location.reload();
        } else {
            alert("Connection failed. Please try again.");
        }
    } catch (error) {
        console.error("Error connecting wallet:", error); // Logs any error
        alert("An error occurred. Please check the console.");
    }
}

async function logout() {
    // Remove wallet_id from session and redirect to login page
    await fetch("/logout", { method: "POST" });
    window.location.href = "/login";
}

function splitUint256(value) {
    const MAX_UINT128 = BigInt(2) ** BigInt(128);
    const low = value % MAX_UINT128;
    const high = value / MAX_UINT128;
    return [low.toString(), high.toString()];
}

async function sendTransaction(transactionData) {
    try {
        console.log("Transaction Data:", transactionData);

        const starknet = window.starknet;
        if (!starknet) {
            throw new Error("Please connect to the Argent X wallet.");
        }

        // Connect to the wallet if not connected
        await connectWallet();

        // Extract approve_data and loop_liquidity_data from transactionData
        const approveData = transactionData[0].approve_data;
        const loopLiquidityData = transactionData[0].loop_liquidity_data;

        // Log the extracted data for debugging
        console.log("Approve Data:", approveData);
        console.log("Loop Liquidity Data:", loopLiquidityData);

        // Construct transaction details based on approve data
        const [amountLow, amountHigh] = splitUint256(BigInt(approveData.amount));

        const approveTransaction = {
            contractAddress: approveData.to_address,
            entrypoint: "approve",
            calldata: [
                approveData.spender, // spender address
                amountLow,           // approval amount low part
                amountHigh           // approval amount high part
            ],
        };

        // Send the "approve" transaction
        const approveResponse = await starknet.account.execute(approveTransaction);
        console.log("Approve transaction response:", approveResponse);

        // Wait for the approve transaction to be accepted
        await waitForTransaction(approveResponse.transaction_hash);

        // Construct the second transaction for liquidity deposit
        const depositTransaction = {
            contractAddress: loopLiquidityData.pool_key.token0,
            entrypoint: "deposit",
            calldata: [
                loopLiquidityData.pool_key.token0,    // token0 address
                loopLiquidityData.pool_key.token1,    // token1 address
                loopLiquidityData.deposit_data.amount, // deposit amount
                loopLiquidityData.deposit_data.multiplier // multiplier
            ],
        };

        // Send the "deposit" transaction
        const depositResponse = await starknet.account.execute(depositTransaction);
        console.log("Deposit transaction response:", depositResponse);

        // Alert the user with the transaction hash
        alert(`Transactions sent. Approve Hash: ${approveResponse.transaction_hash}, Deposit Hash: ${depositResponse.transaction_hash}`);
    } catch (error) {
        console.error("Error sending transaction:", error);
        alert(`An error occurred while sending the transaction: ${error.message}`);
    }
}

// Helper function to wait for a transaction to be accepted
async function waitForTransaction(txHash) {
    let receipt = null;
    while (receipt === null) {
        try {
            receipt = await starknet.provider.getTransactionReceipt(txHash);
        } catch (error) {
            console.log("Waiting for transaction to be accepted...");
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before trying again
        }
    }
    console.log("Transaction accepted:", receipt);
}

// Helper function to split a BigInt into two 32-bit numbers
function splitUint256(value) {
    const low = value & BigInt("0xFFFFFFFF");
    const high = value >> BigInt(32);
    return [low.toString(), high.toString()];
}

// Helper function to wait for a transaction to be accepted
async function waitForTransaction(txHash) {
    let receipt = null;
    while (receipt === null) {
        try {
            receipt = await starknet.provider.getTransactionReceipt(txHash);
        } catch (error) {
            console.log("Waiting for transaction to be accepted...");
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before trying again
        }
    }
    console.log("Transaction accepted:", receipt);
}

// Helper function to split a BigInt into two 32-bit numbers
function splitUint256(value) {
    const low = value & BigInt("0xFFFFFFFF");
    const high = value >> BigInt(32);
    return [low.toString(), high.toString()];
}