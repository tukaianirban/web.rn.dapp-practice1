import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';

import logo from '../../images/logo.png';
import { useState } from 'react';

const NavbarItem = ({title, classProps}) => {
    return (
        // mx -> margin on horizontal axis
        <li className={`mx-4 cursor-pointer ${classProps}`}>
            {title}
        </li>
    );
}

const NavBar = () => {

    const [toggleMenu, setToggleMenu] = useState(false);

    return (
        // w-full takes the 100% width of the section
        // flex means set as flexbox
        // medium devices -> justify-center
        <nav className='w-full flex md:justify-center justify-between items-center p-4'>
            <div className='md:flex-[0.5] flex-initial justify-center items-center'>
                <img src={logo} alt='logo' className='w-32 cursor-pointer' />
            </div>
            <ul className='text-white md:flex hidden list-none flex-row justify-between items-center flex-initial'>
                {
                    ["Market", "Exchange", "Tutorials", "Wallets"].map( (item, index) => (
                        <NavbarItem key={item + index} title={item} />
                    ))
                }
                {/* single LI item for the login button */}
                <li className='bg-[#2952e3] py-2 px-7 max-4 rounded-full cursor-pointer hover:bg-[#2546bd]'>
                    Login
                </li>
            </ul>
            <div className='flex relative'>
                {
                    toggleMenu
                    ? <AiOutlineClose fontSize={28} className='text-white md:hidden cursor-pointer' onClick={ () => setToggleMenu(false)} />
                    : <HiMenuAlt4 fontSize={28} className='text-white md:hidden cursor-pointer' onClick={ () => setToggleMenu(true)} />
                }
            </div>
        </nav>
    );
}

export default NavBar;