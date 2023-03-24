import React from 'react';
import { Typography, Card } from 'antd';
import USdebtClock from "../USdebtClock.png";

const { Title } = Typography;
const style={
    homePage: {
        
    },
    companyName: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
        marginBottom: '5%',
        fontSize: "3em"
    },
    grid:{
        color: "white",
    },
    lock:{
        color: "lime",
    },
    companyDesc: {
        backgroundColor: "#202020",
        color: "white",
        width: "80%",
        margin: "0px auto",
        borderRadius: ".5em",
        border:"1px #202020 solid",
        marginBottom: "2%"
    },
    missionStatement:{
        fontSize: "2em",
        color: "white",
    },
    USdebtClock:{
        width: "50%",
        marginTop: "2%",
        marginBottom: "4%",
    }
}

function Home() {

  return (
    <>
    <div style={style.homePage}>

        <Title style={style.companyName}>
            <div style={style.grid}>
                grid
            </div>
            <div style={style.lock}>
                Lock
            </div>
        </Title>
        <Card style={style.companyDesc}>
            <Title size={5} style={style.missionStatement}>
                Mission Statement
            </Title>
            <div>
                Our organization would like to bridge the gap between investors and crypto companies. We chose gridLock, because the plan is to lock down the grid that is the blockchain. Doing so by helping crypto companies gain access to capital allowing them to more easily expand, increasing the utility of cryptocurrencies. This will also give investors more clear cut descriptions of what certain fungible tokens represent. We have big plans to store company details (description, website, announcements, ect..) in a public contract on the blockchain, provide a portal for companies to register with SEC, enable DAO voting, and build accounting tables off of company transactions. 
            </div>
        </Card>
        <Card style={style.companyDesc}>
            <Title size={5} style={style.missionStatement}>
                What are fungible tokens?
            </Title>
        <div>
                Fungible tokens are entitlements to real world assets. Some tokens represent ownership in a company, or government issued currencies know as stablecoins, and others represent entitlements to gold or physical assets. Many people remain unaware but people's pension's and retirement accounts hold something known as gold certificates. The data below is provided by USdebtclock.org.
                <div>
                    <img src={USdebtClock} alt="no image" style={style.USdebtClock}  />
                </div>
                This table shows you that even the paper gold and silver listed in financial markets are not backed by the very asset. When this came to our attention it deeply bothered us, so we would like to create a token backed by a 1-to-1 ratio of tokens to silver.
            </div>
        </Card>
    </div>
    </>
  )
}

export default Home