/*global ethereum, MetamaskOnboarding */

//const { ethers } = require("ethers");

/*
The `piggybankContract` is compiled from:

  pragma solidity ^0.4.0;
  contract PiggyBank {

      uint private balance;
      address public owner;

      function PiggyBank() public {
          owner = msg.sender;
          balance = 0;
      }

      function deposit() public payable returns (uint) {
          balance += msg.value;
          return balance;
      }

      function withdraw(uint withdrawAmount) public returns (uint remainingBal) {
          require(msg.sender == owner);
          balance -= withdrawAmount;

          msg.sender.transfer(withdrawAmount);

          return balance;
      }
  }
*/

const forwarderOrigin = 'http://localhost:9010';

//declaracion de todos los botones y inputs de la pagina

const userRegistryButton      = document.getElementById('registry');
const addEventButton          = document.getElementById('addEvent');
const getEventsButton        = document.getElementById('getEvents');
const user_event              = document.getElementById('user_event');
const type_event              = document.getElementById('type_event');
const user_read               = document.getElementById('user_read');
const chunk_read              = document.getElementById('chunk_read');


//Bloque de iniciación para conectar metamask
const initialize = () => {
  //You will start here. Comenzar aqui
  console.log('initializing'); 

  //Basic Actions Section
  const onboardButton = document.getElementById('connectButton');
  
  //creación de la funcion de verificación creada para ver si la extension metamask esta instalada
  const isMetaMaskInstalled = () => {
    //comprueba si el navegador tiene la extensión Metamask instalada
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

   //We create a new MetaMask onboarding object to use in our app
   const onboarding = new MetaMaskOnboarding({ forwarderOrigin }); // para hacer uso del metodo on onClickInstall



  const onClickInstall = () => {
    // Al clicar en el botón en este estado, redirige al usuario a una pagina para instalar metamask
    onboardButton.innerText = 'Incorporación en curso'; // Incorporacion en curso
    onboardButton.disabled = true;
	//On this object we have startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding();
  };

  const onClickConnect = async () => {
    try {
      //salta la ventana emergente de Metamask para que se seleccione la cuenta
      await ethereum.request({ method: 'eth_requestAccounts' }); // eth_solicitud de cuentas
    } catch (error) {
      console.error(error);
    }
  };


  const MetamaskClientCheck = async () => {
    if (!isMetaMaskInstalled()) {
      //si no esta instalado se llama al método que redirija al usuario
      onboardButton.innerText = '¡Hacer clic aqui para instalar Metamask!'; // Haga clic aqui para instalar Metamask!
      onboardButton.onclick = onClickInstall;
      onboardButton.disabled = false;
    } else {
      //Si ya lo estuviera, se conecta con la cuenta seleccionada
      onboardButton.innerText = 'Conectar con metamask'; //Conectar
      onboardButton.onclick = onClickConnect;
      onboardButton.disabled = false;
    }
  };

  //Metodo que se encarga de registrar usuario
  userRegistryButton.onclick = async () => {
  try {
    let user = document.getElementById('user_registry').value;

    let user1 = await myContractWithSignature.newHH(user);
	console.log("registro de usuario");
	console.log(user1);
  } catch (error) {
    console.error(error);
  }
  };

  //Metodo que se encarga de guardar un evento (consulta medica,  reporte de laboratorio)
  addEventButton.onclick = async () => {
  	try {
    		let user = user_event.value;
    		console.log(user);
    		//Los tipos de eventos pueden ser (consulta medica , reporte de laboratorio)
    		let typeOfEvent = type_event.value;
    		console.log(typeOfEvent);
			//Se recoge el hash del fichero subido
			const _urloffile = URL.createObjectURL(fileData);
    		console.log(_urloffile);
    		//Se sube el evento a Ethereum
			console.log("guardar archivo");
			let file = await myContractWithSignature.addnewevent(user,typeOfEvent, _urloffile);
    		console.log(file);
  	} catch (error) {
    		console.error(error);
  	}
  };

  // Metodo que recoge los eventos por id de usuarios
  getEventsButton.onclick = async () => {
  	try {
    		let user = user_read.value;
    		let numOfChunk = chunk_read.value;
    		//Se recogen los eventos en funcion a su usuario
    		console.log('_userid', user, 'numOfChunk', numOfChunk, 'myContract', myContract); 
			let result = await myContract.getEvents(user, numOfChunk);
			console.log('events -> ', result); 
			let cadena = result[0].split("Consulta Médica");
			let cadena2 = result[0].split("Reporte de Laboratorio");  
			console.log(result[0]); 

			// En JS se puede "inyectar" codigo HTML en cualquier elemento teniendo únicamente su id
			if (cadena  != "undefined") {
				document.getElementById("contenedor").innerHTML = '<table>'
      			+ ' <tr><td> Archivo:  </td><td><a target="_blank" href="'+ cadena[1] +'">'+ cadena[1] +'</a></td>' 
      			+ '</table>';
			}
			if (cadena2 != "undefined") {
				document.getElementById("contenedor2").innerHTML = '<table>'
      			+ ' <tr><td> Archivo:  </td><td><a target="_blank" href="'+ cadena2[1] +'">'+ cadena2[1] +'</a></td>' 
      			+ '</table>';
			}
  	} catch (error) {
    		console.error(error);
  		}
 };
  console.log('initialized'); 

  MetamaskClientCheck();

};

window.addEventListener('DOMContentLoaded', initialize); //Lanza la inicialización según cargue toda la página HTML

const provider = new ethers.providers.Web3Provider(window.ethereum);

const signer = provider.getSigner();


//const contractAddress = '0xe53e55eF11ED3673C7633AcbC91DD298cfAB0135'; // dirección del contrato goerli metamask
const contractAddress = '0xeA553aC9fc4a76E7F78db72e6f7Fa68C0Af826C2'; // dirección del contrato ganache metamask

console.log('connecting to contract:', contractAddress); 

console.log('provider', provider, 'code', provider.getCode(contractAddress));

// ABI del contrato
const  contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "_userid",
				"type": "string"
			}
		],
		"name": "thereisanewhistory",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_userid",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_evento",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_urloffile",
				"type": "string"
			}
		],
		"name": "addnewevent",
		"outputs": [
			{
				"internalType": "bool",
				"name": "OK",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_userid",
				"type": "string"
			}
		],
		"name": "newHH",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_userid",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "numofchunk",
				"type": "uint256"
			}
		],
		"name": "getEvents",
		"outputs": [
			{
				"internalType": "string[10]",
				"name": "_history",
				"type": "string[10]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const myContract = new ethers.Contract(contractAddress, contractABI, provider);

const myContractWithSignature = myContract.connect(signer);



var fileData = '';
const fileSelector = document.getElementById('file_event');
	fileSelector.addEventListener('change', (evento) => {
	fileData = evento.target.files[0];
	console.log(fileData);
});