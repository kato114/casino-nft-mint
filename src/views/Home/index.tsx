import BigNumber from 'bignumber.js'
import React, { Fragment, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import ape from "config/apeabi.json";
import StandardContractABI from "config/StandardContract.json";
import {
  useGorillaContract
} from 'hooks/useContracts'
import {
   useSignerGorillaContract,
} from 'hooks/useSignerContract'
import {
    getGorillaAddress,
    getStandardAddress,
} from "utils/addressHelper";
import { mint } from 'utils/callHelper'
import useRefresh from 'hooks/useRefresh'
import { getFullDisplayBalance, getBalanceNumber, formatBigNumber } from 'utils/formatBalance'
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'

const StyledRightArrowButton = styled.div`
  color: white;
  width: 0px;
  height: 0px;
  border: 30px solid black;
  border-top-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-left-color: white;
  cursor:pointer;
`

const StyledLeftArrowButton = styled.div`
  color: white;
  width: 0px;
  height: 0px;
  border: 30px solid black;
  border-top-color: transparent;
  border-right-color: white;
  border-bottom-color: transparent;
  border-left-color: transparent;
  cursor: pointer;
`

const Home: React.FC = () => {

  const [validChainid, setValidChainId] = useState(parseInt(process.env.REACT_APP_CHAIN_ID, 10))
  // const validChainid = 1

  const { account, chainId } = useWeb3React()
  const [pendingTx, setpendingTx] = useState(false)
  const gorillaContract = useGorillaContract()
  const gorillaSignerContract = useSignerGorillaContract()

  const {fastRefresh} = useRefresh()

  const [redraw, setRedraw] = useState(false)

  // added for minting NFT
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [mintNum, setMintNum] = useState<number>(1);
  const [mintprice, setMintPrice] = useState<BigNumber>(new BigNumber(0))
  const { isMobile } = useMatchBreakpoints()

  useEffect( () => {

    const fetchMintPrice = async () => {
      const price = await gorillaContract.getMintPrice();
      setMintPrice(price);  
    }
  
    const fetchMaxSupply = async () => {
      const _maxSupply = await gorillaContract.maxSupply();
      setMaxSupply(_maxSupply);      
    }

    if(gorillaContract) {
      fetchMintPrice();
      fetchMaxSupply();
    }
  
  }, [gorillaContract, account])


  useEffect( () => {
    const fetchTotalSupply = async () => {
      const _totalSupply = await gorillaContract.totalNFT();
      setTotalSupply(_totalSupply);      
    }

    if(gorillaContract) {
      fetchTotalSupply();
    }
  
  }, [gorillaContract, account, fastRefresh])

  const handleDecreaseNumber = async()=> {
    if (mintNum > 1){
      const tmp = mintNum - 1;
      setMintNum(tmp);
    }       
  }

  const handleIncreaseNumber = async()=> {
    // const publicSale = await gorillaContract.methods.publicSale().call()
    // var tmp = mintNum + 1;
    // if(publicSale) {
    //   if (mintNum < 10){
    //     setMintNum(tmp);
    //   }
    // } else {
    //   if (mintNum < 5){
    //     setMintNum(tmp);
    //   }          
    // }
    
    const tmp = mintNum + 1;
    if (mintNum < 3){
      setMintNum(tmp);
    }    
  }


  const handleMint = async () => {
      try {
        setpendingTx(true)
        await mint(gorillaSignerContract, account, mintNum)
      } catch (e) {
        console.log('Mint failed')      
      }
      setpendingTx(false)      
  }

  return (
    <section style={{ padding: 10 }}>
      <div style={{display: 'flex', justifyContent:'center'}}>
        <img src="img/title.png" alt="title" />
      </div>
      <div style={{display: 'flex', justifyContent: 'center', paddingBottom: '20px' }}>
        {/* **<!-- this is UNSTAKED part of Panel (LEFT)-->** */}
        <div className="pad">
          <div className={!isMobile ? "radiuspanel" : "radiuspanelmobile"} style={{ backgroundColor: "rgba(22, 49, 103, 0.7)" }}>
            <div>
              <h2 className={!isMobile ? "em-wide" : "em-wide-mobile"}>Mint Your Casino Gorilla</h2>
            </div>
            <div className="row justify-content-center">
              <div className="text-center">
                <h5 style={{ fontSize: 10, letterSpacing: '.2em', fontFamily: 'Poppins, sans-serif' }}>
                {`TOTAL MINTED : ${totalSupply}/${maxSupply}`} <br />
                </h5>
              </div>
            </div>
            <div className='row centerpanel' style={{display: 'flex', justifyContent: 'center', flexWrap: "wrap", marginTop: 30}}>
              {/* Card Body */}
              <StyledLeftArrowButton onClick={handleDecreaseNumber} />
              <div className='numpanel perfect-center' style={{
                backgroundColor: 'white',
                borderRadius: 10,
                textAlign: 'center',
                fontSize: 20,
                width: 50,
                marginRight: 20,
                marginLeft: 20
              }}>
                {mintNum}
              </div>
              <StyledRightArrowButton onClick={handleIncreaseNumber}/>
            </div>
            <div className="row justify-content-center">
              <div className="text-center">
                <h5 style={{ fontSize: 10, letterSpacing: '.2em', fontFamily: 'Poppins, sans-serif' }}>
                  {`TOTAL : ${getBalanceNumber(new BigNumber(mintprice.toString()).times(mintNum))}ETH`}  <br />
                </h5>
              </div>
            </div>
            <div className="bottomButton" style={{display: 'flex', justifyContent:'center', flexWrap: "wrap", marginTop: 50 }}>
              <button type="button" className="btn" disabled={pendingTx || chainId !== validChainid} style={{ letterSpacing: '0.2em' }} onClick={handleMint} >
                {pendingTx && 
                  (<FontAwesomeIcon icon={faRefresh} className="fa-spin" style={{ marginRight: "5px", letterSpacing: '0.2em'  }} /> ) 
                }
                {pendingTx? "MINTING" : "MINT NOW"}
              </button>
            </div>       
            {chainId !== validChainid && 
              <h5 style={{textAlign: 'center', letterSpacing: '.2em' }}>Wrong Network</h5>
            }     
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
