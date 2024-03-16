import React, { useState } from 'react';
const style ={
    blah: {
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
    },
}

const TokenDetailsModal = ({ onClose, tokenObject, creatorsAddress, cryptoDetails }) => {
    const ethereumAddress = tokenObject?.chains?.Ethereum;
const avalancheAddress = tokenObject?.chains?.Avalanche;
const fantomAddress = tokenObject?.chains?.Fantom;
const polygonAddress = tokenObject?.chains?.Polygon;
const klaytnAddress = tokenObject?.chains?.Klaytn;
const binanceAddress = tokenObject?.chains?.Binance;
const [isEditing, setIsEditing] = useState(false);

const handleEditClick = () => {
  setIsEditing(!isEditing);
};
console.log(cryptoDetails)
  // Render your modal content here (e.g., token details)
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#101010', // Set your desired background color
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
    <div>
        <input placeholder={cryptoDetails.name} readOnly={!isEditing} />
        <input placeholder={cryptoDetails.symbol} />
        <input placeholder={cryptoDetails.iconUrl} />
        <span>{cryptoDetails.uuid}</span>
    </div>
    <button onClick={handleEditClick}>Edit</button>
      <div style={{display: "flex", alignItems: "center"}}>
        <div style={{borderRadius: ".5em", border: "1px solid #F9F6EE", padding: "2vw", marginRight: '1rem',
      display: 'flex', // Add flex display to align items horizontally
      flexDirection: 'column'}}>
          {ethereumAddress && <p style={style.blah}>Ethereum address: {ethereumAddress}</p>}
          {avalancheAddress && <p style={style.blah}>Avalanche address: {avalancheAddress}</p>}
          {fantomAddress && <p style={style.blah}>Fantom address: {fantomAddress}</p>}
          {polygonAddress && <p style={style.blah}>Polygon address: {polygonAddress}</p>}
          {klaytnAddress && <p style={style.blah}>Klaytn address: {klaytnAddress}</p>}
          {binanceAddress && <p style={style.blah}>Binance address: {binanceAddress}</p>}
        </div>
        <div style={{padding: "2vw"}}>
        <p style={style.blah}>Creators Address: {creatorsAddress}</p>
            <div>
            <input placeholder="New Admin Address" type="text" />
            <button style={{color: "black", backgroundColor: "lime", border: "2px solid black", borderRadius: ".5em"}}>Add Admin</button>
            </div>
        </div>
      </div>
      <div>
        <span>Max Supply: {cryptoDetails.supply.max}</span>
        <span>Circulating Supply: {cryptoDetails.supply.circulating}</span>
      </div>
      <div>
        <span>Website: {cryptoDetails.websiteUrl}</span>
      </div>
      <div>
        <textarea style={{width: "80%", height: "15vh", resize: "vertical"}} placeholder={cryptoDetails.description} />
      </div>
    <button onClick={onClose}>Close</button>
    </div>
  );
};

export default TokenDetailsModal;