const ethers = require('ethers')

const { resolveConfigurationGSN, RelayProvider } = require('@opengsn/gsn')
const paymasterAddress = require('../build/gsn/Paymaster.json').address

const contractArtifact = require('../build/contracts/CaptureTheFlag.json')
const contractAddress = contractArtifact.networks[window.ethereum.networkVersion].address
const contractAbi = contractArtifact.abi

let provider
let network

async function identifyNetwork () {
  provider = new ethers.providers.Web3Provider(window.ethereum)
  const gsnConfig = await resolveConfigurationGSN(window.ethereum, { paymasterAddress })
  const gsnProvider = new RelayProvider(window.ethereum, gsnConfig)
  provider = new ethers.providers.Web3Provider(gsnProvider)
  network = await provider.ready
  return network
}

async function contractCall () {
  await window.ethereum.enable()

  const contract = new ethers.Contract(
    contractAddress, contractAbi, provider.getSigner())
  const transaction = await contract.captureTheFlag()
  const hash = transaction.hash
  console.log(`Transaction ${hash} sent`)
  const receipt = await provider.waitForTransaction(hash)
  console.log(`Mined in block: ${receipt.blockNumber}`)
}

let logview
function log(message) {
    message = message.replace( /(0x\w\w\w\w)\w*(\w\w\w\w)\b/g, '<b>$1...$2</b>')
    if ( !logview) {
        logview = document.getElementById('logview')
    }
    logview.innerHTML = message+"<br>\n"+logview.innerHTML
}
async function listenToEvents () {
  const contract = new ethers.Contract(
    contractAddress, contractAbi, provider)

  contract.on('FlagCaptured', (previousHolder, currentHolder, rawEvent) => {
    log(`Flag Captured from&nbsp;${previousHolder} by&nbsp;${currentHolder}`)
    console.log(`Flag Captured from ${previousHolder} by ${currentHolder}`)
  })
}

window.app = {
  contractCall,
  listenToEvents,
  log,
  identifyNetwork
}

