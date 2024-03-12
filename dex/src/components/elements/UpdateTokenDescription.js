import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AllTokens from "../../AllTokens.json";
    //https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=0x495f947276749Ce646f68AC8c248420045cb7b5e&apikey=YourApiKeyToken

function UpdateTokenDescription(props) {
    const { address, chain, symbol } = props;
    const [creatorAddress, setCreatorAddress] = useState();
    const [ loading, setLoading ] = useState(false);
    const isAdminAddress = process.env.REACT_APP_ADMIN_ADDRESS !== address
    const isCreatorAddress = creatorAddress !== address
    const tokenObject= AllTokens.find((token) => token.symbol.toLowerCase() === symbol.toLowerCase());
 // Etherscan API endpoint
 const url = `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${tokenObject.chains[chain]}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
  console.log(isAdminAddress)
  console.log(isCreatorAddress)
  console.log(loading)

 useEffect(() => {
   const fetchData = async () => {
     try {
        try {
            const response = await axios.get(url);
            const responseDeconstruct = response.data.result.pop();
            setCreatorAddress(responseDeconstruct.contractCreator);
            setLoading(true);
          } catch (error) {
            console.error('Error fetching transactions:', error);
          }
     } catch (error) {
       // Handle any errors
       console.error('Error fetching transactions:', error);
     }
   };

   fetchData();
 }, [url]);

 if (!loading && (isAdminAddress !== address || isCreatorAddress !== address)) {
  console.log()
  return null;
}
  return (
    <div>UpdateTokenDescription</div>
  )
}

export default UpdateTokenDescription