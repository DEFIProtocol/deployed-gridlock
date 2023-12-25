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
                <p>Market Cap: {millify(currency.marketCap)}</p>
                <p>Change: {millify(currency.change)}</p>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default Admin;
