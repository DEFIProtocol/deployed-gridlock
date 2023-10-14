import React from 'react'
const style = {
    gridlock: {
        color: "lime",
        fontSize: "3em",
        margin: "5%",
    },
    links: {
        color: "lime",
        margin: "0px auto",
        width: "60%",
        display: "flex",
        justifyContent: "space-evenly",
        marginBottom: "5%"
    },
    link: {
        color: "lime",
        textDecoration: "none"
    }
}
function Footer() {

  return (
    <>
        <div style={style.gridlock}>gridlock</div>
        <div style={style.links}>
            <a href="/account" style={style.link}>Account</a>
            <div>|</div>
            <a href="/coins" style={style.link}>Coins</a>
            <div>|</div>
            <a href="/tokens" style={style.link}>Tokens</a>
            <div>|</div>
            <a href="/Swap" style={style.link}>Swap</a>
        </div>
    </>
  )
}

export default Footer