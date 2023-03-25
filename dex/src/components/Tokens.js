import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Card } from "antd";
import millify from "millify";
import "./tokenIndex.css";
import { useGetCryptosQuery } from './services/cryptoApi';
import { Loader } from "./elements";

function Tokens() {
  const [query, setQuery] = useState("");
  const { data, isFetching } = useGetCryptosQuery(1200);
  const cryptos = data?.data?.coins;
  const toks = ["aKzUVe4Hh_CON", "VLqpJwogdhHNb","HIVsRcGKkPFtW","T93ksC96YL_Gc","MoTuySvg7","Mtfb0obXVh59u","_H5FVG9iW","QGbUTVMjG","qFakph2rpuMOL","ixgUfzmLR","6Cnl5FOCZ","4_bg9Z6N","ZnXwbDH6M","GDFVoYSg-","dYuh_N0n1","hkjDLHddC","pOnT-qfd-RN7W","wmxTi-5LK","tEf7-dnwV3BXS","McDqIrrf","3dEOkxpEKhmBT","yLF-kUz8s2","oMBtIfxSwJO52","7GNq0jOgaN086","x4WXHge-vvFY", "ylk8jNIDMgUmr","rmJ-4TVj6","9K7m6ufraZ6gh","9DPRBMwQK36f","kzQJNxsjyuyYO","MZ6RCSVNs0akz","Th7joXDkesUfn","t8ctJQPSf", "mMt1EGjo4Eyac","_izgytAQa-RbV","zayD-pQP4","5DFowhHtjhXA","bauj_21eYVwso","3nMM61qeg", "vSo2fu9iE1s0Y","0GvBYGJMST8IO","XcGSBg2pO6MeB","vu0nUKwNtoITi","lT__vMO7l","tLXTkXU90vdjq","ibM9HStjIjQ5B","iEHCPwcxoIH8e", "h6Bjn1mlb6Q2B","tgTvoWqFeqwBC","_dtO_StB","IdrU0Gp2cK","htHKUfaaUP2dk","1yFafHZGl", "MshEDxjCn","shjxZ0hQM","REkXPFgv_", "JCKLgWPAF", "CTwz1vB2LylBf","FtSDbrt7Z", "wsXx9cqhkVzS", "eW3wHxPmmwlNp",
  "aAKLSV5-0", "gQy8QuWYa", "uzUCYmcW73kQF","E-U6oZfh2", "NK81WIowi","fvNj4j5lW", "rk5XwL6mIjUDp","M0BDJDdrNfVlD","OVjL0R5N48c0","kLw78HsOD","dNi7Xe4uK","7q5-b6CZQ","Au8mNo2ZIlJfL", "RQ5h2nof_", "-oseAsDmP", "MvVrm09NjVxNR","7Dg6y_Ywg","sgxZRXbK0FDc","gyeL8ikF4", "3GO3PSgPvgr3","M83e6F9ol","_tpssiAXwrHfr","_cgMK4FnC","196y6aIHKPrZd","HPxiP0ifZRNzD","ieHLSFYQDemsn","y4eKT6KEw-Pxo","jWvjEFGAtnhWN", "45H4HIbe2","YeAkhzZF6NKPs","OIREGTMy1","izyvuzTCPBPrk","hG9iQlgtdwCvc","93F-_ECjpVaB","p_GHkOeDNKw0","DXwP4wF9ksbBO","uW2tk-ILY0ii","oXK95bH4OIUoj","8EQUpW9UuEBo","1ZZI6g5k5royD","zlVB2TdtBzUm","upmyKdAQ", "YRTkUcMi","3mVx2FX_iJFp5","_NvQ_iCjZu4Ay", "N9nKSml0uzhgJ","z1VVxbAp1","gDTpVbAhv","e16VEGnPn", "71u0ElJ-Uq93k", "GqypatSdJ","AotMKHLrg","YReOouW1_", "6ydPFFHAtthwU","Wlt465wE9","YQei2oOuP","RzGVuiI5",  "BBWqxx2A","I_6DjYVak", "ql3Jj4Tge", "HnJVTcIM7", "IAN7H-tm7", "n9lqqcJddG", "keCcPOjp8", "TvIxLzUH2", "XE0GH8VNm", "mFSwkjYWd", "31Oe49M9Q", "L6mNo36hc", "h8MlvevE8", "0GZ2qBGZF", "8_Vx2VNt-7YtZ", "TNDriPF_V", "eghx4xZ4c", "O8XYdenjI", "7oCgI0fI3", "kqVrcfmbH", "yxF8l-ADn","DVY9sEcyG", "c8VyQ9vyc", "wAmGg4qFj","vy51l0qsM","gpRKmM16k", "cO3IZ2ueIZlsH", "TDa0Z7X99","5Ot2Tm3SN","ILJB6CXb7","7I42wN6e9R","LoAo6W2KwOyVc","59T2mLvO2","3Rk7gOMM7","BpsbnmV3Bhq9","Vnk-4lXhL", "ZIXroLSIK","sLicn7G_W","2PHUNtqCo","2f4FA2CMg","Hi6jNXshVh9FA","hEJCs2B9XeSu_","Lr2clCozN","qhd1biQ7M","Pe93bIOD2","VINVMYf0u","APZJdoWV8","cTdD8lD-6", "3nNpuxHJ8","lD9digIOk","PfPywg1Va", "AWma-WzFHmKVQ", "zoIp0AjkW","KfWtaeV1W", "PkY9BmsyW", "EdF44zNwU", "3zxgECoEC", "CBG6NPLGF","J_Bq3DI7Y", "yqJQL1_1","drWC87t2Vozh", "_e-IRfHRK","0UAyqd1TU","ja6uLg6Q2","b6MS3Guay","QhcTIJ-mM","jIaAxVLYt","65PHZTpmE55b","OmNBhJZXb","oYVqUm_Mx","aSZxfQvkrz1PK","9Uvf6ligt","UTp3Dyykn","pxtKbG5rg","rpX-4r0Gs","2bp_dSxvxz","vjdpPWKFn","ttqANYhU6","iOhWsmpcE","kDvVndhL8","n7W9r2RaW", "uIEWfMFnQo9K_", "DogUY8A21", "IylFfXsQ4","pvpvPqRqL", "uDPuyEwYY", "9ZAsxbjqI", "GHZkMV5qg", "R3RGQlla_cTv", "E_1RS2oan", "xz24e0BjL", "mkhZJsxY7WXB", "SqbBbtNsG", "zfVt1uA3P", "Qt7b8NvVq","sS0coVyPQ","jZyh6ZQup","oKcXLR3Qx","1ftpMFJKp", "sCDE9K1b", "Hi2ZGwfbG","i75In93Dn5d8P","1rbVtxvQt","yEFdE5jEg","QOLr7kNDYvLa","KwZ2vmtPW","4UM6MucwFvYex","Cba_n--i4","bEhA3bncp","OMVdNqHmh","k-J3YwacF","FW_BCTP21","ymrUBSLfa","bjb5p_MJm","2jrOEOFJQ", "91NFEIwfA-B8","hdxzTuPft","lsQRiaXiN", "7C4Mh4xy1yDel","wHDTPyE0aC","nighWmDcw","liwAwgA1O","FY7K2yvVm","0X2s4MQ4UUXQ_","G8F7NX6yy", "Jjp7zDT2s", "kghogiMb8","db2iyTQCs", "GSCt2y6YSgO26",
  "WYjWRq8j8", "PRhnyV8c", "7Lc8ddMYQ", "E3w8cmrAs", "MUVCihzG7", "NfeOYfNcl","v4IW9oaF","K8z36HfDY", "DscaCqJl7", "t7IApd4quI", "0EGhWmhoOx","ipWWUp7-A","0sol0FrD1","6mhoYrBYV","RMWDBxD22","_L4iSZQyZ", "H6qGFVNtv9zh","4AUX-OaPZXFD","fbGKRhCXn","2WkFqYksI6HP6","WbH4GTBOi", "T79Hghifw","W1hFKeQvR","rViRT6Y05","Ly2XKfb7s", "lS8PBZhtl","-rnE1QO52","dBhvS_QZP", "S4aaWcl1Ztx__","vPSoAK1iP","Q9dLTSFOi","NHY3cxbJb","yzgUl-6QM", "mVuK_I66Gjf5","HoSblCMxj", "LjR-NyhjF_LVw","7zzwdCwfm", "SpWVy3vxSxnu4","nm9SZMWU5U2j","vi7KLhuKO5LIu","99LaOMYLb", "WvoRtQhzN",  "Uc0YHBuL-", "XgVorxyoa", "8JQrCTYyY","j6PtwImWyasT0","C6ddYx4P1","DDZt-yKX1Fo7U","SzY719EJf","Zn0_0EpSb", "JvF0Rg4go","c_aW9SPmo", "PZl9X_P5h", "wdZiFNiOS","XFovah2H1","qPvsulAsX","2U8pamjm9", "X0a50nM3Y", "Ndp5yUma3E","sQ77akpUH","kN1SyNMfy","Q1yNY7qAI", "5k13OLXRz","Ac13iS3os", "5pkoaIZEl","f5hHgH6PhD7xU","6fFWCl3U0", "wtIbdIh7t","6ll_3q9rQz","8RI3lL8WG","vMnIGRmnT","sI8ii1b8E", "IBeYJgW0C", "cCx8KCiV3", "eLJWn52hZ", "0Un03QVz2", "Okg3HKa3L","UCsWDe7HZ", "StD4YwYRlsXOa","6CMmygTnC","o4XsRTtC_", "lORNHeWV9", "n1XE3U1gU","--G3pxvHe","CiixT63n3","qsOyQHRCK","QzB7eIfUD","R8e5gIT5q","Ii9Qe5Tjz","SLcGT3CwT","L0Dmzmcdx", "2P0cqHYBl","67YlI0K1b","vS4dI3-9L", "sL398z9VP","hfw0nnnLtSFc7","ZnKJZGXlg","4HMECerRq","bj95vFrxl","fmHk13Rqw","j_zgm6Fzd","sjDeeIiIc","blZHvyG6I","1nAOqpoNx", "JhGTanYchgC63","aFpo5mPr6","COFwnvK7p","FIWJnfNQ-","Z96jIvLU7","KG0UgzM5U","DJdvWtzBV","QQ0NCmjVq","fl2ebJ0ia","9wxVq8GWj","w5U609Wze","AJdkJkt3ncjG","lILzU-LYL","TYvlooNC_","EOpCzpAs7","bfzmBakIm","QggD5PmBg","iRBpV8Cyg","80NGUkVA1PJFD","8qWGTfYI0","XRXIH9kER","C5Hx25DA3vp8h","z2PZIKQL7","JPSZJ4DXhU1I", "ZbdTvGobTRFYp", "_Kw2ThTR4", "aCuELfOq3", "vLdnjGS6CZ3df", "BCCFEHc7xa","1evaOJpHs","B31G95dTx", "3UCgsINMZ", "McF09lRrU", "Dxz1WMaM0", "STE6OsjDk", "S-G-XT_aW", "-HYrdBaCAa3mC","KcJOnG4eK", "jzFuKSd41", "eXQl4KEhO", "SC3wW8avl", "JIskbc_Ki", "pLXskGAzh","Z8fBVuVYY", "gCwgUgJni","U0fA1_UOS","Kj-E5mL1L","uemN_0MhxU","JY1_q2c0g","w4MqH_Xe8","2EI1Nmp6r","2RiZFaE6d","kZPku7cAdoaXf","ca4iUCazX","rVVlqo15a","cw-AKS-0H","5TDMcKcKHjmg","sMtevHE1Q","WbzNr-oeG","xC08oSTGP","V2gPy4UsR","NO9wjX-Qw","x6pIFu9Oo","6x9gH1uY6","60ihAl90T","fgZU5u4gb","_gCs0kzOU4tkw","qLybsCm3y","_hqO4mRYb","N2IgQ9Xme","Bh63f_IAD","P_neK55dc","foR6S_BKiN9K","seRwJLKIi","9e6pQCCeN","gVz8mpXle","Vuy-IUC7","-U3Wgs4ux","mK5Mk8at3","OcMJMzxnefVX","MMZLepqy","pU5_LljI_","ysvi_nKGB", "Zx0HfjpUp","sZOrgDS4B","dEsfOHERD","oMn0Lpc4GrzXY","hqyKex9jsK15L","EXBnlmj1",
]
  if(isFetching) return <Loader />;

  return (
  <div className="ETHDEX">
      <div style={{ textAlign: "center" }}>
        <input
          placeholder="Search..."
          className="searchBar"
          type="text"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <h1 className="heading">Tokens</h1>
      <div className="column-title">
        <span className="column-title-heading">Tokens</span>
        <span className="column-title-heading">Market Cap</span>
        <span className="column-title-heading">Price</span>
        <span className="column-title-heading"></span>
      </div>
      <div>
        {!cryptos
          ? null
          : cryptos
              .filter((val) => {
                if (query === "") {
                  return val;
                } else {
                  return val?.name.toLowerCase().includes(query.toLowerCase());
                  //  && val.Symbol.toLowerCase().includes(query.toLowerCase());
                }
              })
              .map((token, index) => (
                <div className="cardContainer" key={index}>
                  {!toks.includes(token.uuid)?null :(

                    <Card className="daoCard">
                    <Link to={`/${token?.name}/${token?.uuid}`}>
                      <div style={{ display: "flex", textAlign: "left" }} >
                          <div>
                            <img className="logo" src={token.iconUrl} alt="noLogo" />
                          </div>
                          <div>
                            <h4 className="name">{token.name}</h4>
                            <span className="symbol">{token.symbol}</span>
                          </div>
                        <div>
                          <span className="type">
                            {token.marketCap == null ? "--" : millify(token.marketCap)}
                          </span>
                          <span className="lastPrice">
                            {token.price == null ? "--" : millify(token.price)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Card>
                    )}
                </div>
              ))}
      </div>
    </div>
  );
}

export default Tokens