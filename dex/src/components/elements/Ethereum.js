import React from 'react';
import { useGetCryptoDetailsQuery } from '../services/cryptoApi';
import { Loader } from ".";

function Ethereum(props) {
    const { tokenPrice } = props;
    const uuid = "razxDUgYGNAdQ";
    const { data, isFetching } = useGetCryptoDetailsQuery(uuid)
    const cryptoDetails = data?.data?.coin
    if(isFetching) return <Loader />
    const ethExRate =tokenPrice / cryptoDetails?.price

  return (
    <div style={{color: "lime", fontWeight: '700', margin: "0px auto", padding: "4%"}}>
      Eth Price per Token = {ethExRate}
    </div>
  )
}

export default Ethereum