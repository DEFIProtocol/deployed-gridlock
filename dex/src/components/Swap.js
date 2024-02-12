import React, { useState, useEffect, useCallback } from 'react'
import axios from "axios";
import { Input, Popover, Radio, Modal, message } from "antd";
import { ArrowDownOutlined, DownOutlined, SettingOutlined, } from "@ant-design/icons";
import tokenList from "../tokenList.json";
import BNBList from "../BNB.json";
import polygonList from "../polygon.json";
import AllTokens from "../AllTokens.json";
import { useSendTransaction, useWaitForTransaction } from "wagmi";
import { useGetCryptosQuery } from './services/cryptoApi';
import { Loader } from "./elements";
import { useEthereum } from "./elements";

function Swap(props) {
  const {address, isConnect } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [slippage, setSlippage] = useState(2.5);
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const {data: tokenData, isFetching } = useGetCryptosQuery(1200);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  const [ chain, setChain] = useState('Ethereum');
  const [ chainId, setChainId] = useState('1');
  const { cryptoDetails } = useEthereum(chain);
  const [ list, setList]= useState(tokenList);
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken]= useState(1);
  const [prices, setPrices] = useState();
  const axiosHeaders = {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_1INCH_API_KEY}`
    }
  };
  
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

  const handleChain = (value) => {
    setChain(value);
  }

  function changeAmount(e){
    setTokenOneAmount(e.target.value)
    if(e.target.value && prices){
      setTokenTwoAmount((e.target.value * prices).toFixed(2))
    } else {
      setTokenTwoAmount(null)
    }
  }

  function switchTokens(){
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
  }

  function openModal(asset){
    setChangeToken(asset);
    setIsOpen(true);
  }

  function modifyToken(i){
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    if(changeToken ===1){
      setTokenOne(tokenList[i]) //this is what I modify
      fetchPrices(tokenList[i].uuid, tokenTwo.uuid)
    } else {
      setTokenTwo(tokenList[i]) // this is also what I modify
      fetchPrices(tokenOne.uuid, tokenList[i].uuid)
    }
    setIsOpen(false);
  }

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

const fetchPrices = useCallback(async (one, two) => {
    const firstToken = await tokenData.data.coins.find((token) => token.uuid === one);
    const secondToken = await tokenData.data.coins.find((token) => token.uuid === two);
    if (firstToken && secondToken) {
      const priceRatio = firstToken.price / secondToken.price;
      setPrices(priceRatio);
      console.log(priceRatio);
    } else {
      console.log('Token not found');
    }
}, [tokenData, setPrices]);

  async function fetchDexSwap() {
    const addressOne = !tokenOne.ticker ? AllTokens.find((token) => token.symbol === tokenOne.symbol) : AllTokens.find((token) => token.symbol === tokenOne.ticker)
    const addressTwo = !tokenTwo.ticker ? AllTokens.find((token) => token.symbol === tokenTwo.symbol) : AllTokens.find((token) => token.symbol === tokenTwo.ticker)
    const baseLine = "1";
    const tokenAmount = Math.trunc(tokenOneAmount * (baseLine.padEnd(tokenOne.decimals, '0')))
    try {
      const quoteResponse = await fetchQuote(addressOne, addressTwo, tokenAmount);
      console.log(quoteResponse)
      showConfirmationModal(addressOne, addressTwo, quoteResponse, tokenAmount, false);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error appropriately
    }
  }

  async function fetchQuote(src, dst, amount) {
    const quoteResponse = await axios.get(
      `/api/1inch/swap/v5.2/${chainId}/quote?src=${src.chains[chain]}&dst=${dst.chains[chain]}&amount=${amount}&fee=1&includeTokensInfo=true&includeGas=true`,
      axiosHeaders
    );
    console.log(quoteResponse.data);
    return quoteResponse.data;
  }
  
  async function showConfirmationModal(src, dst, quoteResponse, amount) {
    Modal.confirm({
      title: "Confirm Swap",
      content: (
        <div style={{color: "white"}}>
          <p>
            Are you sure you want to swap {amount} {chain}  (${((amount) * cryptoDetails.price).toFixed(2)}) {quoteResponse.fromToken.symbol}?
          </p>
          <div style={{margin: "10%"}}>
            <img className= "logo" src={quoteResponse.fromToken.logoURI} alt={quoteResponse.fromToken.name} />
            <span>
              {quoteResponse.fromToken.name} ({quoteResponse.fromToken.symbol})
            </span>
            <div>Exchange from: {amount}</div>
            <div style={{marginLeft: "32px"}}>USD Value: {((amount) * cryptoDetails.price).toFixed(2)}</div>
          </div>
          <div style={{margin: "10%"}}>
            <img className= "logo" src={quoteResponse.toToken.logoURI} alt={quoteResponse.toToken.name} />
            <span>
              {quoteResponse.toToken.name} ({quoteResponse.toToken.symbol})
            </span>
            <div>Exchange to: {quoteResponse.toAmount / 1e+18}</div>
            <div style={{marginLeft: "32px"}}>USD value: {(parseInt(quoteResponse.toAmount) / 1e+18)}</div>
          </div>
          <div>Gas Fee:    {quoteResponse.gas} (${((quoteResponse.gas) * cryptoDetails.price).toFixed(2)})</div>
          <div>Transacion Fee: {(amount* ".01").toFixed(6)} (${(((amount / 1e+18)* ".01")* cryptoDetails.price).toFixed(2)})</div>
          <div>Transacion Total: {(amount * ".01") + (quoteResponse.gas) + (amount)} (${(((amount* ".01")* cryptoDetails.price) + (quoteResponse.gas * cryptoDetails.price) + (amount * cryptoDetails.price)).toFixed(2)})</div>
        </div>
      ),
      onOk: async () => {
        try {
          const allowanceResponse = await axios.get(
            `/api/1inch/swap/v5.2/${chainId}/approve/allowance?tokenAddress=${src.chains[chain]}&walletAddress=${address}`,
            axiosHeaders  // Include the headers for authorization
          );
          const allowance = allowanceResponse.data;
    
          if (allowance.allowance === "0") {
            const approveResponse = await axios.get(
              `/api/1inch/swap/v5.2/${chainId}/approve/transaction?tokenAddress=${src.chains[chain]}&amount=${amount}`,
              axiosHeaders
            );
            console.log(approveResponse);
            setTxDetails(approveResponse.data);
            console.log("Not Approved");
            return;
          }
  
          const txResponse = await executeTransaction(src, dst, quoteResponse, amount);
          const decimals = Number(`1E${tokenTwo.decimals}`);
          setTokenTwoAmount((Number(txResponse.data.toTokenAmount) / decimals).toFixed(2));
          setTxDetails(txResponse.data.tx);
        } catch (error) {
          alert("Sorry something went wrong! " + error);
        }
      },
      onCancel: () => {
        console.log("cancelledSwap");
      },
    });
  }

  async function executeTransaction(src, dst, quoteResponse, amount) {
    const txResponse = await axios.get(
      `/api/1inch/swap/v5.2/${chainId}/swap?src=${src.chains[chain]}&dst=${dst.chains[chain]}&amount=${amount}&from=${address}&slippage=${slippage}&fee=1&referrer=${process.env.REACT_APP_ADMIN_ADDRESS}&receiver=${address}`,
      axiosHeaders
    );
    return txResponse;
  }
  
  useEffect(() => {
    fetchPrices(list[0].uuid, list[1].uuid)
  },[fetchPrices, list])

  useEffect(() => {
    if(txDetails.to && address){
      sendTransaction();
    }
  },[txDetails, address, sendTransaction])

  useEffect(() => {
    messageApi.destroy()
    if(isLoading){
      messageApi.ppen({
        type:'loading',
        content: 'Transaction isPending...',
        duration: 0,
      })
    }
  },[isLoading, messageApi])

  useEffect(() => {
    messageApi.destroy();
    if(isSuccess){
      messageApi.open({
        type: "success",
        content: 'Transaction Successful',
        duration: 1.5,
      })
    } else if(txDetails.to){
      messageApi.open({
        type:'error',
        content: 'Transaction Failed',
        duration: 1.50,
      })
    }
  },[isSuccess, messageApi, txDetails.to])

  useEffect(() => {
    switch (chain) {
      case 'Ethereum':
        setList(tokenList.filter((token) => token.uuid !== ""));
        setChainId("1")
        break;
      case 'Polygon':
        setList(polygonList.filter((token) => token.uuid !== ""));
        setChainId("137")
        break;
      case 'Binance':
        setList(BNBList.filter((token) => token.uuid !== ""));
        setChainId("56")
        break;
      default:
        setList(null); // or setList([]) depending on your preference for default behavior
        break;
    }
  }, [chain]);

  if(isFetching) return <Loader />

  return (
    <div className="swapPage">
    {contextHolder}
    <Modal
      open={isOpen}
      footer={null}
      onCancel={() => setIsOpen(false)}
      title="Select a Token"
    >
      <div className="modalContent">
        {list?.map((e,i) => {
          return (
            <div
              className="tokenChoice"
              key={i}
              onClick={() => modifyToken(i)}
            >
              <img src={e.img} alt={e.ticker} className="tokenLogo" />
              <div className="tokenChoiceNames">
                <div className="tokenName">{e.name}</div>
                <div className="tokenticker">{!e.ticker ? e.symbol : e.ticker}</div>
              </div>
            </div>
          )
        })}
      </div>
    </Modal>
    <div className="selectChain">
      <div className={chain === "Ethereum" ? "selectedChain" : "chain"} onClick={() => handleChain('Ethereum')}>
        Ethereum
      </div>
      <div className={chain === "Binance" ? "selectedChain" : "chain"} onClick={() => handleChain('Binance')}>
        Binance
      </div>
      <div className={chain === "Polygon" ? "selectedChain" : "chain"} onClick={() => handleChain('Polygon')}>
        Polygon
      </div>
    </div>

    <div className= "tradeBox">
      <div className="tradeBoxHeader">
        <h4>Swap</h4>
        <Popover 
          content={settings}
          title="settings"
          trigger="click"
          placement="bottomRight"
        >
          <SettingOutlined className="cog" />
        </Popover>
      </div>
      <div className="inputs">
        <Input placeholder="0" value={tokenOneAmount} onChange={changeAmount}  />
        <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
        <div className="switchButton" onClick={switchTokens}>
          <ArrowDownOutlined className="switchArrow" />
        </div>
        <div className="assetOne" onClick={() => openModal(1)} >
          <img src={tokenOne.img} alt="assetOneLogo" className="assetLogo" />
          {tokenOne.ticker}
          <DownOutlined />
        </div>
        <div className="assetTwo" onClick={() => openModal(2)}>
          <img src={tokenTwo.img} alt="assetOneLogo" className="assetLogo" />
          {tokenTwo.ticker}
          <DownOutlined />
        </div>
      </div>
      <div className="swapButton" disabled={!tokenOneAmount || !isConnect} onClick={fetchDexSwap} >Swap</div>
    </div>
    </div>
  )
}

export default Swap