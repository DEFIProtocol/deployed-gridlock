import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { Row, Typography, Col } from "antd";
import HTMLReactParser from 'html-react-parser';
import "./tokenIndex.css";
import { MarketOrder, LineChart, Loader, OrderUnavailable, Transactions, UpdateTokenDescription, Announcement, BugWarning } from "./elements";
import millify from "millify";
import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from './services/cryptoApi';
import axios from 'axios';

const {Title} = Typography;

function TokenDetails(props) {
  const { address } = props;
  const location = useLocation();
  const chain = new URLSearchParams(location.search).get('chain');
  const { name, uuid } = useParams();
  const [timeperiod, setTimeperiod] = useState("7d");
  const [tokenData, setTokenData]= useState(null);
  const { data, isFetching } = useGetCryptoDetailsQuery(uuid)
  const { data: coinHistory } = useGetCryptoHistoryQuery({coinId: uuid, timePeriod: timeperiod});
  const [orderType, setOrderType] =useState("market");
  const [ fetched, setFetched] = useState(false)
  const cryptoDetails = data?.data?.coin

  console.log(name)
  console.log(tokenData)
  

    const time = ['7d', '30d', '3m', '1y', '3y', '5y'];
    
    const handleTimePeriodClick = (value) => {
      setTimeperiod(value);
    };
    
    useEffect(()=> {
      const fetchTokenData = async () => {
        try {
          if (!tokenData) {
            setTokenData({
              uuid: uuid,
              chains: null,
              creatorAddress: null,
              Announcements: null,
              adminAddresses: null,
              description: cryptoDetails.description,
              maxSupply: cryptoDetails.supply.max,
              circulatingSupply: cryptoDetails.supply.circulating,
              website: cryptoDetails.websiteUrl,
              name: cryptoDetails.name,
              symbol: cryptoDetails.symbol,
              iconUrl: cryptoDetails.iconUrl,
              type: null,
              secRegistered: null,
              votingEnabled: null
            });
            return;
          }
      
          const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/tokens/${cryptoDetails.uuid}`);
          if (!response) {
            setTokenData({
              uuid: uuid,
              chains: null,
              creatorAddress: null,
              Announcements: null,
              adminAddresses: null,
              description: cryptoDetails.description,
              maxSupply: cryptoDetails.supply.max,
              circulatingSupply: cryptoDetails.supply.circulating,
              website: cryptoDetails.websiteUrl,
              name: cryptoDetails.name,
              symbol: cryptoDetails.symbol,
              iconUrl: cryptoDetails.iconUrl,
              type: null,
              secRegistered: null,
              votingEnabled: null
            });
          } else {
            setTokenData(response.data);
            setFetched(true);
          }
        } catch (error) {
          console.error('Error fetching token data:', error);
        }
      };
      if(!fetched) {
        fetchTokenData()
      }
    },[cryptoDetails, uuid, tokenData, fetched]);

    if(isFetching || !tokenData) return <Loader />;
  return (
    <div className="tokenPage">
      <BugWarning />
      <UpdateTokenDescription cryptoDetails={tokenData} address={address} chain={chain} />
      <Row className="coin-stats-card">
      <Title level={2} className="header-item">
        <img src={!tokenData.iconUrl ? cryptoDetails.iconUrl : tokenData.iconUrl} className="logo" alt="no logo" />
        {!tokenData.name ? cryptoDetails.name : tokenData.name} ({!tokenData.symbol ? cryptoDetails.symbol : tokenData.symbol})
      </Title>
        <div className="header-item">USD Price <br />${(cryptoDetails?.price) && millify(cryptoDetails?.price)}</div>
        {(!tokenData.maxSupply && !cryptoDetails?.supply.max) ? null : (
        <div className="header-item">
          Max Supply <br />
          {tokenData.maxSupply || cryptoDetails?.supply?.max
            ? millify(tokenData.maxSupply || cryptoDetails?.supply?.max)
            : 'N/A'} {tokenData.symbol || cryptoDetails.symbol}
        </div>
        )}
        <div className="header-item">
          Circulating Supply <br />
          {tokenData.circulatingSupply || cryptoDetails?.supply?.circulating
            ? millify(tokenData.circulatingSupply || cryptoDetails?.supply?.circulating)
            : 'N/A'} {tokenData.symbol || cryptoDetails.symbol}
        </div>
        <div className="header-item">Market Cap <br />{cryptoDetails?.marketCap && millify(cryptoDetails?.marketCap)}</div>
      </Row>
      
      <Col className="chart-order">
        <Col className="left-column">
          <Row className="chart">
          <LineChart coinHistory={coinHistory} currentPrice={millify(cryptoDetails.price)} coinName={!tokenData.name ? cryptoDetails.name : tokenData.name}/>
          <div className="time-period-buttons">
              {time.map((date) => (
                <div
                  key={date}
                  className={timeperiod === date ? "selected" : ""}
                  onClick={() => handleTimePeriodClick(date)}
                >
                  {date}
                </div>
              ))}
            </div>
          </Row>
          <Row className="stats-card">
            <Title level={2} style={{color: "lime", margin: "0px auto", marginTop: "2%"}}>
              Additional Stats
            </Title>
            <div className="stats-card-data">
              <div className="stat-item">All Time high: <br /> ${cryptoDetails?.allTimeHigh?.price && millify(cryptoDetails?.allTimeHigh?.price)}</div>
              <div className="stat-item">Percent Change: <br />{cryptoDetails?.change}% </div>
              <div className="stat-item">Number of Markets: <br/> {cryptoDetails?.numberOfMarkets}</div>
              <div className="stat-item">Number of Exchanges: <br /> {cryptoDetails?.numberOfExchanges}</div>
              <div className="stat-item">Rank: <br/> {cryptoDetails?.rank}</div>
            </div>
          </Row>
          <Row>
            {!tokenData.Announcement ? null : 
           <Announcement announcements={tokenData.Announcement} />
            }
          </Row>
        </Col>

        <Col className="right-column">
        <Row className="card-order">
          <div className="orderChoice">
            <div onClick={() => setOrderType('limit')} className={orderType === 'limit' ? "selected" : "unselected"}>
              Limit Order
            </div>
            <div className={orderType === 'limit' ? "unselected" : "selected"} onClick={() => setOrderType('market')}>
              Market Order
            </div>
          </div>
          {orderType === 'limit' ? <OrderUnavailable /> /*<LimitOrder uuid={uuid} />*/ : <MarketOrder symbol ={!tokenData.symbol ? cryptoDetails.symbol : tokenData.symbol} chain = {chain} uuid={uuid} address={address} usdPrice={cryptoDetails?.price} tokenName={!tokenData.name ? cryptoDetails.name : tokenData.name} />}
        </Row>
        <Row className="website-container">
          <Title level={2} className="website-header">
            Description
          </Title>
          <div className="description">
            {HTMLReactParser(!tokenData.description ? cryptoDetails.description : tokenData.description)}
          </div>
        </Row>
        <Row className="website-container">
          <Title level={2} className="website-header">
            Website
          </Title>
          <a href={!tokenData.website ? cryptoDetails?.websiteUrl : tokenData.website} className="website" >
            {!tokenData.website ? cryptoDetails?.websiteUrl : tokenData.website}
          </a>
        </Row>
        </Col>
      </Col>
      <Row className = "transactions">
        <Transactions chain={chain} symbol ={!tokenData.symbol ? cryptoDetails.symbol : tokenData.symbol} />
      </Row>
    </div>
  )
}

export default TokenDetails;
/*{cryptoDetails.links?.map((link) => (
            <Row className="coin-link" key={link.name}>
              <Title level={5} className="link-name">{link.type}</Title>
              <a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
            </Row>
          ))}*/