import { ethers } from "ethers";
import MyToken from "../artifacts/contracts/MyToken.sol/MyToken.json";
import KycContract from "../artifacts/contracts/KycContract.sol/KycContract.json";
import MyTokenSales from "../artifacts/contracts/MyTokenSale.sol/MyTokenSale.json";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          console.log(signer);
          const account = await signer.getAddress();
          const myToken = new ethers.Contract(
            "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
            MyToken.abi,
            signer
          );

          const myKycContract = new ethers.Contract(
            "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
            KycContract.abi,
            signer
          );

          const myTokenSales = new ethers.Contract(
            "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
            MyTokenSales.abi,
            signer
          );

          // Request account access if needed
          await window.ethereum.enable();
          // Accounts now exposed
          resolve({ account, myToken, myKycContract, myTokenSales });
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
    });
  });

export default getWeb3;
