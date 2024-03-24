import React, { useState } from 'react';
import "./order.css";
import axios from 'axios';

const TokenDetailsModal = ({ onClose, tokenObject, creatorsAddress, cryptoDetails }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [ cryptoInfo, setCryptoInfo ] = useState(cryptoDetails);
  const [ admins, setAdmins ] = useState(cryptoDetails.adminAddresses);
  const [newAdminAddress, setNewAdminAddress] = useState("");
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
      type: cryptoInfo.tokenType,
      secRegistered: cryptoInfo.secRegistered,
      votingEnabled: cryptoInfo.votingEnabled
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error adding/updating token:', error);
  };
};
console.log(cryptoInfo)
  // Render your modal content here (e.g., token details)
  return (
  <div className="modalExpandContainer">
    <div className="modal-container">
      <label>
        Token Type:
        <input
          className="inputBox"
          placeholder={!cryptoInfo.tokenType ? "Commodity, Company, Utility... etc." : ""}
          value={!cryptoInfo.tokenType ? "" : cryptoInfo.tokenTyp}
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
        <input
              placeholder="New Admin Address"
              type="text"
              className="inputBox"
              value={newAdminAddress}
              onChange={(e) => setNewAdminAddress(e.target.value)}
            />
            <button
              className="button"
              onClick={() => {
                setAdmins([...admins, newAdminAddress]);
                setNewAdminAddress(""); // Clear the input field after adding
              }}
            >
              Add Admin
            </button>
            {!admins ? null :
            <div>
              {admins.map((adminAdd, key) => (
                <div key={key}>
                  {adminAdd}
                </div>
              ))}
            </div>
            }
        </div>
      </div>
      <div className="supply-container">
        <label>
          Max Supply: <input
            value={!cryptoInfo.maxSupply ? "No Max Supply" : cryptoInfo.maxSupply}
            onChange={(e) => {
              setCryptoInfo({...cryptoInfo, maxSupply: e.target.checked});
            }}
            className="inputBox"
          />
        </label>
        <label>
          Circulating Supply: <input
            value={cryptoInfo.circulatingSupply}
            onChange={(e) => {
              setCryptoInfo({...cryptoInfo, circulatingSupply: e.target.checked});
            }}
            className="inputBox"
          />
        </label>
        <div className="cl-toggle-switch"></div>
      </div>  
      <div className="supply-container">
        <label>
          Website: <input className="inputBox" value={cryptoInfo.websiteUrl} onChange={(e) => {
            setCryptoInfo({...cryptoInfo, website: e.target.checked});
          }} />
        </label>
        <label>
          SEC Registration:
          <select
            value={cryptoInfo.secRegistered || "No"}
            className="inputBox"
            onChange={(e) => setCryptoInfo({ ...cryptoInfo, secRegistered: e.target.value })}
          >
            <option value="No">No</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
          </select>
        </label>
        <label className="cl-switch">
          Enable Voting:
          <input
            type="checkbox"
            checked={cryptoInfo.votingEnabled}
            onChange={(e) => setCryptoInfo({ ...cryptoInfo, votingEnabled: e.target.checked })}
          />
          <span></span>
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
        <button className="button" onClick={() => save().then(onClose)}>Save to gridLock server</button>
        <button className="button" onClick={() => alert("Smart Contract not setup yet!")}>Save to Blockchain</button>
        <button className="button" onClick={onClose}>Close</button>
      </div>
    </div>
    </div>
</div>


  );
};

export default TokenDetailsModal;