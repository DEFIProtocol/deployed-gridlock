import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AllTokens from "../../AllTokens.json";
    //https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=0x495f947276749Ce646f68AC8c248420045cb7b5e&apikey=YourApiKeyToken

function UpdateTokenDescription(props) {
    const { address, chain, symbol } = props;
    const [creatorAddress, setCreatorAddress] = useState();
    const [ hasAccess, setHasAccess ] = useState(false);
    const isAdminAddress = process.env.REACT_APP_ADMIN_ADDRESS === address
    const isCreatorAddress = creatorAddress === address
    const tokenObject= AllTokens.find((token) => token.symbol.toLowerCase() === symbol.toLowerCase());
 // Etherscan API endpoint
 const url = `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${tokenObject.chains[chain]}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
    
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
    >
      UpdateTokenDescription
    </button>
  </div>
  
  );
}

return null;
}


export default UpdateTokenDescription