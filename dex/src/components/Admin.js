import React from 'react'
import { useGetCryptosQuery } from './services/cryptoApi';
import { Row, Col, Card } from "antd";
import { Loader } from "./elements";
import millify from 'millify';
import { Link } from 'react-router-dom';
import "./tokenIndex.css";

function Admin() {
  const count = 100;
  const { data, isFetching } = useGetCryptosQuery(count);
  const cryptos = data?.data?.coins;

  if(isFetching) return <Loader />;
  console.log(cryptos);

   return (
    <>

      <Row gutter={[32,32]} className ="crypto-card-container">
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