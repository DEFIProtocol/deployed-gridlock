import React, { useState } from 'react';

const style = {
  checkbox: {
    display: 'flex',
    accentColor: 'limegreen',
  },
  checkboxContainer: {
    margin: '3%',
  },
  input: {
    margin: '2%',
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    textAlign: 'center',
  },
  buyButton: {
    backgroundColor: 'green',
    color: 'black',
    margin: '10px',
    height: '40px',
    width: '80px',
    border: 'solid 3px black',
    borderRadius: '0.5rem',
  },
  sellButton: {
    backgroundColor: 'red',
    color: 'black',
    margin: '10px',
    height: '40px',
    width: '80px',
    border: 'solid 3px black',
    borderRadius: '0.5rem',
  },
};

function LimitOrder() {
  const [checked, setChecked] = useState({
    ethEx: false,
    usdEx: true,
  });

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

  return (
    <div>
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
      <input type="number" placeholder="Price" style={style.input} />
      <input type="number" placeholder="Amount" style={style.input} />
      <div style={style.buttonContainer}>
        <button style={style.buyButton} type="button" placeholder="Buy">
          Buy
        </button>
        <button style={style.sellButton} type="button" placeholder="Sell">
          Sell
        </button>
      </div>
    </div>
  );
}

export default LimitOrder;