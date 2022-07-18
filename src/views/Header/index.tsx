import BigNumber from 'bignumber.js'
import React, { Fragment, useEffect, useState } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components';
import ConnectWalletButton from 'components/ConnectWalletButton';

const Header: React.FC = () => {

    const { isMobile } = useMatchBreakpoints()

    return (
        <header id="header container" >
            {/* Navbar */}
            <nav data-aos="zoom-out" data-aos-delay={800} className="headernav">

                <div className={!isMobile ? "headercomponents" : "headercomponentsmobile"}>
                    <a href='https://www.casinogorillasclub.com/'>
                        <img src="img/logo.png" alt="logo" />
                    </a>
                    <span>
                        {/* <ConnectWalletButton headstring="Wallet ID:" colorHeading="#ffc000" colorAddress="#ffffff" colorIcon="primary" /> */}
                        <ConnectWalletButton />
                    </span>
                </div>
            </nav>
        </header>
    );
}

export default Header
