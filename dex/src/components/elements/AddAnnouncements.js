import React, { useState } from 'react';
import axios from "axios";

function AddAnnouncements(props) {
  const { onClose, cryptoDetails } = props;
  const [announcement, setAnnouncement] = useState({
    exhibit: "",
    date: "",
    stateOfInc: "",
    title: "",
    description: "",
    linkToForm: ""
  })

  const save = async () => {
    try {
      // Create a new object with all the current data and the new announcement
      const updatedCryptoInfo = {
        ...cryptoDetails,
        announcements: [...cryptoDetails.announcements, announcement]
      };
  
      await axios.post(`${process.env.REACT_APP_BACKEND}/api/tokens`, updatedCryptoInfo, {
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
            onChange={(e) => setAnnouncement({ ...announcement, exhibit: e.target.value })}
          />
        </label>
        <label>
          Date:
          <input
            className="date"
            placeholder="date of filing"
            onChange={(e) => setAnnouncement({ ...announcement, date: e.target.value })}
          />
        </label>
      </div>
      <label>
        State of Incorporated:
        <input
          className="stateOfInc"
          placeholder="New York, California.., ect"
          onChange={(e) => setAnnouncement({ ...announcement, stateOfInc: e.target.value })}
        />
      </label>
      <label>
        Title:
        <input
          placeholder="Title of Announcement"
          onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
          className="title"
        />
      </label>
      <div className="textarea-container">
        <textarea
          className="textArea"
          value={announcement.description}
          onChange={(e) => setAnnouncement({ ...announcement, description: e.target.value })}
        />
      </div>
      <label>
        Link to Document:
        <input
          placeholder="Link to SEC filing"
          onChange={(e) => setAnnouncement({ ...announcement, linkToForm: e.target.value })}
          className="linkToForm"
        />
      </label>
      <button onClick={() => save().then(onClose)}>Save Announcement</button>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
  )
}

export default AddAnnouncements;
