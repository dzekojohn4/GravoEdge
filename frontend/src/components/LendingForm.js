import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getTokenBalances, sendTransaction} from '../utils/wallet';

const LendingForm = ({walletId}) => {
    const navigate = useNavigate();
    const [balances, setBalances] = useState({});
    const [formData, setFormData] = useState({
        token: '',
        amount: '',
        multiplier: ''
    });
    const [transactionData, setTransactionData] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchBalances = useCallback(async () => {
        if (!walletId) return;
        try {
            const tokenBalances = await getTokenBalances(walletId);
            setBalances(tokenBalances);
        } catch (error) {
            console.error("Failed to fetch balances:", error);
            alert("Failed to fetch token balances. Please try again.");
        }
    }, [walletId]);

    useEffect(() => {
        if (!walletId) {
            navigate('/login');
        } else {
            fetchBalances();
        }
    }, [walletId, navigate, fetchBalances]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTransactionStatus(null);
        setTransactionData(null);

        try {
            const queryParams = new URLSearchParams({
                token: formData.token,
                amount: formData.amount,
                multiplier: formData.multiplier,
                wallet_id: walletId
            }).toString();

            console.log("Query Params:", queryParams);
            const response = await fetch(`http://0.0.0.0:8000/transaction-data?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log("Response:", response);
            if (response.ok) {
                const data = await response.json();
                const data1 = { // TODO: Remove, mock for sepolia
                    approve_data: {
                        to_address: "2087021424722619777119509474943472645767659996348769578120564519014510906823",
                        spender: "0x4aa8566337bf8dae0ae335e251dd0776702d52d8fb837e0557cd1917cee28a7",
                        amount: "1000"
                    },
                    loop_liquidity_data: {
                        caller: "0x06Cb0F3004Be46bcfc3d3030E08ebDDD64f13da663AD715FB4Aabe5423c7b862",
                        pool_price: 373309738263514,
                        pool_key: {
                            token0: "2087021424722619777119509474943472645767659996348769578120564519014510906823",
                            token1: "0x7ab0b8855a61f480b4423c46c32fa7c553f0aac3531bbddaa282d86244f7a23",
                            fee: "0x20c49ba5e353f80000000000000000",
                            tick_spacing: "354892",
                            extension: "0x73ec792c33b52d5f96940c2860d512b3884f2127d25e023eb9d44a678e4b971"
                        },
                        deposit_data: {
                            token: "2087021424722619777119509474943472645767659996348769578120564519014510906823",
                            amount: "1000",
                            multiplier: "2"
                        }
                    }
                }
                console.log(data);
                setTransactionData(data);
                console.log("Transaction data fetched successfully:", data);

                try {
                    const txResult = await sendTransaction(data1);
                    console.log("Transaction result:", txResult);
                    setTransactionStatus('Transaction sent successfully!');
                } catch (txError) {
                    console.error('Error sending transaction:', txError);
                    setTransactionStatus('Failed to send transaction. Please try again.');
                }
            } else {
                const errorData = await response.text();
                console.error('Failed to fetch transaction data:', errorData);
                setTransactionStatus('Failed to fetch transaction data. Please try again.');
            }
        } catch (error) {
            console.error('Error in form submission:', error);
            setTransactionStatus('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Submit your lending details</h2>

            <div className="mb-3">
                {Object.entries(balances).map(([token, value]) => (
                    <div key={token} id={`balance-${token}`} style={{color: '#E5E7EB'}}>
                        Balance for {token}: {value}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="token" className="form-label">Select Token</label>
                    <select
                        className="form-select"
                        id="token"
                        name="token"
                        value={formData.token}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>Select Token</option>
                        {Object.entries(balances).map(([token, balance]) => (
                            <option key={token} value={token}>{token} (Balance: {balance})</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="amount" className="form-label">Token Amount</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        className="form-control"
                        min="0"
                        step="any"
                        placeholder="Enter token amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="multiplier" className="form-label">Multiplier</label>
                    <select
                        className="form-select"
                        id="multiplier"
                        name="multiplier"
                        value={formData.multiplier}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>Select Multiplier</option>
                        {[2, 3, 4, 5].map(value => (
                            <option key={value} value={value}>{value}x</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn-submit" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Submit'}
                </button>
            </form>

            {transactionData && (
                <div className="mt-4">
                    <h3>Transaction Data:</h3>
                    <pre>{JSON.stringify(transactionData, null, 2)}</pre>
                </div>
            )}

            {transactionStatus && (
                <div className="mt-4">
                    <h3>Transaction Status:</h3>
                    <p>{transactionStatus}</p>
                </div>
            )}
        </div>
    );
};

export default LendingForm;