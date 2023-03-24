import React, { useState, useEffect } from 'react';
import "./order.css";
import tokenList from '../../tokenList';
import { Popover, Radio, message } from "antd";
import { SettingOutlined, } from "@ant-design/icons";
import axios from 'axios';
import { useSendTransaction, useWaitForTransaction } from "wagmi";
import { useEthereum } from ".";

function MarketOrder(props) {
  const { uuid, address, usdPrice, tokenName } = props
  const tokenObject= tokenList.find((token) => token.uuid === uuid);
  const { cryptoDetails } = useEthereum();
  const [messageApi, contextHolder] = message.useMessage()
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState(2.5);
  const ethAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  const ethExRate = usdPrice / cryptoDetails?.price
  const baseLine = "1";
  const [checked, setChecked] = useState("eth")
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

  async function fetchDexSwap(e) {
    if (e=== "buy"){
      var tokenAmount = () => {
        if(checked === "eth") {
          return String(amount *(baseLine.padEnd(18+baseLine.length, '0'))) 
        }else if (checked === "usd"){
          return String((amount/cryptoDetails.price) * (baseLine.padEnd(18+ baseLine.length, '0'))) ;
        } else {
          return  String((amount * ethExRate) * (baseLine.padEnd(18+baseLine.length, "0")))
        };
      }
      const allowance = await axios.get(`https://api.1inch.io/v5.0/approve/allowance?tokenAddress=${ethAddress}&walletAddress=${address}`)
      if(allowance.data.allowance === "0"){
        const approve = await axios.get(`https://api.1inch.io/v5.0/1/approve/transaction?tokenAddress=${ethAddress}`)
        setTxDetails(approve.data)
        console.log("Not Approved")
        return 
      }
      const tx = await axios.get(
        `https://api.1inch.io/v5.0/1/swap?fromTokenAddress=${ethAddress}&toTokenAddress=${tokenObject.address}&amount=${tokenAmount()}&fromAddress=${address}&slippage=${slippage}&fee=1.25`
      )
      let decimals = Number(`1E${tokenObject.decimals}`)
      let tokenTwo = (Number(tx.data.toTokenAmount)/decimals).toFixed(2)
      console.log(tokenTwo);
      setTxDetails(tx.data.tx)
    } else {
      var tokenSellAmount = () => {
        if(checked === "eth") {
          return String(Math.trunc(amount/ethExRate *(baseLine.padEnd(tokenObject.decimals+baseLine.length, '0')))) 
        }else if (checked === "usd"){
          return String(Math.trunc((amount/usdPrice) * (baseLine.padEnd(tokenObject.decimals+ baseLine.length, '0')))) ;
        } else {
          return  String(amount * (baseLine.padEnd(tokenObject.decimals+baseLine.length, "0")))
        };
      }
      const allowance = await axios.get(`https://api.1inch.io/v5.0/approve/allowance?tokenAddress=${tokenObject.address}&walletAddress=${address}`)
      if(allowance.data.allowance === "0"){
        const approve = await axios.get(`https://api.1inch.io/v5.0/1/approve/transaction?tokenAddress=${tokenObject.address}`)
        setTxDetails(approve.data)
        console.log("Not Approved")
        return 
      }
      const tx = await axios.get(
        `https://api.1inch.io/v5.0/1/swap?fromTokenAddress=${tokenObject.address}&toTokenAddress=${ethAddress}&amount=${tokenSellAmount()}&fromAddress=${address}&slippage=${slippage}&fee=1.25`
      )
      let decimals = Number(`1E${tokenObject.decimals}`)
      let tokenTwo = (Number(tx.data.toTokenAmount)/decimals).toFixed(2)
      console.log(tokenTwo);
      setTxDetails(tx.data.tx)
    }
  }

  useEffect(() => {
    if(txDetails.to && address){
      sendTransaction();
    }
  },[txDetails, address, sendTransaction])

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
        <input
          type="checkbox"
          name="Priced in Eth"
          value="eth"
          checked={checked === "eth" ? checked : null}
          onChange={(e) => setChecked(e.target.value)}
          />
        <label htmlFor="ethEx" style={{ color: 'DarkGray' }}>
          {' '}
          Order Priced in ETH
        </label>
        <br />
        <input
          type="checkbox"
          name="Priced in USD"
          value="usd"
          checked={checked === "usd" ? checked : null}
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
      <input type="text" placeholder="Amount" className="input" onChange={(e) => setAmount(e.target.value)} />
      <div className="buttonContainer">
        <button className="buyButton" type="button" placeholder="Buy" value="buy" disabled={!amount || !address } onClick={(e) => fetchDexSwap(e.target.value)} >
          Buy
        </button>
        <button className="sellButton" type="button" placeholder="Sell" value="sell" disabled={!amount || !address } onClick={(e) => fetchDexSwap(e.target.value)} >
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