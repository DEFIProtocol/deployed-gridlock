import "./tokenIndex.css";
import React from 'react';
import { Card } from 'antd';
import USdebtClock from "../USdebtClock.png";
import city from "../city.jpg";
import handshake from "../handshake.jpg";
import limitOrder from "../limitOrder.jpg";
import skyskraper from "../skyskraper.jpg";
import vote from "../vote.jpg";
import { StarFilled } from "@ant-design/icons";

// remaking the modern financial system on top of the blockchain

function Home() {

  return (
    <>
    <div className="homePage">
        <div className="cityContainer">
            <div className="cityText">REMAKING THE MODERN FINANCIAL SYSTEM</div>
            <img src={city} alt="no" className="city" />
            <div className="cityText">ON THE BLOCKCHAIN</div>
        </div>
        <Card className="fungibleTokens">
            <div>
                Our organization would like to bridge the gap between investors and crypto companies. We chose gridLock, because the plan is to lock down the grid that is the blockchain. Doing so by helping crypto companies gain access to capital allowing them to more easily expand, increasing the utility of cryptocurrencies. This will also give investors more clear cut descriptions of what certain fungible tokens represent. We have big plans to store company details (e.g., description, website, announcements) in a public contract on the blockchain, provide a portal for companies to register with SEC, enable DAO voting, and build accounting tables off of company transactions. 
            </div>
        </Card>
        <Card className="fungibleTokens">
        <div className="fungibleTokenItem">
            <img src={USdebtClock} alt="no" className="USdebtClock"  />
        </div>
        <div className="fungibleTokenItem">
            <div className="missionStatement">
                What are fungible tokens?
            </div>
                Fungible tokens are entitlements to real world assets. Some tokens represent ownership in a company, or government issued currencies know as stablecoins, and others represent entitlements to gold or physical assets. Many people remain unaware but people's pension's and retirement accounts hold something known as gold certificates. The data below is provided by USdebtclock.org.
                This table shows you that even the paper gold and silver listed in financial markets are not backed by the very asset. When this came to our attention it deeply bothered us, so we would like to create a token backed by a 1-to-1 ratio of tokens to silver.
        </div>
        </Card>
        <Card className="fungibleTokens">
            <div className="fungibleTokenItem">
                <img src={handshake} alt="no" className="USdebtClock"  />
            </div>
            <div className="fungibleTokenItem">

            <div className="missionStatement">
                To Investors
            </div>
                gridLock does not represent any of the tokens listed. Most tokens creators have a genuine intention of creating an interconnected system through the blockchain. However, beware there are nefarious people in the world, so be sure to do your own research before investing. <br /> <br/>   
                Currently available are the capabilities to place market orders directly from ethereum to your favorite tokens! You can price the orders in USD, ETH, or the number of tokens you would like to buy. Other functionalites other DEX's do not have are over 448 available options, price chart, and token details. The price chart is just a frame of reference of historical prices, because the price is calculated off of an average of the token prices across a number of different exchanges.             
                <br />
                <br />
            </div>
            <div className="futureDevelopments">
                <StarFilled alt="no" className="futureDevelopmentPic" />
                <div className="futureDevelopmentTitle">
                Favorites List
                </div>
                Future functionalities include a favorites list for you to have quick access to the tokens you would like to keep an eye on! This will be a centralized functionality, so other users will not have access to the tokens you are watching. Additionally, you will have a personalized homepage displaying current assets values, and your current holdings on your wallet.
                <br /> <br/><br/>
            </div>
            <div className="futureDevelopments">
                <img src={vote} className="futureDevelopmentPic" alt="no" />
                <div className="futureDevelopmentTitle">
                    Token Participation
                </div>
                Currently in the process of being applied is the ability to vote on the future of outlook of company decisions. If the DAO creator chooses to hold a vote for a decision for the organizations direction you will be able to vote for what you believe is in the companies best interest! Votes are up to the creator, but expect many successful DAO's to make major decisions this way.
               <br /><br/><br/>
            </div>
            <div className="futureDevelopments">
                <img src={limitOrder} className="futureDevelopmentPic" alt="no" />
                <div className="futureDevelopmentTitle">
                Limit Orders
                </div>
                 As stated, the only option available is make a purchase at the current token price. We will be enabling limit orders, or purchase of tokens at a specified price in the future. 
                <br/><br/>
            </div>
        </Card>
        <Card className="fungibleTokens">
            <div className="fungibleTokenItem">
                <img src={skyskraper} alt="no" className="USdebtClock"  />
            </div>
            <div className="fungibleTokenItem">
            <div className="missionStatement">
                To Token Creators
            </div>
           
        
        <div className="subtitle">Token Description</div>
            Our company would like to display accurate data about what your token represents. If you would like to change anything displayed on your page feel free to log in from the address that created your token, and you will be presented with the option to change any data you have listed. If your wallet provider is not compatible with our app we will soon be enabling the feature for you to verify ownership, and add admins to your account to make necessary change.           
            <br/><br/><br/>
        <div className="subtitle">DAO Voting</div>
             Do you have a decision that will greatly impact the direction of your company? Not sure what direction is best? Well hold it to a vote held on the blockchain. Allow for comments to be made that will give you a better understanding of how the market feels about the decision. The vote will be based on token ownership, so the more tokens you have the more voting power. ie. 5% of token ownership equals 5% of voting power.
            <br /> <br/>
        </div>
        </Card>
    </div>
    </>
  )
}

export default Home