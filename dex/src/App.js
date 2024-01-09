import "./App.css";
import {Header, Tokens, Admin, TokenDetails, Cryptocurrencies, CryptoDetails, Home, Swap, Account, Footer } from "./components";
import { Routes, Route } from "react-router-dom";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

function App() {
  const { address, isConnected }= useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  })
  const {disconnect} = useDisconnect()


  return <div className="App">
    <Header connect={connect} isConnect={isConnected} address={address} disconnect={disconnect} />
    <div className="mainWindow">
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/tokens" element={<Tokens address={address} />} />
        <Route path="/admin" element={<Admin />} /> 
        <Route path="/cryptocurrencies" element={<Cryptocurrencies />} /> 
        <Route path="/account" element={<Account isConnect={isConnected} address={address} />} />   
        <Route path="/swap" element={<Swap isConnect={isConnected} address={address}/>} />
        <Route exact path="/:name?/:uuid?" element={<TokenDetails address={address} />} />
        <Route exact path="coins/:name?/:uuid?" element={<CryptoDetails address={address} />} />
      </Routes>
    </div>
    <Footer className="mainWindow"/>
  </div>;
}

export default App;
 