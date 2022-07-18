import { useMemo } from 'react'
import {
  getGorillaContract,
} from "utils/contractHelpers";

import useActiveWeb3React from 'hooks/useActiveWeb3React'

export const useGorillaContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getGorillaContract(library.getSigner()), [library])
}
