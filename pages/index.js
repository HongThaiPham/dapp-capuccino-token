import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import getWeb3 from "../libs/getWeb3";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [web3, setWeb3] = useState();
  const [loading, setLoading] = useState(true);
  const [kycAddress, setkycAddress] = useState("");
  const [userTokens, setUserTokens] = useState(0);

  async function init() {
    setLoading(true);
    try {
      const web3Temp = await getWeb3();

      setWeb3(web3Temp);
      setLoading(false);

      updateUserTokens(web3Temp);
      listenToTokenTransfer(web3Temp);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    init();
    window.ethereum.on("accountsChanged", function (accounts) {
      window.location.reload();
    });
  }, []);

  const handleKycSubmit = async () => {
    const xxx = await web3.myKycContract.setKycCompleted(kycAddress);

    alert("Account " + kycAddress + " is now whitelisted");
    const yyy = await web3.myKycContract.kycCompleted(kycAddress);
  };

  const handleMetamask = async () => {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    window.location.reload();
  };

  const handleBuyToken = async () => {
    const tx = await web3.myTokenSales.buyTokens(web3.account, {
      value: ethers.utils.parseEther("1"),
    });
    if (tx) {
      alert("Buy 1 more token");
    }
  };

  const updateUserTokens = async (contract) => {
    const webContract = web3 || contract;
    const userTokens = await webContract.myToken.balanceOf(webContract.account);
    setUserTokens(ethers.utils.formatEther(userTokens.toString()));
  };
  const listenToTokenTransfer = async (contract) => {
    const webContract = web3 || contract;
    webContract.myToken.on("Transfer", (from, to, amout) => {
      updateUserTokens(contract);
      // console.log({
      //   from,
      //   to,
      //   amout: ethers.utils.formatEther(amout.toString()),
      // });
    });
    // .Transfer({ to: this.accounts[0] })
    // .on("data", this.updateUserTokens);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Token sale demo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>{" "}
      <main className={styles.main}>
        {loading ? (
          <div>
            Loading Web3, accounts, and contract.... Please{" "}
            <button type="button" onClick={handleMetamask}>
              connect Metamask
            </button>
          </div>
        ) : (
          <div className="App">
            <h1>Capuccino Token sale for StarDucks</h1>
            <h2>Capuccino Token contract: {web3.myToken.address}</h2>
            <h2>Enable your account</h2>
            Address to allow:{" "}
            <input
              type="text"
              name="kycAddress"
              value={kycAddress}
              onChange={(e) => setkycAddress(e.target.value)}
            />
            <button type="button" onClick={handleKycSubmit}>
              Add Address to Whitelist
            </button>
            <h2>Buy Cappucino-Tokens</h2>
            <p>Send Ether to this address: {web3.myTokenSales.address}</p>
            <p>You have: {userTokens}</p>
            <button type="button" onClick={handleBuyToken}>
              Buy more tokens
            </button>
          </div>
        )}
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
