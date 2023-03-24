import React from 'react';
import { useGetCryptoDetailsQuery } from '../services/cryptoApi';
import { Loader } from ".";

function useEthereum() {
    const uuid = "razxDUgYGNAdQ";
    const { data, isFetching } = useGetCryptoDetailsQuery(uuid)
    const cryptoDetails = data?.data?.coin
    if(isFetching) return <Loader />

  return { cryptoDetails }
}

export default useEthereum;