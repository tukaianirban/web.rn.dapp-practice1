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

    console.log({ provider, signer, transactionContract });

}

/**
 * create a transaction provider which wraps around the children provided 
 * so that all the children get access to the information contained in the Context Provider
 */
export const TransactionProvider = ({ children }) => {

    const [connectedAccount, setConnectedAccount] = useState('');
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' });

    // any handleChange event that is triggered on change of data, 
    // has the event (e) already in the call args
    const handleChange = (e, name) => {
        setFormData( (prevState) => ({ ...prevState, [name]: e.target.value }));
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
            getEthereumContract();

        } catch(error) {
            console.error(error);
            throw new Error('No ethereum object');
        }
    }
    
    useEffect( () => {
        checkIfWalletIsConnected();
    }, []);


    // the TransactionProvider is used to wrap the entire React App with all its child components
    // all functions and values defined above are therefore made available to the rest of the app this way.
    return (
        // 
        <TransactionContext.Provider value={{ connectWallet, connectedAccount, formData, setFormData, handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
}