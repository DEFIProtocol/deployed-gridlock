import React, { useState, useEffect } from 'react';
import fetch from "node-fetch";
import { Link } from "react-router-dom";
import { Card } from "antd";
import millify from "millify";
import "./tokenIndex.css";
import { useGetCryptosQuery } from './services/cryptoApi';
import { Loader } from "./elements";
import tokenList from "../tokenList"


// wallet holdings
// favorites list
function Account(props) {
  const {isConnect, address} = props
  const [ uuid, setUuid] =useState()
  const { data, isFetching } = useGetCryptosQuery(1200);
  const cryptos = data?.data?.coins;
  const [ holdings, setHoldings ] = useState({
    tokenAddress: [],
    amount: []
  })
  const apiKey = process.env.REACT_APP_ALCHEMY_API;

  const url =`https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;
  const options = {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "alchemy_getTokenBalances",
      params: [address],
  }),
};

async function tokenHoldings() {
  let res = await fetch(url, options);
  let response = await res.json();
  const balances = response["result"];
  const nonZeroBalances = await balances.tokenBalances.filter((token) => {
    return token.tokenBalance !== "0";
  });
  var holdingsAddresses = await nonZeroBalances.map(add=>add.contractAddress);
  
  let i = 1;
  var holdingsAmount = []
  for (let token of nonZeroBalances) {
    let balance = token.tokenBalance;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getTokenMetadata",
        params: [token.contractAddress],
      }),
    };
    let res2 = await fetch(url, options);
    let metadata = await res2.json();
    metadata = metadata["result"];
    balance = balance / Math.pow(10, metadata.decimals);
    balance = balance.toFixed(2);
    console.log(`${i++}. ${metadata.name}: ${balance} ${metadata.symbol}`);
    holdingsAmount.push(balance)
   console.log(holdingsAmount)
  }
  if(holdingsAddresses != holdingsAmount){}
  setHoldings({holdingsAddresses: holdingsAddresses, amount: holdingsAmount})
}

const getUUID = async () => {
  if(!holdings){};
  var matchingUuid = await tokenList.filter((token) => holdings.holdingsAddresses.includes(token.address));
  var arrUuid = await matchingUuid.map((uuid) => uuid.uuid)
  return arrUuid
}

useEffect(() => {
  tokenHoldings()
    if(!holdings){}
    getUUID().then((data) => {
      console.log(data)
      setUuid(data)
    }
    )
},[])

console.log(uuid)

if(isFetching) return <Loader />

  return (
    <div className="ETHDEX">
    <h1 className="heading">Holdings</h1>
    <div className="column-title">
      <span className="column-title-heading">Tokens</span>
      <span className="column-title-heading">Market Cap</span>
      <span className="column-title-heading">Price</span>
      <span className="column-title-heading"></span>
    </div>
    <div>
      {!cryptos || !uuid
        ? null
        : cryptos
            .filter((token) => uuid.includes(token.uuid))
            .map((token, index) => (
              <div className="cardContainer" key={index}>
                  <Card className="daoCard">
                  <Link to={`/${token?.name}/${token?.uuid}`}>
                    <div style={{ display: "flex", textAlign: "left" }} >
                        <div>
                          <img className="logo" src={token.iconUrl} alt="noLogo" />
                        </div>
                        <div>
                          <h4 className="name">{token.name}</h4>
                          <span className="symbol">{token.symbol}</span>
                        </div>
                      <div>
                        <span className="type">
                          {token.marketCap == null ? "--" : millify(token.marketCap)}
                        </span>
                        <span className="lastPrice">
                          {token.price == null ? "--" : millify(token.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Card>
              </div>
            ))}
    </div>
  </div>
  )
}

export default Account