const CaptureTheFlag = artifacts.require('CaptureTheFlag')
const WhitelistPaymaster = artifacts.require('WhitelistPaymaster')

const ethers = require('ethers')
const { networks } = require('../truffle.js')

module.exports = async function (deployer, network) {
  await deployer.deploy(CaptureTheFlag)

  const instance = await CaptureTheFlag.deployed()
  const forwarderAddress = require('../build/gsn/Forwarder.json').address
  await instance.setTrustedForwarder(forwarderAddress)
  console.log(`Successfully set Trusted Forwarder (${forwarderAddress}) on Recipient (${instance.address})`)

  await deployer.deploy(WhitelistPaymaster)
  const { host, port } = (networks[network] || {})
  const ethersProvider = new ethers.providers.JsonRpcProvider(`http://${host}:${port}`)
  const relayHubAddress = require('../build/gsn/RelayHub.json').address
  const paymaster = await WhitelistPaymaster.deployed()
  await paymaster.setRelayHub(relayHubAddress)
  await paymaster.setTrustedForwarder(forwarderAddress)
  await paymaster.whitelistSender('0x2Dd8C0665327A26D7655055B22c9b3bA596DfeD9')
  console.log(`RelayHub(${relayHubAddress}) set on Paymaster(${WhitelistPaymaster.address})`)
  await ethersProvider.getSigner(0).sendTransaction({
    to: WhitelistPaymaster.address,
    value: ethers.utils.parseEther('1.0')
  })
  console.log(`1 ETH deposited to Paymaster(${WhitelistPaymaster.address})`)
}
