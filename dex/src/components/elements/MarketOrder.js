import React, { useState } from 'react';

const style = {
  checkbox: {
    display: 'flex',
    accentColor: 'limegreen',
  },
  checkboxContainer: {
    margin: '0px auto',
    padding: "5%",
  },
  input: {
    width: '80%',
    margin: "0px auto",
    backgroundColor: "#202020",
    color: "#909090",
    textAlign: "center"
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    margin: "0px auto",
    padding: "5%",
    width: "100%"
  },
  buyButton: {
    backgroundColor: 'green',
    color: 'black',
    height: '40px',
    width: '80px',
    border: 'solid 3px black',
    borderRadius: '0.5rem',
  },
  sellButton: {
    backgroundColor: 'red',
    color: 'black',
    height: '40px',
    width: '80px',
    border: 'solid 3px black',
    borderRadius: '0.5rem',
  },
};

function MarketOrder() {
  const [checked, setChecked] = useState({
    ethEx: false,
    usdEx: true,
  });
  const [amount, setAmount] = useState();
  
  const quote = () => {
    console.log(amount)
  }

  const handleCheck = (e) => {
    if (e === 'ethEx') {
      setChecked({
        ethEx: true,
        usdEx: false,
      });
    } else {
      setChecked({
        ethEx: false,
        usdEx: true,
      });
    }
  };

  console.log(quote());

  return (
    <>
      <div style={style.checkboxContainer}>
        <input
          type="checkbox"
          name="Priced in USD"
          value="usdEx"
          checked={checked.usdEx}
          onChange={(e) => handleCheck(e.target.value)}
        />
        <label htmlFor="usdEx" style={{ color: 'DarkGray' }}>
          {' '}
          Order Priced in USD
        </label>
        <br />
        <input
          type="checkbox"
          name="Priced in Eth"
          value="ethEx"
          checked={checked.ethEx}
          onChange={(e) => handleCheck(e.target.value)}
        />
        <label htmlFor="ethEx" style={{ color: 'DarkGray' }}>
          {' '}
          Order Priced in ETH
        </label>
      </div>
      <input type="text" placeholder="Amount" style={style.input} onChange={(e) => setAmount(e)} />
      <div style={style.buttonContainer}>
        <button style={style.buyButton} type="button" placeholder="Buy" onClick={() => quote}>
          Buy
        </button>
        <button style={style.sellButton} type="button" placeholder="Sell" onClick={() => quote}>
          Sell
        </button>
      </div>
    </>
  );
}

export default MarketOrder;