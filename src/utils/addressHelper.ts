import addresses from 'config/token'

const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
// const chainId = 1

export const getGorillaAddress = () => {
  return addresses.gorilla[chainId]
}

export const getStandardAddress = () => {
  return addresses.standard[chainId]
}
