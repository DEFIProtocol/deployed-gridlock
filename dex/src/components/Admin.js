import React, { useState, useEffect, useMemo } from 'react';
import { useGetCryptosQuery } from './services/cryptoApi';
import { Row, Card, Button } from 'antd';
import { Loader } from './elements';
import axios from 'axios';
import millify from 'millify';
import { Link } from 'react-router-dom';
import './tokenIndex.css';

function Admin() {
  const [query, setQuery] = useState("");
  const { data, isFetching } = useGetCryptosQuery('1200');
  const cryptos = data?.data?.coins;
  const chains = useMemo(
    () => ['1', '56', '137', '10', '42161', '100', '43114', '250', '8217', '1313161554'],
    []
  );
  const [chainResponses, setChainResponses] = useState(null);
  const chainNames = ['Ethereum', 'BNB', 'Polygon', 'Optimism', 'Arbitrum', 'Gnosis', 'Avalanche', 'Fantom', 'Klaytn', 'Aurora'];
  const [selectedChain, setSelectedChain] = useState(null);

  useEffect(() => {
    if (selectedChain) {
      httpCall(selectedChain);
    }
  }, [selectedChain]);

  async function httpCall(chain) {
    const url = `/api/token/v1.2/${chain}`;

    const config = {
      headers: {
        Authorization: 'Bearer tqkjw2xVn9dKlDY4cwjPE4vwJecA6B4B',
      },
      params: {},
    };

    try {
      const response = await axios.get(url, config);
      console.log(response.data);
      // Update state with the response if needed
      setChainResponses(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  const handleChainButtonClick = (chain) => {
    setSelectedChain(chain);
  };
  console.log(chainResponses)
  const arrayOfObjects = chainResponses === null ? null : JSON.stringify(Object.entries(chainResponses).map(([key, value]) => ({ 
    address: value.address,
    symbol: value.symbol,
    name: value.name,
  })))
  console.log(arrayOfObjects)

  if (isFetching) return <Loader />;
  console.log(cryptos);

  return (
    <div style = {{width: "100%"}}>
    <Row>
      <div className="chain-buttons">
        {chainNames.map((chainName, index) => (
          <Button
          key={chainName}
          type={selectedChain === chains[index] ? 'primary' : 'default'}
          onClick={() => handleChainButtonClick(chains[index])}
          >
            {chainName}
          </Button>
        ))}
      </div>
      </Row>
      <Row gutter={[32, 32]} className="crypto-card-container">
        <div style={{ textAlign: "center" }}>
        <input
          placeholder="Search..."
          className="searchBar"
          type="text"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
        {/*<input value={count} onChange={(e) => setCount(e.target.value)} />*/}
        {!cryptos
          ? null
          : cryptos
              .filter((val) => {
                if (query === "") {
                  return cryptos;
                } else {
                  return val?.name.toLowerCase().includes(query.toLowerCase()) 
                  //  && val.Symbol.toLowerCase().includes(query.toLowerCase());
                }
              })
              .map((token, index) => (
                <div key={index}>
                    <Card className="daoCard">
                      <div className="cardContainer" >
                        {index}
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
                        <span className="symbol">{token.uuid}</span>
                      </div>
                  </Card>
                </div>
              ))}
      </Row>
    </div>
  );
}

export default Admin;
