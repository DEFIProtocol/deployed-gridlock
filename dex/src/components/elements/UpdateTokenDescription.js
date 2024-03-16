import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AllTokens from "../../AllTokens.json";
import { TokenBlockChainDesc } from "./";
    //https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=0x495f947276749Ce646f68AC8c248420045cb7b5e&apikey=YourApiKeyToken

function UpdateTokenDescription(props) {
    const { address, chain, cryptoDetails } = props;
    const [showModal, setShowModal] = useState(false);
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
         const response = await axios.get(url);
         const responseDeconstruct = response.data.result.pop();
         setCreatorAddress(responseDeconstruct.contractCreator);
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
  }, [url, isAdminAddress, isCreatorAddress]);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };
 
 if (hasAccess) {
  return (
    <div
    style={{
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
        fontSize: '2em',
        borderRadius: '.5em',
        border: '3px solid black',
        marginBottom: '3vh',
      }}
      onClick={handleOpenModal}
    >
      UpdateTokenDescription
    </button>
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