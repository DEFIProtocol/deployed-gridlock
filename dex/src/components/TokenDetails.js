import React, { useState } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { Row, Typography, Col } from "antd";
import HTMLReactParser from 'html-react-parser';
import "./tokenIndex.css";
import { MarketOrder, LineChart, Loader, OrderUnavailable, Transactions, UpdateTokenDescription } from "./elements";
import millify from "millify";
import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from './services/cryptoApi';

const {Title} = Typography;

function TokenDetails(props) {
  const { address } = props;
  const location = useLocation();
  const chain = new URLSearchParams(location.search).get('chain');
  const { name, uuid } = useParams();
  const [timeperiod, setTimeperiod] = useState("7d");
  const { data, isFetching } = useGetCryptoDetailsQuery(uuid)
  const { data: coinHistory } = useGetCryptoHistoryQuery({coinId: uuid, timePeriod: timeperiod});
  const [orderType, setOrderType] =useState("market");
  const cryptoDetails = data?.data?.coin

  console.log(name)
    if(isFetching) return <Loader />;
    

    const time = ['7d', '30d', '3m', '1y', '3y', '5y'];
    
    const handleTimePeriodClick = (value) => {
      setTimeperiod(value);
    };

  return (
    <div className="tokenPage">
      <UpdateTokenDescription cryptoDetails={cryptoDetails} address={address} chain={chain} />
      <Row className="coin-stats-card">
      <Title level={2} className="header-item">
        <img src={data?.data?.coin?.iconUrl} className="logo" alt="no logo" />
        {data?.data?.coin.name} ({data?.data?.coin.symbol})
      </Title>
        <div className="header-item">USD Price <br />${(cryptoDetails?.price) && millify(cryptoDetails?.price)}</div>
        <div className="header-item">Max Supply <br />{cryptoDetails?.supply?.total && millify(cryptoDetails?.supply?.total)} {data?.data?.coin.symbol} </div>
        <div className ="header-item">Circulating Supply <br />{cryptoDetails?.supply?.circulating && millify(cryptoDetails?.supply?.circulating)} {data?.data?.coin.symbol} </div>
        <div className="header-item">Market Cap <br />{cryptoDetails?.marketCap && millify(cryptoDetails?.marketCap)}</div>
      </Row>
      
      <Col className="chart-order">
        <Col className="left-column">
          <Row className="chart">
          <LineChart coinHistory={coinHistory} currentPrice={millify(cryptoDetails.price)} coinName={cryptoDetails.name}/>
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
          {orderType === 'limit' ? <OrderUnavailable /> /*<LimitOrder uuid={uuid} />*/ : <MarketOrder symbol ={data?.data?.coin.symbol} chain = {chain} uuid={uuid} address={address} usdPrice={cryptoDetails?.price} tokenName={cryptoDetails.name} />}
        </Row>
        <Row className="website-container">
          <Title level={2} className="website-header">
            Description
          </Title>
          <div className="description">
            {HTMLReactParser(cryptoDetails.description)}
          </div>
        </Row>
        <Row className="website-container">
          <Title level={2} className="website-header">
            Website
          </Title>
          <a href={cryptoDetails?.websiteUrl} className="website" >
            {cryptoDetails?.websiteUrl}
          </a>
        </Row>
        </Col>
      </Col>
      <Row className = "transactions">
        <Transactions chain={chain} symbol ={data?.data?.coin.symbol}/>
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