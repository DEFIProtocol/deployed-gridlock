import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [chain, setChain] = useState('Ethereum');
  const { data, isFetching } = useGetCryptosQuery(1200);
  const cryptos = data?.data?.coins;
  const chains = useMemo(() => ({
    Ethereum: tokenList,
    Binance: BNBList,
    Polygon: polygonList,
  }), []);
  const excludedUuids = useMemo(() => ['razxDUgYGNAdQ', 'zNZHO_Sjf'], []);

  const calculateArrays = useCallback((chain, excludedUuids) => {
    const filteredTokens = chains[chain].filter((token) => !excludedUuids.includes(token.uuid));

    const toks = filteredTokens.map((token) => token.uuid);
    const commodityArray = filteredTokens.filter((token) => token.type === 'commodity').map((token) => token.uuid);
    const companyArray = filteredTokens.filter((token) => token.type === 'company').map((token) => token.uuid);
    const currencyArray = filteredTokens.filter((token) => token.type === 'currency').map((token) => token.uuid);

    return {
      toks,
      commodityArray,
      companyArray,
      currencyArray,
    };
  }, [chains]);

  const [selectedArray, setSelectedArray] = useState();
  const [objectArray, setObjectArray] = useState({
    toks: [],
    commodityArray: [],
    companyArray: [],
    currencyArray: [],
  });

  const handleArrayChange = (newArray) => {
    setSelectedArray(newArray);
  };

  const handleChain = (value) => {
    setChain(value);
    const { toks, commodityArray, companyArray, currencyArray } = calculateArrays(value, excludedUuids);
    setObjectArray({toks, commodityArray, companyArray, currencyArray})}

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

useEffect(() => {
  const { toks, commodityArray, companyArray, currencyArray } = calculateArrays(chain, excludedUuids);
  setObjectArray({ toks, commodityArray, companyArray, currencyArray });
}, [chain, calculateArrays, excludedUuids]);

useEffect(() => {
  setSelectedArray(objectArray.toks);
}, [objectArray]);

  if(isFetching) return <Loader />;

  return (
  <div className="ETHDEX">
    <div className="selectChain">
      <div className={chain === "Ethereum" ? "selectedChain" : "chain"} onClick={() => handleChain('Ethereum')}>
        Ethereum
      </div>
      <div className={chain === "Binance" ? "selectedChain" : "chain"} onClick={() => handleChain('Binance')}>
        Binance
      </div>
      <div className={chain === "Polygon" ? "selectedChain" : "chain"} onClick={() => handleChain('Polygon')}>
        Polygon
      </div>
    </div>

    <div className="selectedArrayButtons">
        <div className= "filters">Filters:</div>
        <button className={`selectedArray ${selectedArray === objectArray.toks ? 'underline' : ''}`} onClick={() => handleArrayChange(objectArray.toks)}>All</button>
        <button className={`selectedArray ${selectedArray === objectArray.commodityArray ? 'underline' : ''}`} onClick={() => handleArrayChange(objectArray.commodityArray)}>Commodity</button>
        <button className={`selectedArray ${selectedArray === objectArray.companyArray ? 'underline' : ''}`} onClick={() => handleArrayChange(objectArray.companyArray)}>Company</button>
        <button className={`selectedArray ${selectedArray === objectArray.currencyArray ? 'underline' : ''}`} onClick={() => handleArrayChange(objectArray.currencyArray)}>Forex</button>
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
          : selectedArray && cryptos
              .filter((val) => {
        if (query === "") {
          return selectedArray.includes(val.uuid);
        } else {
          return (
            val?.name.toLowerCase().includes(query.toLowerCase()) &&
            selectedArray.includes(val.uuid)
          );
        }
      })
              .map((token, index) => (
                <div key={index}>
                  <Card className="daoCard">
                    <div className="cardContainer" >
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