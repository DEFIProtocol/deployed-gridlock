import React, { useState, useEffect } from 'react';
import "./order.css";
import tokenList from '../../tokenList';
import { Popover, Radio, message, Modal } from "antd";
import { SettingOutlined, } from "@ant-design/icons";
import axios from 'axios';
import { useSendTransaction, useWaitForTransaction } from "wagmi";
import { useEthereum } from ".";

function MarketOrder(props) {
  const { uuid, address, usdPrice, tokenName } = props
  const tokenObject= tokenList.find((token) => token.uuid === uuid);
  const { cryptoDetails } = useEthereum();
  const [messageApi, contextHolder] = message.useMessage()
  const [amount, setAmount] = useState(null);
  const [slippage, setSlippage] = useState(2.5);
  const [txDetailsSent, setTxDetailsSent] = useState(false);
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
  
  const axiosHeaders = {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_1INCH_API_KEY}`
    }
  };
  
  async function fetchDexBuy() {
    const tokenAmount = () => {
      if (checked === "eth") {
        return String(amount * (baseLine.padEnd(18 + baseLine.length, '0')));
      } else if (checked === "usd") {
        return String((amount / cryptoDetails.price) * (baseLine.padEnd(18 + baseLine.length, '0')));
      } else {
        return String((amount * ethExRate) * (baseLine.padEnd(18 + baseLine.length, "0")));
      }
    };
  
    try {
      // Check allowance and fetch quote
      const allowanceResponse = await axios.get(
        `/api/1inch/swap/v5.2/1/approve/allowance?tokenAddress=${ethAddress}&walletAddress=${address}`,
        axiosHeaders
      );
      const allowance = allowanceResponse.data;
  
      if (allowance.allowance === "0") {
        const approveResponse = await axios.get(
          `/api/1inch/swap/v5.2/1/approve/transaction?tokenAddress=${ethAddress}&amount=${tokenAmount()}`,
          axiosHeaders
        );
        setTxDetails(approveResponse.data);
        console.log("Not Approved");
        return;
      }
  
      // Fetch quote for buy
      const quoteResponse = await axios.get(
        `/api/1inch/swap/v5.2/1/quote?src=${ethAddress}&dst=${tokenObject.address}&amount=${tokenAmount()}&fee=1.25&includeTokensInfo=true&includeGas=true`,
        axiosHeaders
      );
  
      // Show a confirmation modal
      Modal.confirm({
        title: 'Confirm Buy',
        content: `Are you sure you want to buy ${tokenAmount()} ${tokenObject.symbol}?`, // Customize the confirmation message
        onOk: async () => {
          // If confirmed, proceed with the swap
          const txResponse = await axios.get(
            `/api/1inch/swap/v5.2/1/swap?src=${ethAddress}&dst=${tokenObject.address}&amount=${tokenAmount()}&from=${address}&slippage=${slippage}&fee=1.25&referrer=${process.env.REACT_APP_ADMIN_ADDRESS}&receiver=${address}`,
            axiosHeaders
          );
  
          let decimals = Number(`1E${tokenObject.decimals}`);
          let tokenTwo = (Number(txResponse.data.toTokenAmount) / decimals).toFixed(2);
          console.log(tokenTwo);
          return setTxDetails(txResponse.data.tx);
        },
        onCancel: () => {
          console.log("Buy Cancelled"); // Handle cancel action
        },
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error appropriately
    }
  }
  
  
  async function fetchDexSell() {
    const tokenSellAmount = () => {
      if (checked === "eth") {
        return String(Math.trunc(amount / ethExRate * (baseLine.padEnd(tokenObject.decimals + baseLine.length, '0'))));
      } else if (checked === "usd") {
        return String(Math.trunc((amount / usdPrice) * (baseLine.padEnd(tokenObject.decimals + baseLine.length, '0'))));
      } else {
        return String(amount * (baseLine.padEnd(tokenObject.decimals + baseLine.length, "0")));
      }
    };
  
    try {
      // Check allowance and fetch quote
      const allowanceResponse = await axios.get(
        `/api/1inch/swap/v5.2/1/approve/allowance?tokenAddress=${tokenObject.address}&walletAddress=${address}`,
        axiosHeaders
      );
      const allowance = allowanceResponse.data;
  
      if (allowance.allowance === "0") {
        const approveResponse = await axios.get(
          `/api/1inch/swap/v5.2/1/approve/transaction?tokenAddress=${tokenObject.address}&amount=${tokenSellAmount()}`,
          axiosHeaders
        );
        setTxDetails(approveResponse.data);
        console.log("Not Approved");
        return;
      }
  
      // Fetch quote for sell
      const quoteResponse = await axios.get(
        `/api/1inch/swap/v5.2/1/quote?src=${tokenObject.address}&dst=${ethAddress}&amount=${tokenSellAmount()}&fee=1.25&includeTokensInfo=true&includeGas=true`,
        axiosHeaders
      );
      
      console.log(quoteResponse);
  
      // Show a confirmation modal
      Modal.confirm({
        title: 'Confirm Sell',
        content: `Are you sure you want to sell ${tokenSellAmount()} ${tokenObject.symbol}?`, // Customize the confirmation message
        onOk: async () => {
          // If confirmed, proceed with the swap
          const txResponse = await axios.get(
            `/api/1inch/swap/v5.2/1/swap?src=${tokenObject.address}&dst=${ethAddress}&amount=${tokenSellAmount()}&from=${address}&slippage=${slippage}&fee=1.25&referrer=${process.env.REACT_APP_ADMIN_ADDRESS}&receiver=${address}`,
            axiosHeaders
          );
  
          let decimals = Number(`1E${tokenObject.decimals}`);
          let tokenTwo = (Number(txResponse.data.toTokenAmount) / decimals).toFixed(2);
          console.log(tokenTwo);
          return setTxDetails(txResponse.data.tx);
        },
        onCancel: () => {
          console.log("Sell Cancelled"); // Handle cancel action
        },
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error appropriately
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
        <input
          type="checkbox"
          name="Priced in Eth"
          value="eth"
          checked={checked === "eth" ? checked : !checked}
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