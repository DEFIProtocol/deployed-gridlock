import React, { useState, useEffect } from 'react';
import "./order.css";
import AllTokens from '../../AllTokens';
import { Popover, Radio, message, Modal } from "antd";
import { SettingOutlined, } from "@ant-design/icons";
import axios from 'axios';
import { useSendTransaction, useWaitForTransaction } from "wagmi";
import { useEthereum } from ".";
 
const getChainLabel = (chain) => {
  switch (chain) {
    case 'Arbitrum':
    case 'Aurora':
    case 'Ethereum':
    case 'Optimism':
      return 'Ethereum';
    case 'Avalanche':
      return 'Avalanche';
    case 'Polygon':
      return 'Polygon';
    case 'Fantom':
      return 'Fantom';
    case 'Klaytn':
      return 'Klaytn';
    case 'Binance':
      return 'Binance';
    default:
      return '';
  }
};
 
function MarketOrder(props) {
  const { address, usdPrice, tokenName, chain, symbol, decimals } = props;
  const tokenObject= AllTokens.find((token) => token.symbol.toLowerCase() === symbol.toLowerCase());
  const [messageApi, contextHolder] = message.useMessage()
  const [amount, setAmount] = useState(null);
  const [slippage, setSlippage] = useState(2.5);
  const [txDetailsSent, setTxDetailsSent] = useState(false);
  const decimalInteger = parseInt(Number(`1e+${decimals}`), 10);
  const [chainId, setChainId]= useState();
  const [ selectedChain, setSelectedChain ] = useState(chain);
  const ethAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  const { cryptoDetails } = useEthereum(getChainLabel(selectedChain));
  const ethExRate = usdPrice / cryptoDetails?.price
  const baseLine = "1";
  const [checked, setChecked] = useState("usd")
  const [txDetails, setTxDetails] = useState({
    to: null,
    data: null,
    value: null,
  })
  const {data, sendTransaction}= useSendTransaction({
    request: {
      from: address,
      to: String(txDetails.to),
      data: String(txDetails.data),
      value: String(txDetails.value),
    }
  })
  const {isLoading, isSuccess} = useWaitForTransaction({
    hash: data?.hash
  })
 
  function handleSlippageChange(e){
    setSlippage(e.taget.value);
  }
  
  const axiosHeaders = {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_1INCH_API_KEY}`,
      accept: "application/json",
    }
  };
  
  async function fetchDexBuy() {
    const tokenAmount = calculateTokenAmount();
  
    try {
      const quoteResponse = await fetchQuote(ethAddress, tokenObject.chains[selectedChain], tokenAmount);
      showConfirmationModal(quoteResponse, tokenAmount, true);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error appropriately
    }
  }
  
  async function fetchDexSell() {
    const tokenSellAmount = calculateTokenSellAmount();
  
    try {
      const quoteResponse = await fetchQuote(tokenObject.chains[selectedChain], ethAddress, tokenSellAmount);
      showConfirmationModal(quoteResponse, tokenSellAmount, false);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error appropriately
    }
  }
  
  async function fetchQuote(src, dst, amount) {
    console.log(`${process.env.REACT_APP_BACKEND}/api/1inch/swap/v5.2/${chainId}/quote?src=${src}&dst=${dst}&amount=${parseInt(amount)}&fee=1&includeTokensInfo=true&includeGas=true`)
    const quoteResponse = await axios.get(
      `${process.env.REACT_APP_BACKEND}/api/1inch/swap/v5.2/${chainId}/quote?src=${src}&dst=${dst}&amount=${parseInt(amount)}&fee=1&includeTokensInfo=true&includeGas=true`,
      axiosHeaders
    );
    console.log(quoteResponse.data);
    return quoteResponse.data;
  }
  
  function showConfirmationModal(quoteResponse, amount, isBuy) {
    Modal.confirm({
      title: isBuy ? (<div style={{color: "white"}}>Confirm Buy</div>) : (<div style={{color: "white"}}>Confirm Sell</div>),
      content: (
        <div style={{color: "white"}}>
          <p>
            Are you sure you want to {isBuy ? 'buy' : 'sell'} {parseInt(amount)/ (10**quoteResponse.fromToken.decimals) } {getChainLabel(selectedChain)}  (${((parseInt(amount) / 10**quoteResponse.fromToken.decimals) * cryptoDetails.price).toFixed(2)}) {tokenObject.symbol}?
          </p>
          <div style={{margin: "10%"}}>
            <img className= "logo" src={quoteResponse.fromToken.logoURI} alt={quoteResponse.fromToken.name} />
            <span>
              {quoteResponse.fromToken.name} ({quoteResponse.fromToken.symbol})
            </span>
            <div>Exchange from: {parseInt(amount)/ 10**quoteResponse.fromToken.decimals}</div>
            <div style={{marginLeft: "32px"}}>USD Value: {((parseInt(amount) / 10**quoteResponse.fromToken.decimals) * cryptoDetails.price).toFixed(2)}</div>
          </div>
          <div style={{margin: "10%"}}>
            <img className= "logo" src={quoteResponse.toToken.logoURI} alt={quoteResponse.toToken.name} />
            <span>
              {quoteResponse.toToken.name} ({quoteResponse.toToken.symbol})
            </span>
            <div>Exchange to: {quoteResponse.toAmount/ 10**quoteResponse.toToken.decimals}</div>
            <div style={{marginLeft: "32px"}}>USD value: {((parseInt(quoteResponse.toAmount) / 10**quoteResponse.toToken.decimals)* usdPrice).toFixed(2)}</div>
          </div>
          <div>Gas Fee:    {quoteResponse.gas} (${((quoteResponse.gas / 1e+18) * cryptoDetails.price).toFixed(2)})</div>
          <div>Transacion Fee: {((parseInt(amount) / 1e+18)* ".01").toFixed(6)} (${(((parseInt(amount) / 1e+18)* ".01")* cryptoDetails.price).toFixed(2)})</div>
          <div>Transacion Total: {((parseInt(amount) / 1e+18)* ".01") + (quoteResponse.gas / 1e+18) + (parseInt(amount)/ 1e+18)} (${((((parseInt(amount) / 1e+18)* ".01")* cryptoDetails.price) + ((quoteResponse.gas / 1e+18) * cryptoDetails.price) + ((parseInt(amount) / 1e+18) * cryptoDetails.price)).toFixed(2)})</div>
        </div>
      ),
      onOk: async () => {
        try {
          const amount = isBuy ? calculateTokenAmount() : calculateTokenSellAmount();
          const allowanceResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND}/api/1inch/swap/v5.2/${chainId}/approve/allowance?tokenAddress=${ethAddress}&walletAddress=${address}`,
            axiosHeaders
          );
          const allowance = allowanceResponse.data;
          console.log(allowance);
          console.log(allowanceResponse);
  
          if (allowance.allowance === "0") {
            const approveResponse = await axios.get(
              `${process.env.REACT_APP_BACKEND}/api/1inch/swap/v5.2/${chainId}/approve/transaction?tokenAddress=${ethAddress}&amount=${amount}`,
              axiosHeaders
            );
            console.log(approveResponse);
            setTxDetails(approveResponse.data);
            console.log("Not Approved");
            return;
          }
  
          const txResponse = await executeTransaction(quoteResponse, isBuy);
          let decimals = Number(`1E${tokenObject.decimals}`);
          let tokenTwo = (Number(txResponse.data.toTokenAmount) / decimals).toFixed(2);
          console.log(tokenTwo);
          return setTxDetails(txResponse.data.tx);
        } catch (error) {
          alert("Sorry something went wrong! " + error);
        }
      },
      onCancel: () => {
        console.log(isBuy ? 'Buy Cancelled' : 'Sell Cancelled');
      },
    });
  }
  
  async function executeTransaction(quoteResponse, isBuy) {
    const src = isBuy ? ethAddress : tokenObject.chains[selectedChain];
    const dst = isBuy ? tokenObject.chains[selectedChain] : ethAddress;
    const amount = isBuy ? calculateTokenAmount() : calculateTokenSellAmount();
    const txResponse = await axios.get(
      `${process.env.REACT_APP_BACKEND}/api/1inch/swap/v5.2/${chainId}/swap?src=${src}&dst=${dst}&amount=${parseInt(amount)}&from=${address}&slippage=${slippage}&fee=1&referrer=${process.env.REACT_APP_ADMIN_ADDRESS}&receiver=${address}`,
      axiosHeaders
    );
    return txResponse;
  }
  
  function calculateTokenAmount() {
    if (checked === "eth") {
      return String(amount * (baseLine.padEnd(18 + baseLine.length, '0')));
    } else if (checked === "usd") {
      return String((amount / cryptoDetails.price) * (baseLine.padEnd(18 + baseLine.length, '0')));
    } else {
      return String((amount * ethExRate) * (baseLine.padEnd(18 + baseLine.length, "0")));
    }
  }
  
  function calculateTokenSellAmount() {
    if (checked === "eth") {
      return String(Math.trunc(amount / ethExRate * (baseLine.padEnd(tokenObject.decimals + baseLine.length, '0'))));
    } else if (checked === "usd") {
      return String(Math.trunc((amount / usdPrice) * (baseLine.padEnd(tokenObject.decimals + baseLine.length, '0'))));
    } else {
      return String(amount * (baseLine.padEnd(tokenObject.decimals + baseLine.length, "0")));
    }
  }
 
  useEffect(() => {
    if (txDetails.to && address && !txDetailsSent) { // Add a check for txDetailsSent
      sendTransaction();
      setTxDetailsSent(true); // Set txDetailsSent to true to avoid repeated calls
    }
  }, [txDetails.to, address, sendTransaction, txDetailsSent]);
 
  useEffect(() => {
    messageApi.destroy();
    if(isLoading){
      messageApi.open({
        type: 'loading',
        content: 'Transaction is Pending...',
        duration: 0,
      })
    }
  }, [isLoading, messageApi])
 
  useEffect(()=> {
    switch(selectedChain)  {
    case 'Arbitrum':
      setChainId("42161")
      break;
    case 'Aurora':
      setChainId("1313161554")
      break;
    case 'Ethereum':
      setChainId("1")
      break;
    case 'Optimism':
      setChainId("10")
      break;
    case 'Avalanche':
      setChainId("43114")
      break;
    case 'Polygon':
      setChainId("137")
      break;
    case 'Fantom':
      setChainId("250")
      break;
    case 'Klaytn':
      setChainId("8217")
      break;
    case 'Binance':
      setChainId("56")
      break;
    default:
      return '';
  }},[selectedChain])
 
  useEffect(() => {
    messageApi.destroy();
    if(isSuccess){
      messageApi.open({
        type: 'success',
        content: 'Transaction Successful',
        duration: 1.5,
      })
    }else if (txDetails.to){
      messageApi.open({
        type: 'error', 
        content: 'Transaction Failed',
        duration: 1.5
      })
    }
  }, [isSuccess, messageApi, txDetails.to])
 
  console.log(txDetails)
 
  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange} >
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5.0%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  )
  
  return (
    <>
    {contextHolder}
      <div className="checkboxContainer">
        <div className="checkboxes">
        <label htmlFor="SelectChain" style={{color: "white"}}>Select Chain for Transaction</label>
        <select onChange={(e) => setSelectedChain(e.target.value)} value={selectedChain} className="selectChainOrder" id="SelectChain">
            {tokenObject?.chains &&
              Object.entries(tokenObject.chains).map(([chainKey, chainValue]) => (
                <option key={chainKey} value={chainKey} disabled={!chainValue}>
                  {chainKey}
                </option>
              ))}
          </select>
          <input
            type="checkbox"
            name="Priced in Eth"
            value="eth"
            checked={checked === "eth" ? checked : null }
            onChange={(e) => setChecked(e.target.value)}
          />
          <label htmlFor="ethEx" style={{ color: 'DarkGray' }}>
            {' '}
            Order Priced in Ethereum
          </label>
 
        <br />
        <input
          type="checkbox"
          name="Priced in USD"
          value="usd"
          checked={checked === "usd" ? checked : !checked}
          onChange={(e) => setChecked(e.target.value)}
          />
        <label htmlFor="usdEx" style={{ color: 'DarkGray' }}>
          {' '}
          Order Priced in USD
        </label>
        <br />
        <input
          type="checkbox"
          name="Priced in USD"
          value={`${tokenName}`}
          checked={checked === tokenName ? checked : null}
          onChange={(e) => setChecked(e.target.value)}
          />
        <label htmlFor="usdEx" style={{ color: 'DarkGray' }}>
          {' '}
          Order Priced in {tokenName}
        </label>
        </div>
        <Popover 
        content={settings}
        title="settings"
        trigger="click"
        placement="bottomLeft"
      >
        <SettingOutlined className="cog" />
      </Popover>
      </div>
      <div style={{color: "white", margin: "0px auto"}}>
        {!getChainLabel(selectedChain) ? "Ethereum" : getChainLabel(selectedChain)} / {tokenName}
        </div>
      <input type="text" placeholder="Amount" className="input" onChange={(e) => setAmount(e.target.value)} />
      <div className="buttonContainer">
        <button className="buyButton" type="button" placeholder="Buy" value="buy" disabled={!amount || !address } onClick={fetchDexBuy} >
          Buy
        </button>
        <button className="sellButton" type="button" placeholder="Sell" value="sell" disabled={!amount || !address } onClick={fetchDexSell} >
          Sell
        </button>  
      </div>
      <div style={{color: "lime", fontWeight: '700', margin: "0px auto", padding: "4%"}}>
        Eth Price per Token = {ethExRate}
      </div>
    </>
  );
}
 
export default MarketOrder;
