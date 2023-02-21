const contractAdress = "0x6bf743ba36eA25c88F52cdEA56e3134576ED4d35";
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_requestId",
				"type": "uint256"
			}
		],
		"name": "rpsRequest",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_requestId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "_isPlayerWin",
				"type": "uint8"
			}
		],
		"name": "rpsResult",
		"type": "event"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [],
		"name": "getLastId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "requestId",
				"type": "uint256"
			}
		],
		"name": "getStatus",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "playerMove",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "computerMove",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_requestId",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "_randomWords",
				"type": "uint256[]"
			}
		],
		"name": "rawFulfillRandomWords",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "rpsOptions",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "playerChoice",
				"type": "uint8"
			}
		],
		"name": "rpsPlayWithBnb",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "statuses",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "fees",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "randomWord",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "entryFee",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "isPlayerWin",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "fulfilled",
				"type": "bool"
			},
			{
				"internalType": "uint8",
				"name": "choice",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "computerChoice",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawBnb",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawLink",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]

const provider = new ethers.providers.Web3Provider(window.ethereum, 97)
let signer;
let contract; 

provider.send("eth_requestAccounts", []).then(()=> {        //get access to metamask
    provider.listAccounts().then((accounts) => {            //get list of accounts
        signer = provider.getSigner(accounts[0]);   //connect metamask account to dapp
        contract = new ethers.Contract(
            contractAdress,
            contractABI,
            signer
        )
    })
})


async function playRps(_option) {
    let amountInEth = document.getElementById("amountInEth").value;
    let amountInWei = ethers.utils.parseEther(amountInEth.toString());
    let gameResp = await contract.rpsPlayWithBnb(_option, {
        gasLimit: 400000,
        value: amountInWei
    });
}
