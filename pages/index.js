import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import getWeb3 from "../libs/getWeb3";
import { useEffect, useState } from "react";

export default function Home() {
  const [web3, setWeb3] = useState();
  const [loading, setLoading] = useState(true);
  const [kycAddress, setkycAddress] = useState("");
  async function init() {
    setLoading(true);
    try {
      setWeb3(await getWeb3());
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    init();
  }, []);

  const handleKycSubmit = async () => {
    console.log(web3);
    const xxx = await web3.myKycContract.setKycCompleted(kycAddress);

    alert("Account " + kycAddress + " is now whitelisted");
    const yyy = await web3.myKycContract.kycCompleted(kycAddress);
    console.log(yyy);
  };

  const handleMetamask = async () => {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    window.location.reload();
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
