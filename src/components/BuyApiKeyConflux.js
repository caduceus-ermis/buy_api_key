import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { abi, contractAddress } from "../contractConfig";

const BuyApiKey = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [apiKeyPrice, setApiKeyPrice] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [purchasedApiKey, setPurchasedApiKey] = useState("");
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        await window.ethereum.enable();

        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        console.log("Account: ", account);

        const contractInstance = new web3Instance.eth.Contract(
          abi,
          contractAddress
        );
        setContract(contractInstance);

        const price = await contractInstance.methods.apiKeyPrice().call();
        setApiKeyPrice(web3Instance.utils.fromWei(price, "ether"));
      } else {
        console.error("MetaMask not detected");
      }
    };

    loadBlockchainData();
  }, []);

  const handleBuyApiKey = async () => {
    if (contract) {
      try {
        const priceInWei = await contract.methods.apiKeyPrice().call();
        await contract.methods
          .purchaseApiKey(account)
          .send({ from: account, value: priceInWei });

        const purchasedKey = await contract.methods.getApiKey(account).call();
        setPurchasedApiKey(purchasedKey);
        alert("API Key purchased successfully!");
      } catch (error) {
        console.error(error);
        alert("Transaction failed!");
      }
    }
  };

  return (
    <div>
      <h2>Buy API Key</h2>
      {/* <h3>Account: {account}</h3> */}
      <div>
        <p>API Key Price: {apiKeyPrice} CFX</p>
        {/* <label>API Key:</label>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
        /> */}
      </div>
      <button onClick={handleBuyApiKey}>Buy</button>
      {purchasedApiKey && (
        <div>
          <h3>Your Purchased API Key</h3>
          <p>{purchasedApiKey}</p>
        </div>
      )}
    </div>
  );
};

export default BuyApiKey;
