import React, { useState } from 'react'
import { InfoCircleOutlined } from "@ant-design/icons";

const style = { 
    modal: { 
        color: "black", 
        position: "fixed", 
        top: "10px",
        left: "50%", 
        transform: "translateX(-50%)", 
        zIndex: 1000, 
        backgroundColor: "#E7E6DD", 
        padding: "10px", 
        borderRadius: "8px" 
}, 
 warning: { 
    color: 'black', 
    backgroundColor: "#E7E6DD" 
 }, 
 infoModal: { 
    color: "black", 
    position: "absolute", 
    top: "30px", 
    left: "50%", 
    transform: "translateX(-50%)", 
    zIndex: 1001, 
    backgroundColor: "#E7E6DD", 
    padding: "10px", 
    borderRadius: "8px", 
    display: "none" 
}, 
 infoModalVisible: { 
    display: "block"
}
}
function BugWarning() {
    const [showInfo, setShowInfo] = useState(false);

    const information = () => (
        <div style={{ ...style.infoModal, ...(showInfo ? style.infoModalVisible : {}) }}>
            This bug is in regards to orders executed using these pairs are not using the correct decimal places. If you accidentally place an order, and your funds are improperly distributed we will reimburse you for your transaction. However, there will be some non-refundable gas fees.
        </div>
    );

    return (
        <div style={style.modal}>
            <div style={style.warning}>There is currently a bug on all currency pairs, and tokens without 18 decimals. Transactions on these tokens are disabled.</div>
            <InfoCircleOutlined
                onHover={() => setShowInfo(true)}
                onClick={() => setShowInfo(prev => !prev)}
            />
            {information()}
        </div>
    )
}

export default BugWarning