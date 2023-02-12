
import './App.css';
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import VotingAbi from './contracts/Voting.json'

function App() {

  const [currentAccount, setAccount] = useState("");
  useEffect(() => {
		loadWeb3();
    loadBlockchainData();
	}, []);

  const loadWeb3 = async () => {
	if (window.ethereum) {
		window.web3 = new Web3(window.ethereum);
		try {
			await window.ethereum.enable();
		} catch (error) {
			console.log("Error:", error);
		}
	}
	else if (window.web3) {
		window.web3 = new Web3(window.web3.currentProvider);
	}
	else {
		window.alert(
			"ATTENTION!\nApplication will not load. Non-Ethereum browser detected. You should consider trying MetaMask!"
		);
		return 0;
	}
	return 1;
};

  const loadBlockchainData = async () => {
		const web3 = window.web3;
		const _accounts = await web3.eth.getAccounts();
		const account = _accounts[0];
		setAccount(account);
		const _networkId = await web3.eth.net.getId();
    const networkData = VotingAbi.networks[_networkId];
    if(networkData){
      const votingContract = new web3.eth.Contract(VotingAbi.abi, networkData.address);
      console.log(votingContract);
    }else{
      window.alert("Smart contract not deployed to this network!")
    }
  }


  return (
    <div className="App">
     <nav className="navbar bg-light">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">Your account address : {currentAccount}</a>
  </div>
</nav>
    </div>
  );
}
export default App;
