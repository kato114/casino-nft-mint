import React, { Fragment, useEffect, useState } from 'react'
import { useWalletModal, Skeleton, Text, Box, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import {useGetEthBalance, FetchStatus } from 'hooks/useTokenBalance'
import { getFullDisplayBalance, formatBigNumber } from 'utils/formatBalance'
import styled from 'styled-components'

const Tooltip = styled.div<{ isTooltipDisplayed: boolean }>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? 'inline-block' : 'none')};
  position: absolute;
  padding: 8px;
  right: 125px;
  text-align: center;
  background-color: #ffc000;
  color: black;
  border-radius: 16px;
  opacity: 0.7;
  width: 100px;
`

const StyledAccountBack = styled.div`
    font-family: 'Poppins, sans-serif';
    background-color: #353547;
    border-radius: 16px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    border: 1px solid #524B63;
    width: 100%;
    margin-bottom: 24px;
`

const StyledBalance = styled.div`
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border: 0;
    border-radius: 16px;
    box-shadow: 0px -1px 0px 0px rgb(14 14 44 / 40%) inset;
    cursor: pointer;
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    font-family: inherit;
    font-size: 16px;
    font-weight: 600;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-letter-spacing: 0.03em;
    -moz-letter-spacing: 0.03em;
    -ms-letter-spacing: 0.03em;
    letter-spacing: 0.03em;
    line-height: 1;
    opacity: 1;
    outline: 0;
    -webkit-transition: background-color 0.2s,opacity 0.2s;
    transition: background-color 0.2s,opacity 0.2s;
    height: 48px;
    padding: 0 24px;
    background-color: #ffffff;
    color: #121212;
`

const StyledAccount = styled.div`
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border: 0;
    border-radius: 16px;
    box-shadow: 0px -1px 0px 0px rgb(14 14 44 / 40%) inset;
    cursor: pointer;
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    font-family: inherit;
    font-size: 16px;
    font-weight: 600;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-letter-spacing: 0.03em;
    -moz-letter-spacing: 0.03em;
    -ms-letter-spacing: 0.03em;
    letter-spacing: 0.03em;
    line-height: 1;
    opacity: 1;
    outline: 0;
    -webkit-transition: background-color 0.2s,opacity 0.2s;
    transition: background-color 0.2s,opacity 0.2s;
    height: 48px;
    padding: 0 24px;
    color: white;
`

const ConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout, t)
  const { account } = useWeb3React()
  const { balance, fetchStatus } = useGetEthBalance()
  const [isDisplayed, setIsDisplayed] = useState(false)

  function displayTooltip() {
    setIsDisplayed(true)
    setTimeout(() => {
      setIsDisplayed(false)
    }, 1000)
  }

  const copyAddress = () => {
    if (navigator.clipboard && navigator.permissions) {
      navigator.clipboard.writeText(account).then(() => displayTooltip())
    } else if (document.queryCommandSupported('copy')) {
      const ele = document.createElement('textarea')
      ele.value = account
      document.body.appendChild(ele)
      ele.select()
      document.execCommand('copy')
      document.body.removeChild(ele)
      displayTooltip()
    }
  }

  const renderButton = () => {
    if (!account) {
      return (
        <button type="button" className="btn" style={{ fontFamily: 'FuturisticArmour', letterSpacing: '0.2em', marginBottom: 24 }} onClick={onPresentConnectModal} {...props}>
          Connect Wallet
        </button>
      )
    }

    return (
      <div>
        <StyledAccountBack {...props}>
          {fetchStatus !== FetchStatus.SUCCESS ? (
            <Skeleton width="60px" />
          ) : (
            <StyledAccount color='black'>{`${formatBigNumber(balance, 6)} ETH`}</StyledAccount>
          )}
          <StyledBalance color='black' onClick={logout}>{`${account.substring(0, 6)}...${account.substring(38, 42)}`}</StyledBalance>
        </StyledAccountBack>
      </div>
    )
  }

  const [index, setIndex] = useState(0);
   const handleClick = (newIndex: number) => setIndex(newIndex);
   const [disabledButton, setDisabledButton] = useState(false)
  
  return (
    <div>
      {renderButton()}
    </div>

    // <Button>
    //   {t('Connect Wallet')}
    // </Button>
  )
}

export default ConnectWalletButton
