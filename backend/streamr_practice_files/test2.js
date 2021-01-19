const StreamrClient = require('streamr-client')
const ethers = require('ethers')

var SHARED_SECRET = "9rpMdLArQ3C8_-ISvBLrLgrTzIjC2oRFuE5YuPyfyc3w"
var DATA_UNION_CONTRACT_ADDRESS = "0x9a722acfb84b51e5b01b9b9331648924814f8f8d"
var STREAM_ID = '0xfe0d298da1223de5d6b3ef8c0785ab57a46e68f5/test'

var playerWallet = StreamrClient.generateEthereumAccount()

var streamr = new StreamrClient({
  auth: {
    privateKey: playerWallet.privateKey,
  },
  url: "wss://hack.streamr.network/api/v1/ws",
  restUrl : "https://hack.streamr.network/api/v1"
})

var provider = ethers.getDefaultProvider()
var wallet = new ethers.Wallet(playerWallet.privateKey)

// Join the DU with the player wallet just created
// streamr.joinDataUnion(DATA_UNION_CONTRACT_ADDRESS, SHARED_SECRET)
//   .then((memberDetails)=> {
//     console.log('memberDetails: ', memberDetails)

//     streamr.getMemberStats(DATA_UNION_CONTRACT_ADDRESS, memberDetails.memberAddress)
//     .then((stats) => {
//       console.log('stats: ', stats)
//       document.getElementById("data-balance").innerHTML = ethers.utils.formatEther(stats.earnings);
//       document.getElementById("data-available").innerHTML = ethers.utils.formatEther(stats.withdrawableEarnings);
//     })
//   })

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("player-wallet").innerHTML = playerWallet.address;
  document.getElementById("player-key").innerHTML = playerWallet.privateKey;
});

function pushDataToStream(userChoice) {
  console.log('enter pushDataToStream, ', userChoice)
  var dataPoint = {
      "move": userChoice,
  }
  streamr.joinDataUnion(DATA_UNION_CONTRACT_ADDRESS, SHARED_SECRET)
.then((memberDetails)=> {
  console.log('memberDetails: ', memberDetails)
  streamr.publish('0xfe0d298da1223de5d6b3ef8c0785ab57a46e68f5/test', {
      temperature: 23.4,
      humidity: 21,
      happy: false,
  }).then(()=>{
  streamr.getMemberStats(DATA_UNION_CONTRACT_ADDRESS, memberDetails.memberAddress)
  .then((stats) => {
    console.log('stats:', stats)
})
})
})
}

function play() {
  // get the computer's random choice
  var compChoice = Math.random() * 3;
  compChoice= Math.floor(compChoice);
 
  var choices=["rock", "paper", "scissors"];
  document.getElementById("computer-choice").innerHTML = choices[compChoice];
  
  // get value user typed
  var userChoice = document.getElementById("moves").value;
  
  // set it to either 0,1,2 to make it easier to compare with compChoice
  if (userChoice === "rock"){
    userChoice = 0;
  } else if (userChoice === "paper") {
    userChoice = 1;
  } else {
    userChoice = 2;
  }
  
  if (compChoice === userChoice) {
    document.getElementById("result").innerHTML = choices[userChoice] + ' versus ' + choices[compChoice] + ', DRAW!';
  } else if ((compChoice === 0 && userChoice === 1) || 
           (compChoice === 1 && userChoice === 2) || 
           (compChoice === 2 && userChoice === 0) ) {
    document.getElementById("result").innerHTML = choices[userChoice] + ' beats ' + choices[compChoice] + ', YOU WON!';
  } else {
    document.getElementById("result").innerHTML = choices[compChoice] + ' beats ' + choices[userChoice] + ', YOU LOSE!';
  }

  pushDataToStream(choices[userChoice])
}

function withdraw() {
  streamr.withdraw(DATA_UNION_CONTRACT_ADDRESS)
}
