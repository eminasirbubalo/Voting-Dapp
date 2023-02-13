
import './App.css';
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import VotingAbi from './contracts/Voting.json'

function App() {

	useEffect(() => {
		loadWeb3();
    loadBlockchainData();
	}, []);

  const [currentAccount, setAccount] = useState("");
  const [votingContract, setVotingContract] = useState("");
  const [candidate1, setCandidate1] = useState("");
  const [candidate2, setCandidate2] = useState("");
  const [chosenCandidate, setchosenCandidate] = useState("");

  const onChange = (e) => {
	setchosenCandidate(e.target.value)
  };
  const onSubmit = (e) => {
	e.preventDefault();
	if(chosenCandidate !== 0) vote(Number(chosenCandidate));
	else window.alert("error");
  }

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
	  setVotingContract(votingContract);
	  console.log(votingContract);
	  const candidate1 = await votingContract.methods.candidates(1).call();
	  const candidate2 = await votingContract.methods.candidates(2).call();
	  setCandidate1(candidate1);
	  setCandidate2(candidate2);
    }else{
      window.alert("Smart contract not deployed to this network!")
    }
  }

  const vote = async (candidate) => {
	await votingContract.methods
		.vote(candidate)
		.send({ from: currentAccount })
		.on("transactionHash", (hash) => {
			console.log("Transaction was successful", hash);
		});
};

  return (
    <div className="App">
     <nav className="navbar bg-light">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">Your account address : {currentAccount}</a>
  </div>
</nav>
<div className="mt-4 text-center" style={{ color: "#000000" }}>
<h2>Today we vote between: </h2>
<div className="p-3 ml-auto mr-auto border rounded" style={{ width: "40%" }}>
	<div className="row ml-auto mr-auto  mb-2" style={{ width: "90%" }}>
		<div className="col">
			<p>#</p>
		</div>
		<div className="col">
			<p>Name</p>
		</div>
		<div className="col">
			<p>Votes</p>
		</div>
	</div>
	<hr style={{ width: "90%", borderStyle: "solid", borderColor: "#eebb4d" }} />
	<div className="row ml-auto mr-auto  mb-2" style={{ width: "90%" }}>
		<div className="col">
			<p>{candidate1.id}</p>
		</div>
		<div className="col">
			<p>{candidate1.name}</p>
		</div>
		<div className="col">
			<p>{candidate1.votesCount}</p>
		</div>
	</div>
	<hr style={{ width: "90%", borderStyle: "solid", borderColor: "#eebb4d" }} />
	<div className="row ml-auto mr-auto  mb-2" style={{ width: "90%" }}>
		<div className="col">
			<p>{candidate2.id}</p>
		</div>
		<div className="col">
			<p>{candidate2.name}</p>
		</div>
		<div className="col">
			<p>{candidate2.votesCount}</p>
		</div>
	</div>
</div>
<div className="my-5 mr-auto ml-auto text-left" style={{ width: "70%" }}>
	<h5>Add Your Vote:</h5>
	<form onSubmit={onSubmit}>
			<select name="candidate" className="form-control" onChange={onChange}>
				<option defaultValue value="">
					Select
				</option>
				<option value="1">{candidate1.name}</option>
				<option value="2">{candidate2.name}</option>
			</select>
			<button className="btn btn-primary mt-2 btn-md w-100">Vote Candidate{""} {chosenCandidate}</button>
		</form>
</div>
<p className="mt-3">
	Current winner is <span className="font-weight-bold"></span>
	<br />
	Total people have voted
</p>
</div>
</div>
  );
}
export default App;
