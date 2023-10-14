import React, {useState, useEffect} from 'react';
import Eth from "../eth.svg";
import {Link} from "react-router-dom";
import { MenuOutlined } from '@ant-design/icons';


function Header(props) {
  const { address, connect, disconnect, isConnect } = props;
  const [activeMenu, setActiveMenu ] = useState(true);
  const [ isOpen, setIsOpen] = useState(false);
  const [screenSize, setScreenSize] = useState(null);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize()
  },[])

  useEffect (() => {
    if(screenSize < 760) {
        setActiveMenu(false);
    } else {
        setActiveMenu(true);
    }
  }, [screenSize])


  return (
    <header className="header-page">
      <div className="leftH">
        {activeMenu === false  ? 
        <MenuOutlined className="acitve-menu" onClick = {isOpen === false ? () => setIsOpen(true) : () => setIsOpen(false)}></MenuOutlined>
        : null
        }
        <Link to ="/" className="link">
          <div className="gridLock">
            <div className="grid">grid</div>
            <div className="lock">Lock</div>
          </div>
        </Link>
        {!activeMenu && isOpen ? (
        <div className="header-items-container">
          {!isConnect ? null : 
          <Link to="/account" className="link">
            <div className="headerItem">Account</div>
          </Link>
          }
          <Link to="/cryptocurrencies" className="link">
            <div className="headerItem">Coins</div>
          </Link>
          <Link to="/tokens" className="link">
            <div className="headerItem">Tokens</div>
          </Link>
          <Link to="/swap" className="link">
            <div className="headerItem">Swap</div>
          </Link>
      </div>
        ) : activeMenu ?
        <div className="header-items-container2">
          {!isConnect ? null : 
          <Link to="/account" className="link">
            <div className="headerItem">Account</div>
          </Link>
          }
          <Link to="/cryptocurrencies" className="link">
            <div className="headerItem">Coins</div>
          </Link>
          <Link to="/tokens" className="link">
            <div className="headerItem">Tokens</div>
          </Link>
          <Link to="/swap" className="link">
            <div className="headerItem">Swap</div>
          </Link>
          </div> : null}
        </div>
        <div className="rightH">
        <div className="headerItem">
          <img src={Eth} alt="eth" className ="eth" />
          {!activeMenu ? "Eth" : "Ethereum"}
        </div>
        <div className="connectButton" onClick={!isConnect ? connect : disconnect}>
          {address ? (address.slice(0,5) +"..."+address.slice(38)) : "Connect"}
        </div>
      </div>
    </header>
  )
}

export default Header