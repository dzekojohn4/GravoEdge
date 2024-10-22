import {connect} from 'get-starknet';
import { checkAndDeployContract } from "./contract";
import {ETH_ADDRESS, STRK_ADDRESS, USDC_ADDRESS } from "./constants";


export async function connectWallet() {
    try {
        console.log("Attempting to connect to wallet...");

        // Connect to the wallet with modal
        const starknet = await connect({
            modalMode: 'alwaysAsk',
            modalTheme: 'light',
        });

        if (!starknet) {
            console.error("No Starknet object found");
            throw new Error("Failed to connect to wallet");
        }

        // Enable the wallet connection
        await starknet.enable();

        if (starknet.isConnected) {
            const address = starknet.selectedAddress;
            console.log("Wallet successfully connected. Address:", address);

            // Check and deploy contract after successfully connecting
            await checkAndDeployContract(address);

            return address;
        } else {
            console.error("Wallet connection flag is false after enabling");
            throw new Error("Wallet connection failed");
        }
    } catch (error) {
        console.error("Error connecting wallet:", error.message);
        if (error.message.includes("User rejected wallet selection")) {
            throw new Error("Wallet connection cancelled by user");
        }
        throw new Error("Failed to connect to wallet. Please make sure Argent X is installed and try again.");
    }
}


export function logout() {
    // Clear local storage
    localStorage.removeItem('wallet_id');
}

export async function getTokenBalances(walletAddress) {
    try {
        const starknet = await connect();
        if (!starknet.isConnected) {
            throw new Error("Wallet not connected");
        }

        const tokenBalances = {
            ETH: await getTokenBalance(starknet, walletAddress, ETH_ADDRESS),
            USDC: await getTokenBalance(starknet, walletAddress, USDC_ADDRESS),
            STRK: await getTokenBalance(starknet, walletAddress, STRK_ADDRESS)
        };

        return tokenBalances;
    } catch (error) {
        console.error("Error fetching token balances:", error);
        throw error;
    }
}

async function getTokenBalance(starknet, walletAddress, tokenAddress) {
    try {
        const response = await starknet.provider.callContract({
            contractAddress: tokenAddress,
            entrypoint: 'balanceOf',
            calldata: [walletAddress]
        });

        // Convert the balance to a human-readable format
        // Note: This assumes the balance is returned as a single uint256
        // You may need to adjust this based on the actual return value of your contract
        const balance = BigInt(response.result[0]).toString();

        // Convert to a more readable format (e.g., whole tokens instead of wei)
        // This example assumes 18 decimal places, adjust as needed for each token
        const readableBalance = (Number(balance) / 1e18).toFixed(4);

        return readableBalance;
    } catch (error) {
        console.error(`Error fetching balance for token ${tokenAddress}:`, error);
        return '0'; // Return '0' in case of error
    }
}

// Add this line at the top of your file if you're using Create React App or a similar setup
// that doesn't recognize BigInt as a global
const BigInt = window.BigInt;
