import React, { useState, useEffect, useCallback } from 'react'
import axios from "axios";
import { Input, Popover, Radio, Modal, message } from "antd";
import { ArrowDownOutlined, DownOutlined, SettingOutlined, } from "@ant-design/icons";
import tokenList from "../tokenList.json";
import { useSendTransaction, useWaitForTransaction } from "wagmi";
import { useGetCryptosQuery } from './services/cryptoApi';
import { Loader } from "./elements";

function Swap(props) {
  const {address, isConnect } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [slippage, setSlippage] = useState(2.5);
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const {data: tokenData, isFetching } = useGetCryptosQuery(1200);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
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
      setTokenOne(tokenList[i])
      fetchPrices(tokenList[i].uuid, tokenTwo.uuid)
    } else {
      setTokenTwo(tokenList[i])
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
    const baseLine = "1";
    const tokenAmount = Math.trunc(tokenOneAmount * (baseLine.padEnd(tokenOne.decimals, '0')))
    try {
      const allowanceResponse = await axios.get(
        `https://api.1inch.io/v5.0/approve/allowance?tokenAddress=${tokenOne.address}&walletAddress=${address}`,
        axiosHeaders  // Include the headers for authorization
      );
      if (allowanceResponse.data.allowance === "0") {
        const approveResponse = await axios.get(
          `https://api.1inch.io/v5.0/1/approve/transaction?tokenAddress=${tokenOne.address}`,
          axiosHeaders  // Include the headers for authorization
        );
        setTxDetails(approveResponse.data);
        console.log("Not Approved");
        return;
      }
      const txResponse = await axios.get(
        `https://api.1inch.io/v5.0/1/swap?fromTokenAddress=${tokenOne.address}&toTokenAddress=${tokenTwo.address}&amount=${tokenAmount}&fromAddress=${address}&slippage=${slippage}`,
        axiosHeaders  // Include the headers for authorization
      );
      const decimals = Number(`1E${tokenTwo.decimals}`);
      setTokenTwoAmount((Number(txResponse.data.toTokenAmount) / decimals).toFixed(2));
      setTxDetails(txResponse.data.tx);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  useEffect(() => {
    fetchPrices(tokenList[0].uuid, tokenList[1].uuid)
  },[fetchPrices])

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

  if(isFetching) return <Loader />

  return (
    <>
    {contextHolder}
    <Modal
      open={isOpen}
      footer={null}
      onCancel={() => setIsOpen(false)}
      title="Select a Token"
    >
      <div className="modalContent">
        {tokenList?.map((e,i) => {
          return (
            <div
              className="tokenChoice"
              key={i}
              onClick={() => modifyToken(i)}
            >
              <img src={e.img} alt={e.ticker} className="tokenLogo" />
              <div className="tokenChoiceNames">
                <div className="tokenName">{e.name}</div>
                <div className="tokenticker">{e.ticker}</div>
              </div>
            </div>
          )
        })}
      </div>
    </Modal>
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
    </>
  )
}

export default Swap