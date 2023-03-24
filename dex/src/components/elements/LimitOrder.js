import React, { useState } from 'react';
import "./order.css";

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
      <div className="checkboxContainer">
        <div className="checkboxes" >
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
      </div>
      <input type="number" placeholder="Price" className="input" />
      <input type="number" placeholder="Amount" className="input" />
      <div className="buttonContainer">
        <button className="buyButton" type="button" placeholder="Buy">
          Buy
        </button>
        <button className="sellButton" type="button" placeholder="Sell">
          Sell
        </button>
      </div>
    </div>
  );
}

export default LimitOrder;