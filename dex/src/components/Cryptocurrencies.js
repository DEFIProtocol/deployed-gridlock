import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Card } from "antd";
import "./tokenIndex.css";
import { useGetCryptosQuery } from './services/cryptoApi';
import millify from "millify";
import { Loader } from "./elements";


function Cryptocurrencies() {
    const [query, setQuery] = useState("");
    const { data, isFetching } = useGetCryptosQuery(30);
    const cryptos = data?.data?.coins;
    const selectedCryptos =["Qwsogvtv82FCd", "razxDUgYGNAdQ", "WcwrkfNI4FUAe","-l8Mn2pVlRs-p","zNZHO_Sjf","qzawljRxB5bYu","a91GCGd_u96cF","D7B1x_ks7WhV5"]

    if(isFetching) return <Loader />;
    console.log(cryptos)
  return (
    <div className="tokenPage">
      <div style={{ textAlign: "center" }}>
        <input
          placeholder="Search..."
          className="searchBar"
          type="text"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <h1 className="heading">Top Cryptocurrencies</h1>
      <div className="column-title">
        <span className="coulmn-title-item">Coins</span>
        <span className="column-title-item">Type</span>
        <span className="column-title-item">Price</span>
        <span className="column-title-item"></span>
      </div>
      <div>
        {!cryptos
          ? null : cryptos
              .filter((val) => {
                if (query === "") {
                  return selectedCryptos.includes(val.uuid);
                } else {
                  return val?.name.toLowerCase().includes(query.toLowerCase()) && 
                  selectedCryptos.includes(val.uuid);
                  //  && val.Symbol.toLowerCase().includes(query.toLowerCase());
                }
              })
              .map((token, index) => (
                <div className="cardContainer" key={index}>
                    <Card className="daoCard">
                  <Link to={`/coins/${token?.name}/${token?.uuid}`}>
                  <div style={{ display: "flex", textAlign: "left" }} >
                  <img className="logo" src={token.iconUrl} alt="noLogo" />
                  <div>
                          <h4 className="name">{token.name}</h4>
                          <span className="symbol">{token.symbol}</span>
                        </div>
                        <div>
                          <span className="type">
                            {token.marketCap == null ? "--" : millify(token.marketCap)}
                          </span>
                          <span className="lastPrice">
                            {token.price == null ? "--" : millify(token.price)}
                          </span>
                        </div>
                      </div>
                      </Link>
                      </Card>
                      </div>
              ))}
      </div>
    </div>
  )
}

export default Cryptocurrencies