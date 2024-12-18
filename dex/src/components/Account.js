import React, { useState, useEffect, useMemo, useCallback } from 'react';
import fetch from "node-fetch";
import { useNavigate } from "react-router-dom";
import { Card } from "antd";
import { CheckOutlined, PlusCircleOutlined } from '@ant-design/icons';
import millify from "millify";
import "./tokenIndex.css";
import { useGetCryptosQuery } from './services/cryptoApi';
import { Loader } from "./elements";
import tokenList from "../tokenList"
import {ethers} from "ethers";
import { useEthereum } from "./elements";


function Account(props) {
  const {address} = props
  const [ uuid, setUuid] =useState();
  const [balance, setBalance] = useState();
  const [ watchlist, setWatchlist] = useState();
  const [totalHoldingsValue, setTotalHoldingsValue] = useState(''); 
  const navigate = useNavigate();
  const chain = "Ethereum";
  const { data, isFetching } = useGetCryptosQuery(1200);
  const { cryptoDetails } = useEthereum();
  const cryptos = data?.data?.coins;
  const [ holdings, setHoldings ] = useState({
    tokenAddress: [],
    amount: []
  })

  const apiKey = process.env.REACT_APP_ALCHEMY_API;

  const url =`https://eth-mainnet.g.alchemy.com/v2/${apiKey}` ;

const addToWatchlist = async (uuid) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/addToWatchlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        uuid: uuid,
      }),
    });
    const data = await response.json();
    console.log(data.message); // Optional: Log the response message
    // Update the watchlist state here
    setWatchlist([...watchlist, uuid]);
  } catch (error) {
    console.error('Error adding token to watchlist:', error);
  }
};

const removeFromWatchlist = async (uuid) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/removeFromWatchlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        uuid: uuid,
      }),
    });
    const data = await response.json();
    console.log(data.message); // Optional: Log the response message
    // Update the watchlist state here
    setWatchlist(watchlist.filter((item) => item !== uuid));
  } catch (error) {
    console.error('Error removing token from watchlist:', error);
  }
};

// Get Holidings amounts and then runs getUUID() and calculateTotalValue()

const getUUID = async (e) => {
  const matchingUuid = tokenList.filter((token) =>
    e?.tokenAddress?.includes(token.address)
  );
  const arrUuid = matchingUuid.map((uuid) => uuid.uuid);
  return arrUuid;
};

const calculateTotalValue = useCallback((e) => {
  let totalValue = 0; 
  if (cryptos && uuid) {
    cryptos
      .filter((token) => uuid.includes(token.uuid) && token.uuid !== "Mtfb0obXVh59u")
      .forEach((token, index) => {
        const amount = parseFloat(e?.amount[index]);
        const price = parseFloat(token.price);
        if (!isNaN(amount) && !isNaN(price)) {
          totalValue += amount * price;
        }
      });
  }
  return totalValue.toFixed(2);
}, [cryptos, uuid]);

useMemo(() => {
  const tokenHoldings = async () => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { accept: "application/json", "content-type": "application/json" },
        body: JSON.stringify({
          id: 1,
          jsonrpc: "2.0",
          method: "alchemy_getTokenBalances",
          params: [address],
      }),
    });
      const response = await res.json();
      const balances = response["result"];
      const nonZeroBalances = balances.tokenBalances.filter((token) => token.tokenBalance !== "0");
      const holdingsAddresses = nonZeroBalances.map((token) => token.contractAddress);
      const holdingsAmountPromises = nonZeroBalances.map(async (token) => {
        const res2 = await fetch(url, {
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
        });
        const metadata = await res2.json();
        const balance = token.tokenBalance / Math.pow(10, metadata.result.decimals);
        return balance.toFixed(4);
      });
      const holdingsAmount = await Promise.all(holdingsAmountPromises);
      const newHoldings = { tokenAddress: holdingsAddresses, amount: holdingsAmount };
      setHoldings(newHoldings);
      getUUID(newHoldings).then((data) => {
        setUuid(data);
      });
    } catch (error) {
      console.error('Error fetching token holdings:', error);
    }
  };

  tokenHoldings();
}, [ url, address]);


useEffect(() => {
  const getBalance = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balanceWei = await provider.getBalance(address);
      const balanceEther = ethers.utils.formatEther(balanceWei);
      const roundedBalance = Number(balanceEther).toFixed(5);
      const balanceInUsd = cryptoDetails?.price * balanceEther
      setBalance(roundedBalance + `ETH ($${balanceInUsd.toFixed(2)})`);
    } catch (error) {
      console.error('Error:', error);
      setBalance('Error fetching balance');
    }
  };
  window.ethereum.enable().then(() => {
    getBalance();
  });
}, [address, cryptoDetails]);

  useMemo(() => {
    const calculatedTotalValue = calculateTotalValue(holdings);
    setTotalHoldingsValue(calculatedTotalValue);
  }, [holdings, calculateTotalValue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/data?user=${address}`);
        const data = await response.json();
        console.log(data);
        const watchlistUuids = data.map((item) => item.uuid);
          setWatchlist(watchlistUuids[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [address]);


return (
  <div className="accountsPage">
    <h1 className="heading">Total Holdings: ${totalHoldingsValue}</h1>
    <h1 className="heading">Buying Power: {balance}</h1>
    <h1 className="heading">Holdings</h1>
    <div className="column-title">
      <span className="column-title-heading">Tokens</span>
      <span className="column-title-heading">Market Cap</span>
      <span className="column-title-heading">Price</span>
      <span className="column-title-heading">Amount</span>
      <span className="column-title-heading"></span>
    </div>
    <div>
      {(cryptos && uuid && uuid.length > 0) ? (
        cryptos
          .filter((token) => uuid.includes(token.uuid) && token.uuid !== "Mtfb0obXVh59u")
          .map((token, index) => (
            <div key={index}>
  <Card className="daoCard">
    <div className="cardContainer">
      <div onClick={() => navigate(`/${token?.name}/${token?.uuid}?chain=${chain}`)}>
        <img className="logo" src={token.iconUrl} alt="noLogo" />
        <div style={{ float: "right" }}>
          <h4 className="name">{token.name}</h4>
          <span className="symbol">{token.symbol}</span>
        </div>
      </div>
      <div onClick={() => navigate(`/${token?.name}/${token?.uuid}?chain=${chain}`)} className="type">
        {token.marketCap == null ? "--" : millify(token.marketCap)}
      </div>
      <div onClick={() => navigate(`/${token?.name}/${token?.uuid}?chain=${chain}`)} className="lastPrice">
        {token.price == null ? "--" : millify(token.price)}
      </div>
      {watchlist && watchlist.includes(token?.uuid) ? (
        <CheckOutlined
          style={{ color: "lime", fontSize: "1.5em", cursor: "pointer" }}
          onClick={() => removeFromWatchlist(token?.uuid)}
        />
      ) : (
        <PlusCircleOutlined
          style={{ color: "lime", fontSize: "1.5em", cursor: "pointer" }}
          onClick={() => addToWatchlist(token?.uuid)}
        />
      )}
    </div>
  </Card>
</div>

          ))
      ) : (
        <div>
        <p>No token holdings!</p>
        {isFetching || !uuid ? <Loader /> : null}
        </div>
      )}
    </div>
    <h1 className="heading">Watchlist</h1>
    <div className="column-title">
      <span className="column-title-heading">Tokens</span>
      <span className="column-title-heading">Market Cap</span>
      <span className="column-title-heading">Price</span>
      <span className="column-title-heading"></span>
    </div>
    <div>
      {(cryptos && watchlist && watchlist.length > 0) ? (
        cryptos
          .filter((token) => watchlist.includes(token.uuid))
          .map((token, index) => (
            <div key={index}>
              <Card className="daoCard">
                <div className="cardContainer">
                <div onClick={() => navigate(`/${token?.name}/${token?.uuid}?chain=${chain}`)}>
                          <img className="logo" src={token.iconUrl} alt="noLogo" />
                          <div style={{ float: "right" }}>
                            <h4 className="name">{token.name}</h4>
                            <span className="symbol">{tokenList.symbol}</span>
                          </div>
                        </div>
                        <div onClick={() => navigate(`/${token?.name}/${token?.uuid}?chain=${chain}`)} className="type">
                            {token.marketCap == null ? "--" : millify(token.marketCap)}
                        </div>
                        <div onClick={() => navigate(`/${token?.name}/${token?.uuid}?chain=${chain}`)} className="lastPrice">
                            {token.price == null ? "--" : millify(token.price)}
                        </div>
                        {watchlist && watchlist.includes(token?.uuid) ? (
                        <CheckOutlined
                          style={{ color: "lime", fontSize: "1.5em", cursor: "pointer" }}
                          onClick={() => removeFromWatchlist(token?.uuid)}
                        />
                      ) : (
                        <PlusCircleOutlined
                          style={{ color: "lime", fontSize: "1.5em", cursor: "pointer" }}
                          onClick={() => addToWatchlist(token?.uuid)}
                        />
                      )}
                      </div>
                  </Card>
            </div>
          ))
      ) : (
        <div>
        <p>You are not watching any tokens!</p>
        {isFetching || !uuid ? <Loader /> : null}
        </div>
      )}
    </div>
  </div>
);
}

export default Account