import BigNumber from "bignumber.js";

export const mint = async (gorillaContract: any, account: any, cnt: any) => {
  console.log('alex: gorillaContract =' , gorillaContract)
  const temp = await gorillaContract.methods.getMintPrice().call()
  const price = new BigNumber(temp)
  const amount = price.multipliedBy(cnt)
  return gorillaContract.methods.mintGorilla(cnt).send({ from: account, value: amount });
};
