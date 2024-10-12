import {connect} from "get-starknet";
import {CallData} from "starknet";
import {erc20abi} from "../abis/erc20";
import {abi} from "../abis/abi";

export async function sendTransaction(transactionData) {
    try {
        const starknet = await connect();
        if (!starknet.isConnected) {
            throw new Error("Wallet not connected");
        }

        // Extract approve_data and loop_liquidity_data from transactionData
        const approveData = transactionData.approve_data;
        const loopLiquidityData = transactionData.loop_liquidity_data;

        // Ensure all required fields are present and of the correct type
        if (!approveData.to_address || !approveData.spender || !approveData.amount) {
            throw new Error("Missing or invalid approve_data fields");
        }

        if (!loopLiquidityData.pool_key || !loopLiquidityData.deposit_data) {
            throw new Error("Missing or invalid loop_liquidity_data fields");
        }

        let approveCalldata = new CallData(erc20abi);
        approveCalldata.compile("approve", [approveData.spender, approveData.amount]);
        const approveTransaction = {
            contractAddress: approveData.to_address,
            entrypoint: "approve",
            calldata: approveCalldata.compile("approve", [approveData.spender, approveData.amount])
        };

        const callData = new CallData(abi);
        const compiled = callData.compile("loop_liquidity", loopLiquidityData);
        const depositTransaction = {
            contractAddress: "0x0798b587e3da417796a56ffab835ab2a905fa08bab136843ce5749f76c7e45e4",
            entrypoint: "loop_liquidity",
            calldata: compiled
        };
        let result = await starknet.account.execute([approveTransaction, depositTransaction]);
        console.log("Resp: ")
        console.log(result);
        return {
            loopTransaction: result.transaction_hash
        };
    } catch (error) {
        console.error("Error sending transaction:", error);
        throw error;
    }
}

async function waitForTransaction(txHash) {
    const starknet = await connect();
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