import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Card } from "antd";
import { StarOutlined, StarFilled } from '@ant-design/icons';
import millify from "millify";
import "./tokenIndex.css";
import { useGetCryptosQuery } from './services/cryptoApi';
import { Loader } from "./elements";
import tokenList from "../tokenList.json"
import polygonList from "../polygon.json"
import BNBList from "../BNB.json"

function Tokens(props) {
  const { address } = props;
  const [query, setQuery] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [chain, setChain] = useState('eth');
  const { data, isFetching } = useGetCryptosQuery(1200);
  const cryptos = data?.data?.coins;
  const excludedUuids = ['razxDUgYGNAdQ', 'zNZHO_Sjf'];

  const chains = {
    eth: tokenList,
    bnb: BNBList,
    poly: polygonList,
  };

  const toks = chains[chain]
    .filter((token) => !excludedUuids.includes(token.uuid))
    .map((token) => token.uuid);

  const commodityArray = chains[chain]
    .filter((token) => token.type === 'commodity')
    .filter((token) => !excludedUuids.includes(token.uuid))
    .map((token) => token.uuid);

  const companyArray = chains[chain]
    .filter((token) => token.type === 'company')
    .filter((token) => !excludedUuids.includes(token.uuid))
    .map((token) => token.uuid);

  const currencyArray = chains[chain]
    .filter((token) => token.type === 'currency')
    .filter((token) => !excludedUuids.includes(token.uuid))
    .map((token) => token.uuid);

  const [selectedArray, setSelectedArray] = useState(toks);

  const handleArrayChange = (newArray) => {
    setSelectedArray(newArray);
  };

  const handleChain = (value) => {
    setChain(value);
  };
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

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/data?user=${address}`);
      const data = await response.json();
      console.log(data)
      const watchlistUuids = data.map((item) => item.uuid);
        setWatchlist(watchlistUuids[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, [address]);

  if(isFetching) return <Loader />;

  return (
  <div className="ETHDEX">
    <div className="selectChain">
      <div className={chain === "eth" ? "selectedChain" : "chain"} onClick={() => handleChain('eth')}>
        Ethereum
      </div>
      <div className={chain === "bnb" ? "selectedChain" : "chain"} onClick={() => handleChain('bnb')}>
        Binance
      </div>
      <div className={chain === "poly" ? "selectedChain" : "chain"} onClick={() => handleChain('poly')}>
        Polygon
      </div>
    </div>

    <div className="selectedArrayButtons">
      <div>Filters:</div>
      <button className="selectedArray" onClick={() => handleArrayChange(toks)}>All</button>
      <button className="selectedArray" onClick={() => handleArrayChange(commodityArray)}>Commodity</button>
      <button className="selectedArray" onClick={() => handleArrayChange(companyArray)}>Company</button>
      <button className="selectedArray" onClick={() => handleArrayChange(currencyArray)}>Forex</button>
    </div>

      <div style={{ textAlign: "center" }}>
        <input
          placeholder="Search..."
          className="searchBar"
          type="text"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <h1 className="heading">Tokens</h1>
      <div className="column-title">
        <span className="column-title-heading">Tokens</span>
        <span className="column-title-heading">Market Cap</span>
        <span className="column-title-heading">Price</span>
        <span className="column-title-heading"></span>
      </div>
      <div>
        {!cryptos
          ? null
          : cryptos
              .filter((val) => {
                if (query === "") {
                  return selectedArray.includes(val.uuid);
                } else {
                  return val?.name.toLowerCase().includes(query.toLowerCase()) && 
                  selectedArray.includes(val.uuid);
                  //  && val.Symbol.toLowerCase().includes(query.toLowerCase());
                }
              })
              .map((token, index) => (
                <div key={index}>
                    <Card className="daoCard">
                      <div className="cardContainer" >
                        <Link to={`/${token?.name}/${token?.uuid}`}>
                          <img className="logo" src={token.iconUrl} alt="noLogo" />
                          <div style={{ float: "right" }}>
                            <h4 className="name">{token.name}</h4>
                            <span className="symbol">{token.symbol}</span>
                          </div>
                        </Link>
                        <Link to={`/${token?.name}/${token?.uuid}`} className="type">
                            {token.marketCap == null ? "--" : millify(token.marketCap)}
                        </Link>
                        <Link to={`/${token?.name}/${token?.uuid}`} className="lastPrice">
                            {token.price == null ? "--" : millify(token.price)}
                        </Link>
                        {watchlist && watchlist.includes(token?.uuid) ? (
                        <StarFilled
                          style={{ color: "lime", fontSize: "1.5em", cursor: "pointer" }}
                          onClick={() => removeFromWatchlist(token?.uuid)}
                        />
                      ) : (
                        <StarOutlined
                          style={{ color: "lime", fontSize: "1.5em", cursor: "pointer" }}
                          onClick={() => addToWatchlist(token?.uuid)}
                        />
                      )}
                      </div>
                  </Card>
                </div>
              ))}
      </div>
    </div>
  );
}

export default Tokens