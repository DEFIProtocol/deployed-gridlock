import "./App.css";
import {Header, Swap, Tokens, Admin, TokenDetails, Cryptocurrencies, CryptoDetails, Home } from "./components";
import { Routes, Route } from "react-router-dom";
import { useConnect, useAccount } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

function App() {
  const { address, isConnected }= useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  })
  return <div className="App">
    <Header connect={connect} isConnect={isConnected} address={address} />
    <div className="mainWindow">
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/tokens" element={<Tokens />} />
        <Route exact path="/admin" element={<Admin />} /> 
        <Route exact path="/cryptocurrencies" element={<Cryptocurrencies />} />    
        <Route path="/swap" element={<Swap isConnect={isConnected} address={address}/>} />
        <Route exact path="/:name?/:uuid?" element={<TokenDetails address={address} />} />
        <Route exact path="coins/:name?/:uuid?" element={<CryptoDetails address={address} />} />
      </Routes>
    </div>
  </div>;
}

export default App;
