import React, { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import dummyData from '../utils/dummyData';
import { shortenAddress } from '../utils/shortenAddress' ;

const TransactionCard = ({ addressTo, addressFrom, timestamp, message, keyword, amount, url }) => {
    return (
        <div className='bg-[#181918] m-4 flex flex-1 flex-col p-3 rounded-md hover:shadow-2xl 
            2xl:min-w-[450px] 2xl:max-w-[500px]
            sm:min-w-[270px] sm:max-w-[300px]'>

                <div className='flex flex-col items-center w-full mt-3'>
                    <div className='flex jusfity-start w-full mb-6 p-2'>
                        <a href={`https://ropsten.etherscan.io/address/${addressFrom}`}
                            target='_blank' rel='noopener noreferrer'> 
                        </a>
                    </div>
                </div>
        </div>
    );
}
const Transactions = () => {

    const { connectedAccount } = useContext(TransactionContext);


    return (
        <div className='flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions'>
            <div className='flex flex-col md:p-12 py-12 px-4'>
                {/* latest transactions displayed if account connected */}
                {/* if not connected, show message 'connect your account to see the latest transactions' */}

                { connectedAccount 
                    ? (
                        <h3 className=' text-white text-3xl text-center my-2'>
                            Latest Transactions
                        </h3>  )
                    : (
                        <h3 className=' text-white text-3xl text-center my-2'>
                            Connect your account to see the latest changes
                        </h3>
                    )
                }

                <div className='flex flex-wrap justify-center items-center mt-10'>
                    {dummyData.reverse().map( (transaction, i) => (
                        // take each item in the dummy transactions array and 
                        // pass them to the JSX element
                        <TransactionCard key={i} {...transaction} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Transactions;