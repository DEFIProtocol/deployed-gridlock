import React, { useState, useEffect, useMemo } from 'react';
import { useGetCryptosQuery } from './services/cryptoApi';
import { Row, Col, Card, Button } from 'antd';
import { Loader } from './elements';
import axios from 'axios';
import millify from 'millify';
import { Link } from 'react-router-dom';
import './tokenIndex.css';

function Admin() {
  const [count, setCount] = useState('100');
  const { data, isFetching } = useGetCryptosQuery(count);
  const cryptos = data?.data?.coins;
  const chains = useMemo(
    () => ['1', '56', '137', '10', '42161', '100', '43114', '250', '8217', '1313161554'],
    []
  );
  const chainNames = ['Ethereum', 'BNB', 'Polygon', 'Optimism', 'Arbitrum', 'Gnosis', 'Avalanche', 'Fantom', 'Klaytn', 'Aurora'];
  const [chainResponses, setChainResponses] = useState({});
  const [selectedChain, setSelectedChain] = useState(null);

  const axiosHeaders = {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_1INCH_API_KEY}`
    }
  };
  
useEffect(() => {
  async function fetchDataForChains() {
    const responses = {};

    for (const chain of chains) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/1inch/v5.2/${chain}/tokens`, axiosHeaders);
        console.log(response);
        const data = response.data;
        responses[chain] = data;
      } catch (error) {
        console.error(`Error fetching data for chain ${chain}:`, error);
      }
    }
    setChainResponses(responses);
  }

  fetchDataForChains();
}, [chains]);

  console.log(chainResponses);

  const handleChainButtonClick = (chain) => {
    setSelectedChain(chain);
  };

  if (isFetching) return <Loader />;
  console.log(cryptos);

  return (
    <>
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
      <Row gutter={[32, 32]} className="crypto-card-container">
        <input value="e" onChange={(e) => setCount(e.target.value)} />
        {cryptos?.map((currency) => (
          <Col xs={24} sm={12} lg={6} className="crypto-card" key={currency.uuid}>
            <Link to={`/crypto/${currency.uuid}`}>
              <Card
                title={`${currency.rank}.${currency.name}`}
                extra={<img className="logo" src={currency.iconUrl} alt="no logo" />}
                hoverable
              >
                <p>Price: {millify(currency.price)}</p>
                <p>Price: {millify(currency.marketCap)}</p>
                <p>Price: {millify(currency.change)}</p>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default Admin;
