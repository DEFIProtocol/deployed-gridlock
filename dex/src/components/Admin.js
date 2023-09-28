import React, { useState, useEffect, useMemo } from 'react'
import { useGetCryptosQuery } from './services/cryptoApi';
import { Row, Col, Card, Button } from "antd";
import { Loader } from "./elements";
import millify from 'millify';
import { Link } from 'react-router-dom';
import "./tokenIndex.css";

function Admin() {
  const [count, setCount] = useState("100")
  const { data, isFetching } = useGetCryptosQuery(count);
  const cryptos = data?.data?.coins;
  const chains = useMemo(
    () => ["1","56","137","10","42161","100","43114","250","8217","1313161554"],
    []
  );
  const chainNames = ["Ethereum","BNB","Polygon","Optimism","Arbitrum","Gnosis","Avalanche","Fantom","Klaytn","Aurora"]
  const axiosHeaders = {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_1INCH_API_KEY}`
    }
  };
  const [chainResponses, setChainResponses] = useState({});
  const [selectedChain, setSelectedChain] = useState(null);

  useEffect(() => {
    // Define the fetch1InchTokens function inside the useEffect callback
    async function fetch1InchTokens(chain) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND}/api/1inch/token/v1.2/${chain}?provider=1inch&country=US`,
          axiosHeaders
        );
        const data = await response.json();
        console.log(data);
        return data;
      } catch (error) {
        throw error;
      }
    }
  
    // Fetch data for each chain when the component mounts
    async function fetchDataForChains() {
      const responses = {};
  
      for (const chain of chains) {
        try {
          const response = await fetch1InchTokens(chain);
          responses[chain] = response;
        } catch (error) {
          console.error(`Error fetching data for chain ${chain}:`, error);
        }
      }
  
      setChainResponses(responses);
    }
  
    fetchDataForChains();
  }, [chains]); // Include 'chains' as a dependency
  
  console.log(chainResponses)

  async function fetch1InchTokens(chain) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}/api/1inch/token/v1.2/${chain}?provider=1inch&country=US`,
        axiosHeaders
      );
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  const handleChainButtonClick = (chain) => {
    setSelectedChain(chain);
  };

  if(isFetching) return <Loader />;
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
      <Row gutter={[32,32]} className ="crypto-card-container">
        <input value="e" onChange={(e) => setCount(e.target.value)} />
        {cryptos?.map((currency) => (
          <Col xs={24} sm={12} lg ={6} className ='crypto-card'>
            <Link key={currency.uuid} to = {`/crypto/${currency.uuid}`}>
              <Card 
                title = {`${currency.rank}.${currency.name}`}
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
  )
}

export default Admin;