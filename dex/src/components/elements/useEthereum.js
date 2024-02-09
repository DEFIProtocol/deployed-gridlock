import React from 'react';
import { useGetCryptoDetailsQuery } from '../services/cryptoApi';
import { Loader } from ".";

function useEthereum(chain) {
  const uuidMapping = {
    'Arbitrum': "razxDUgYGNAdQ",
    'Aurora': "razxDUgYGNAdQ",
    'Ethereum': "razxDUgYGNAdQ",
    'Optimism': "razxDUgYGNAdQ",
    'Avalanche': "dvUj0CzDZ",
    'Polygon': "uW2tk-ILY0ii",
    'Fantom': "uIEWfMFnQo9K_",
    'Klaytn': "", // Add Klaytn UUID if available
    'Binance': "WcwrkfNI4FUAe",
  };

    const uuid = uuidMapping[chain] || "razxDUgYGNAdQ"; 
    const { data, isFetching } = useGetCryptoDetailsQuery(uuid)
    const cryptoDetails = data?.data?.coin
    if(isFetching) return <Loader />

  return { cryptoDetails }
}

export default useEthereum;