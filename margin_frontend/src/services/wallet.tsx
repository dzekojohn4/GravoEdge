import { connect, disconnect, getSelectedConnectorWallet } from "starknetkit";
import { InjectedConnector } from "starknetkit/injected";
import {
  ETH_ADDRESS,
  STRK_ADDRESS,
  USDC_ADDRESS,
  kSTRK_ADDRESS,
} from "../utils/constants.js";
import ETH from "../assets/icons/ethereum.svg";
import USDC from "../assets/icons/borrow_usdc.svg";
import STRK from "../assets/icons/strk.svg";
import KSTRK from "../assets/icons/kstrk.svg";

export const getConnectors = () =>
  !localStorage.getItem("starknetLastConnectedWallet")
    ? [
        new InjectedConnector({ options: { id: "argentX" } }),
        new InjectedConnector({ options: { id: "braavos" } }),
      ]
    : [
        new InjectedConnector({
          options: {
            id:
              localStorage.getItem("starknetLastConnectedWallet") ||
              "defaultWalletId",
          },
        }),
      ];

export const getWallet = async () => {
  const connectedWallet = await getSelectedConnectorWallet();

  if (connectedWallet && connectedWallet?.isConnected) {
    console.log("found existing wallet:", connectedWallet);
    return connectedWallet;
  }

  const { wallet } = await connect({
    connectors: getConnectors(),
    modalMode: "neverAsk",
  });

  if (wallet && wallet?.isConnected) {
    await wallet.enable();
    return wallet;
  }

  console.log("No wallet found. Attempting to connect...");
  return await connectWallet(); // Fallback to connectWallet if not already connected
};

export const connectWallet = async () => {
  try {
    console.log("Attempting to connect to wallet...");

    const { wallet } = await connect({
      connectors: getConnectors(),
      modalMode: "alwaysAsk",
      modalTheme: "dark",
    });

    if (!wallet) {
      console.error("No wallet object found");
      throw new Error("Failed to connect to wallet");
    }

    await wallet.enable();

    if (wallet?.isConnected) {
      console.log(
        "Wallet successfully connected. Address:",
        wallet?.selectedAddress
      );
      return wallet;
    }
    throw new Error("Wallet connection failed");
  } catch (error) {
    console.error("Error connecting wallet:", error.message);
    throw error;
  }
};

export function logout() {
  localStorage.removeItem("wallet_id");
  disconnect();
}

export async function getTokenBalances(walletAddress: string) {
  try {
    const wallet = await getWallet();
    console.log("Wallet info", wallet);

    const tokenBalances = {
      ETH: await getTokenBalance(wallet, walletAddress, ETH_ADDRESS),
      USDC: await getTokenBalance(wallet, walletAddress, USDC_ADDRESS),
      STRK: await getTokenBalance(wallet, walletAddress, STRK_ADDRESS),
      kSTRK: await getTokenBalance(wallet, walletAddress, kSTRK_ADDRESS),
    };

    return tokenBalances;
  } catch (error) {
    console.error("Error fetching token balances:", error);
    throw error;
  }
}

export async function getTokenBalance(
  wallet: any,
  walletAddress: string,
  tokenAddress: string
) {
  try {
    const response = await wallet.provider.callContract({
      contractAddress: tokenAddress,
      entrypoint: "balanceOf",
      calldata: [walletAddress],
    });

    const tokenDecimals = tokenAddress === USDC_ADDRESS ? 6 : 18;
    const balance = BigInt(response.result[0]).toString();
    const readableBalance = (Number(balance) / 10 ** tokenDecimals).toFixed(4);
    console.log(`Balance for token ${tokenAddress}:`, readableBalance);
    return readableBalance;
  } catch (error) {
    console.error(`Error fetching balance for token ${tokenAddress}:`, error);
    return "0";
  }
}

export const getBalances = async (
  walletId: string,
  setBalances: React.Dispatch<React.SetStateAction<any>>
) => {
  if (!walletId) return;
  try {
    const data = await getTokenBalances(walletId);

    const updatedBalances = [
      {
        icon: <ETH />,
        title: "ETH",
        balance: data.ETH !== undefined ? data.ETH.toString() : "0.00",
      },
      {
        icon: <USDC />,
        title: "USDC",
        balance: data.USDC !== undefined ? data.USDC.toString() : "0.00",
      },
      {
        icon: <STRK />,
        title: "STRK",
        balance: data.STRK !== undefined ? data.STRK.toString() : "0.00",
      },
      {
        icon: <KSTRK />,
        title: "kSTRK",
        balance: data.kSTRK !== undefined ? data.kSTRK.toString() : "0.00",
      },
      // { icon: <DAI />, title: 'DAI', balance: data.DAI !== undefined ? data.DAI.toString() : '0.00' },  dont have DAI in the constants file
    ];

    setBalances(updatedBalances);
  } catch (error) {
    console.error("Error fetching user balances:", error);
  }
};

// Add this line for environments that don't recognize BigInt
const BigInt = window.BigInt;
