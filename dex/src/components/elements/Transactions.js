import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AllTokens from '../../AllTokens';
import { Loader } from ".";
import "./order.css";

// Create interoperability between etherscan poly scan bscscan

function Tooltip({ text }) {
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const copyText = () => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  const handleMouseEnter = (event) => {
    setShowModal(true);
    setModalPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setShowModal(false);
  };
  const truncateString = (str, startLength, endLength) => {
    if (str.length <= startLength + endLength) {
      return str; // No need to truncate
    }
    const start = str.slice(0, startLength);
    const end = str.slice(-endLength);
    return `${start}...${end}`;
  };

  return (
    <div
      className="tooltip"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showModal && (
        <div className="modal" style={{ top: modalPosition.y, left: modalPosition.x }}>
          <span className="tooltiptext">{text}</span>
          <span className="copy-icon" onClick={copyText}>&#128203;</span>
        </div>
      )}
      <span>{truncateString(text, 7, 5)}</span>
    </div>
  );
}


function Transactions(props) {
    const { chain, symbol } = props;
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [creatorsAddress, setCreatorsAddress] = useState();
    const rowsPerPage = 10;

    const totalPages = Math.ceil(transactions.length / rowsPerPage);

    console.log("remove this" + creatorsAddress)

    const handlePageInputChange = (event) => {
      const inputPage = parseInt(event.target.value, 10);
      if (!isNaN(inputPage) && inputPage >= 1 && inputPage <= totalPages) {
        setCurrentPage(inputPage);
      }
    };
    
    // Calculate the start and end page numbers for display
    const pageRange = 3; // Number of pages to show around the current page
    const startPage = Math.max(1, currentPage - pageRange);
    const endPage = Math.min(totalPages, currentPage + pageRange);

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentPageData = transactions.slice(startIndex, endIndex);

    const tokenObject= AllTokens.find((token) => token.symbol.toLowerCase() === symbol.toLowerCase());
 // Etherscan API endpoint
 const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${tokenObject.chains[chain]}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;

 const truncateString = (str, startLength, endLength) => {
  if (str.length <= startLength + endLength) {
    return str; // No need to truncate
  }
  const start = str.slice(0, startLength);
  const end = str.slice(-endLength);
  return `${start}...${end}`;
};

 useEffect(() => {
   const fetchData = async () => {
     try {
        try {
            const response = await axios.get(url);
            setCreatorsAddress(response.data.result[0].from)
            const reversedTransactions = response.data.result.reverse(); // Reverse the array
            setTransactions(reversedTransactions);
            setLoading(false);
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

 const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  if(loading) return <Loader />
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th style={{color: "lime"}}>Block Number</th>
            <th>Timestamp</th>
            <th>Hash</th>
            <th>From</th>
            <th>To</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.blockNumber}</td>
              <td>{formatDate(transaction.timeStamp)}</td>
              <td>
                <Tooltip text={transaction.hash}>
                  {truncateString(transaction.hash, 7, 5)}
                </Tooltip>
              </td>
              <td>
                <Tooltip text={transaction.from}>
                  {truncateString(transaction.from, 7, 5)}
                </Tooltip>
              </td>
              <td>
                <Tooltip text={transaction.to}>
                  {truncateString(transaction.to, 7, 5)}
                </Tooltip>
              </td>
              <td>{transaction.value}</td>
            </tr>
          ))}
        </tbody>
    </table>
<div className="transactionPageButtons">
  <button
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
    className="pageButtons"
  >
    Previous
  </button>
  <span className="pageNumbers">
    {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
      <span key={page}>
        {page === currentPage ? (
          <input
          type="number"
          value={currentPage}
          onChange={handlePageInputChange}
          min="1"
          max={totalPages}
          className="pageInput"
        /> // Highlight the current page
        ) : (
          <span
            onClick={() => setCurrentPage(page)} 
            className="pageNumber"
          >
            {page}
          </span>
        )}
      </span>
    ))}
    <span className="pageNumber">...</span>
    <span className="pageNumber" onClick={() => setCurrentPage(totalPages)}>{totalPages}</span>
  </span>
  <button
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={currentPage === totalPages}
    className="pageButtons"
  >
    Next
  </button>
</div>
</>
  )
}

export default Transactions