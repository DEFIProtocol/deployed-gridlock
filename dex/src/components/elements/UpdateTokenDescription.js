import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AllTokens from "../../AllTokens.json";
import { TokenBlockChainDesc, AddAnnouncements } from "./";
    //https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=0x495f947276749Ce646f68AC8c248420045cb7b5e&apikey=YourApiKeyToken

function UpdateTokenDescription(props) {
    const { address, chain, cryptoDetails } = props;
    const [showModal, setShowModal] = useState(false);
    const [showAddAnnouncementModal, setShowAddAnnouncementModal] = useState(false);
    const [creatorAddress, setCreatorAddress] = useState();
    const [ hasAccess, setHasAccess ] = useState(false);
    const isAdminAddress = process.env.REACT_APP_ADMIN_ADDRESS === address
    const isCreatorAddress = creatorAddress === address
    const tokenObject= AllTokens.find((token) => token.symbol.toLowerCase() === cryptoDetails.symbol.toLowerCase());
 // Etherscan API endpoint
 const url = `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${tokenObject.chains[chain]}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
    console.log(tokenObject)
 useEffect(() => {
   const fetchData = async () => {
     try {
       try {
        if(!cryptoDetails.creatorAddress){
          const response = await axios.get(url);
          const responseDeconstruct = response.data.result.pop();
          setCreatorAddress(responseDeconstruct.contractCreator);
        } else {
          setCreatorAddress(cryptoDetails.creatorAddress)
        }
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      } catch (error) {
        // Handle any errors
        console.error('Error fetching transactions:', error);
      }
    };
    
    fetchData();
    setHasAccess(isAdminAddress === true || isCreatorAddress === true)
  }, [url, isAdminAddress, isCreatorAddress, cryptoDetails]);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleOpenAddAnnouncementModal = () => {
    setShowAddAnnouncementModal(true);
  };

  const handleCloseAddAnnouncementModal = () => {
    setShowAddAnnouncementModal(false);
  };
 
 if (hasAccess) {
  return (
    <div
    style={{
      display: 'flex',
      justifyContent: 'center', // Center the buttons horizontally
      position: 'sticky',
      top: '10vh',
      marginLeft: "57vw",
      background: 'transparent', // Transparent background for the div
      zIndex: 100,
    }}
>
<button
  style={{
    background: 'lime', // Button background color
    fontSize: '1.5em',
    lineHeight: '1',
    borderRadius: '.5em',
    border: '3px solid black',
    marginBottom: '3vh',
    marginRight: '1rem', // Add margin-right for spacing between buttons
  }}
  onClick={handleOpenModal}
>
  Update Token
</button>
<button
  style={{
    background: 'orange', // Button background color
    fontSize: '1.5em',
    lineHeight: '1',
    borderRadius: '.5em',
    border: '3px solid black',
    marginBottom: '3vh',
    marginRight: '1rem', // Add margin-right for spacing between buttons
  }}
  onClick={handleOpenAddAnnouncementModal}
>
  Add Announcement
</button>
<button
  style={{
    background: 'blue', // Button background color
    fontSize: '1.5em',
    lineHeight: '1',
    borderRadius: '.5em',
    border: '3px solid black',
    marginBottom: '3vh',
  }}
 /* onClick={handleOpenSECModal} */
>
  Register with SEC
</button>
  {showAddAnnouncementModal && (
        <AddAnnouncements
          onClose={handleCloseAddAnnouncementModal} 
          cryptoDetails={cryptoDetails} 
          tokenObject={tokenObject}
          creatorsAddress={creatorAddress}
        />
  )}

  {showModal && (
      <TokenBlockChainDesc
        cryptoDetails={cryptoDetails} 
        tokenObject={tokenObject}
        onClose={handleCloseModal}
        creatorsAddress = {creatorAddress}
      />
    )}
</div>

  
  );
}

return null;
}


export default UpdateTokenDescription

//{showAnnouncementModal && (
     // { Render your Announcement modal component here }
   //   )}
 //     {showSECModal && (
    //      {der your SEC modal component here }
   //     )} 