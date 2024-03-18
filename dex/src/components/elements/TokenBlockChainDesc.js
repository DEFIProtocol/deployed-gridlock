import React, { useState } from 'react';
import "./order.css";
import axios from 'axios';

const TokenDetailsModal = ({ onClose, tokenObject, creatorsAddress, cryptoDetails }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [ cryptoInfo, setCryptoInfo ] = useState(cryptoDetails);
  const ethereumAddress = tokenObject?.chains?.Ethereum;
  const avalancheAddress = tokenObject?.chains?.Avalanche;
  const fantomAddress = tokenObject?.chains?.Fantom;
  const polygonAddress = tokenObject?.chains?.Polygon;
  const klaytnAddress = tokenObject?.chains?.Klaytn;
  const binanceAddress = tokenObject?.chains?.Binance;

const handleEditClick = () => {
  setIsEditing(!isEditing);
};
const save = async () => {
  try {
    await axios.post(`${process.env.REACT_APP_BACKEND}/api/tokens`, {
      uuid: cryptoInfo.uuid,
      chains: cryptoInfo.chains,
      creatorAddress: cryptoInfo.creatorAddress,
      Announcements: cryptoInfo.Announcements,
      adminAddresses: cryptoInfo.adminAddress,
      description: cryptoInfo.description,
      maxSupply: cryptoInfo.maxSupply,
      circulatingSupply: cryptoInfo.circulatingSupply,
      website: cryptoInfo.website,
      name: cryptoInfo.name,
      symbol: cryptoInfo.symbol,
      iconUrl: cryptoInfo.iconUrl,
      type: cryptoInfo.type,
      secRegistered: cryptoInfo.secRegistered,
      votingEnabled: cryptoInfo.votingEnabled
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error adding/updating token:', error);
  }
};

  // Render your modal content here (e.g., token details)
  return (
    <div className="modalExpandContainer">
    <div className="modal-container">
      <label>
        Token Type:
        <input
          className="inputBox"
          placeholder={!cryptoInfo.tokenType ? "Commodity, Company, Utility... etc." : ""}
          value={cryptoInfo.tokenType}
          onChange={(e) => setCryptoInfo({ ...cryptoInfo, tokenType: e.target.value })}
        />
      </label>
  <div className="modal-header">
    <label>
      Name:
      <input
        value={cryptoInfo.name}
        onChange={(e) =>
          setCryptoInfo({ ...cryptoInfo, name: e.target.value })
        }
        readOnly={!isEditing}
        className="inputBox"
      />
    </label>
    <label>
      Symbol:
      <input
        value={cryptoInfo.symbol}
        onChange={(e) =>
          setCryptoInfo({ ...cryptoInfo, symbol: e.target.value })
        }
        readOnly={!isEditing}
        className="inputBox"
      />
    </label>
    <label>
      Icon URL:
      <input
        value={cryptoInfo.iconUrl}
        onChange={(e) =>
          setCryptoInfo({ ...cryptoInfo, iconUrl: e.target.value })
        }
        readOnly={!isEditing}
        className="inputBox"
      />
    </label>
    <label className="uuid">UUID:<span>{cryptoInfo.uuid}</span></label>
    <button onClick={handleEditClick} className="button">Edit</button>
  </div>
  <div className="modal-body">
    <div className="address-container">
      {ethereumAddress && <p className="contractAddresses">Ethereum address: {ethereumAddress}</p>}
      {avalancheAddress && <p className="contractAddresses">Avalanche address: {avalancheAddress}</p>}
      {fantomAddress && <p className="contractAddresses">Fantom address: {fantomAddress}</p>}
      {polygonAddress && <p className="contractAddresses">Polygon address: {polygonAddress}</p>}
      {klaytnAddress && <p className="contractAddresses">Klaytn address: {klaytnAddress}</p>}
      {binanceAddress && <p className="contractAddresses">Binance address: {binanceAddress}</p>}
    </div>
    <div className="admin-container">
      <p className="contractAddresses">Creators Address: {creatorsAddress}</p>
      <div>
        <input placeholder="New Admin Address" type="text" className="inputBox"/>
        <button className="button">Add Admin</button>
      </div>
    </div>
  </div>
  <div className="supply-container">
    <label>
      Max Supply: <input
        value={cryptoInfo.supply.max}
        onChange={(e) => {
          const updatedCryptoInfo = { ...cryptoInfo };
          updatedCryptoInfo.supply.max = e.target.value;
          setCryptoInfo(updatedCryptoInfo);
        }}
        className="inputBox"
        />
    </label>
    <label>
      Circulating Supply: <input
        value={cryptoInfo.supply.circulating}
        onChange={(e) => {
          const updatedCryptoInfo = { ...cryptoInfo };
          updatedCryptoInfo.supply.circulating = e.target.value;
          setCryptoInfo(updatedCryptoInfo);
        }}
        className="inputBox"
        />
    </label>
  </div>
  <div className="textarea-container">
    <textarea
      className="textArea"
      value={cryptoInfo.description}
      onChange={(e) =>
        setCryptoInfo({ ...cryptoInfo, description: e.target.value })
      }
      />
  </div>
  <div className="button-container">
    <button className="button" onClick={() => save()}>Save to gridLock server</button>
    <button className="button" onClick={() => alert("Smart Contract not setup yet!")}>Save to Blockchain</button>
    <button className="button" onClick={onClose}>Close</button>
  </div>
</div>
</div>

  );
};

export default TokenDetailsModal;