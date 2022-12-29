// contains the context of the transactions;
// will be used for all interactions with the blockchain

import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../utils/constants';

// the react context which will be maintained all through
export const TransactionContext = React.createContext();

// destructuring the ethereum object from window.ethereum
// this is auto-enabled from MetaMask
const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    
    // all 3 things are needed for fetching the contract (address, abi, signer)
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
}

/**
 * create a transaction provider which wraps around the children provided 
 * so that all the children get access to the information contained in the Context Provider
 */
export const TransactionProvider = ({ children }) => {

    const [connectedAccount, setConnectedAccount] = useState('');
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    // store the value in local storage so that latest value is retrieved when page refreshes
    // TODO: learn more about this !!!
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions, setTransactions] = useState([]);

    // any handleChange event that is triggered on change of data, 
    // has the event (e) already in the call args
    const handleChange = (e, name) => {
        setFormData( (prevState) => ({ ...prevState, [name]: e.target.value }));
    }

    const getAllTransactions = async() => {

        try {

            if (!ethereum) return alert('Please install metamask');

            const transactionContract = getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions();

            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18),
            }));

            setTransactions(structuredTransactions);

            console.log('all transactions: ', structuredTransactions);
        } catch(error) {
            console.error(error);
        }
    }

    const checkIfWalletIsConnected = async() => {

        try{

            // if ethereum is not installed, then return an error
            if (!ethereum) return alert('Please install MetaMask');
    
            // from the ethereum object, fetch the ethereum accounts associated
            const accounts = await ethereum.request({ method: 'eth_accounts'});
            if (accounts.length > 0) {
                console.log('Accounts connected to this DApp:', accounts);
                setConnectedAccount(accounts[0]);

                getAllTransactions();
    
                // also update the Transactions display section of the page here !
            } else {
                console.error('No Wallet accounts found');
            }
            
        } catch(error) {

            // likely that ethereum object is undefined here
            console.error(error);
            throw new Error('No ethereum object');
        }
    }

    const checkIfTransactionsExist = async() => {

        try{

            const transactionContract = getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount();

            window.localStorage.setItem('transactionCount', transactionCount);

        } catch(error) {

            console.error(error);
            throw new Error('No ethereum object');
        }
    }

    // this is meant to be called from the 'connect wallet' button
    // the function it passed to the context so that any component can call it at will.
    const connectWallet = async() => {

        try{
            if (!ethereum) return alert('Please install MetaMask');

            // with requestAccounts, MetaMask will prompt the user to choose the account they
            // want to connect to the DApp
            const accounts = await ethereum.request({ method: 'eth_requestAccounts'});

            if (accounts.length > 0) {
                setConnectedAccount(accounts[0]);
            }

        } catch(error) {
            console.error(error);
            throw new Error('No ethereum object');
        }
    }

    // send a transaction to the smart contract
    const sendTransaction = async() => {

        try {
            if (!ethereum) return alert('Please install MetaMask');

            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();

            // convert decimal to GWei (Hex) amount 
            const parsedAmount = ethers.utils.parseEther(amount);

            // the gas amount is specified in HEX; because all values in ETH network are written in 
            // HEX format.
            // this just calls the transaction to be done on-chain
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: connectedAccount,
                    to: addressTo,
                    gas: '0x5208',                  // eq to 21,000 GWei
                    value: parsedAmount._hex,      // the amount of crypto to be transferred (in hex)
                }]
            });

            // store the (crypto transfer) transaction info in the contract
            // once that transaction is triggered, you will receive a hash of the transaction through which this 'add' 
            // transaction will be added to the smart contract
            // at this stage, the transaction (to add the transfer info to the contract) is only triggered
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            
            // set loading state to true until the transaction hash is resolved
            setIsLoading(true);
            console.log(`loading - ${transactionHash.hash}`);

            // wait for the transaction (to add transfer info to contract) to be completed
            await transactionHash.wait();

            // once the transaction is settled, set loading state to false
            setIsLoading(false);
            console.log(`success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());

            window.reload();

        } catch(error) {
            console.error(error);
            throw new Error('No ethereum object');
        }
    }
    
    useEffect( () => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, []);


    // the TransactionProvider is used to wrap the entire React App with all its child components
    // all functions and values defined above are therefore made available to the rest of the app this way.
    return (
        // 
        <TransactionContext.Provider value={{ connectWallet, connectedAccount, formData, setFormData, handleChange, sendTransaction, transactions, isLoading }}>
            {children}
        </TransactionContext.Provider>
    );
}