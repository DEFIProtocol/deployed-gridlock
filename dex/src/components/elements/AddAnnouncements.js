import React, { useState } from 'react';
import axios from "axios";


function AddAnnouncements(props) {
  const [ cryptoInfo, setCryptoInfo ] = useState(cryptoDetails);
  const { onClose, cryptoDetails } = props;
  const [ announcement, setAnnouncement] = useState({
    exhibit: "",
    date: "",
    stateOfInc: "",
    title: "",
    description: "",
    linkToForm: ""
  })

  const save = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND}/api/tokens`, {
        uuid: cryptoInfo.uuid,
        chains: cryptoInfo.chains,
        creatorAddress: cryptoInfo.creatorAddress,
        Announcements: cryptoInfo.Announcements,
        adminAddresses: cryptoInfo.adminAddresses,
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
  return (
    <div className="modalExpandContainer">
    <div className="modal-container">
        <div className="modal-header">
      <label>
        Exhibit:
        <input
          className="inputBox"
          placeholder="8k, 10k.., ect"
          onChange={(e) => setCryptoInfo({ ...cryptoInfo, exhibit: e.target.value })}
        />
      </label>
      <label>
        Date:
        <input
          className="date"
          placeHolder="date of filing"
          onChange={(e) => setCryptoInfo({ ... cryptoInfo, date: e.target.value })}
          />
      </label>
      </div>
      <label>
        State of Incorporated:
        <input
          className="stateOfInc"
          placeHolder="New York, California.., ect"
          onChange={(e) => setCryptoInfo({ ... cryptoInfo, stateOfInc: e.target.value })}
        />
      </label>
    <label>
      Title:
      <input
        placeHolder="Title of Announcement"
        onChange={(e) =>
          setCryptoInfo({ ...cryptoInfo, title: e.target.value })
        }
        className="title"
      />
    </label>
    <div className="textarea-container">
    <textarea
      className="textArea"
      value={cryptoInfo.description}
      onChange={(e) =>
        setCryptoInfo({ ...cryptoInfo, description: e.target.value })
      }
      />
  </div>
  <label>
      Link to Document:
      <input
        placeHolder="Link to SEC filing"
        onChange={(e) =>
          setCryptoInfo({ ...cryptoInfo, linkToForm: e.target.value })
        }
        className="linkToForm"
      />
    </label>
    <button onClick={() => save().then(onClose)}>Save Announcement</button>
      <button onClick={onClose}>Close</button>
    </div>
    </div>
  )
}

export default AddAnnouncements