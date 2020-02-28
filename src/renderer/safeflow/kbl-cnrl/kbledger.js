'use strict'
/**
*  Knowledge Bundle Ledger
*
*
* @class KBLedger
* @package    KBLedger
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import CNRLmaster from './cnrlMaster.js'
import TestStorageAPI from '../systems/data/dataprotocols/teststorage/testStorage.js'
import DatadeviceSystem from '../systems/data/datadeviceSystem.js'
import DTsystem from '../systems/data/dtSystem.js'
import DataSystem from '../systems/data/dataSystem.js'
const util = require('util')
const events = require('events')
const crypto = require('crypto')
const bs58 = require('bs58')
const hashObject = require('object-hash')

var KBLedger = async function (apiCNRL, setIN) {
  events.EventEmitter.call(this)
  this.liveCNRL = new CNRLmaster(setIN)
  this.api = await this.liveCNRL.defautNetworkContracts(apiCNRL)
  this.livedeviceSystem = new DatadeviceSystem(this.settings)
  this.liveDataSystem = new DataSystem(setIN)
  this.liveDTsystem = new DTsystem(this.settings)
  this.liveTestStorage = new TestStorageAPI(this.settings)
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(KBLedger, events.EventEmitter)

/**
*  initialise forming of KBL
* @method genesisKBL
*
*/
KBLedger.prototype.genesisKBL = function () {
  let newLedger = 'new'
  return newLedger
}

/**
* build context for Toolkit
* @method toolkitContext
*
*/
KBLedger.prototype.toolkitContext = async function (flag, devices) {
  // first time start of device, datatype context for toolkitContext
  let localthis = this
  let apiData = []
  if (flag === 'device') {
    let devicesList = []
    for (let dapi of localthis.api.devicelist) {
      // look up the contract
      let apiDevice = this.liveCNRL.lookupContract(dapi)
      let getDevice = await this.livedeviceSystem.storedDevices(apiDevice)
      // need to pair device to API source CNRL
      getDevice.cnrl = dapi
      devicesList.push(getDevice)
    }
    // merg arrays
    let flatd = [].concat(...devicesList)
    apiData = flatd // await this.livedeviceSystem.systemDevice(dapi
  } else if (flag === 'dataType') {
    let dts = {}
    for (let dev of devices) {
      // loop up API and extract all datatypes CNRL ids
      dts[dev.device_mac] = this.cnrlDeviceDTs(dev.cnrl)
    }
    apiData = dts
  }
  return apiData
}

/**
* save or get start Status data
* @method startSettings
*
*/
KBLedger.prototype.startSettings = async function (flag, bundle) {
  console.log(flag)
  console.log(bundle)
  // first time start of device, datatype context for toolkitContext
  // let uuidBundle = this.createKBID(liveBundle)
  let startStatusData = []
  if (flag === 'save') {
    startStatusData = await this.liveDataSystem.saveStartStatus(bundle)
  } else if (flag === 'retreive') {
    startStatusData = await this.liveTestStorage.getStartSettings() // await this.liveDataSystem.getStartStatus()
  } else if (flag === 'remove') {
    startStatusData = await this.liveDataSystem.removeStartStatus(bundle)
  } else if (flag === 'removedash') {
    startStatusData = await this.liveDataSystem.removeStartDash(bundle)
  }
  return startStatusData
}

/**
*  list of Experiment Live in Ledger
* @method createKBID
*
*/
KBLedger.prototype.createKBID = function (addressIN) {
  // hash Object
  let kbundleHash = hashObject(addressIN)
  let tempTokenG = ''
  let salt = crypto.randomBytes(16).toString('base64')
  // let hashs = crypto.createHmac('sha256',salt).update(password).digest('base64')
  let hash = crypto.createHmac('sha256', salt).update(kbundleHash).digest()
  // const bytes = Buffer.from('003c176e659bea0f29a3e9bf7880c112b1b31b4dc826268187', 'hex')
  tempTokenG = bs58.encode(hash)
  // decode
  // const addressde = address
  // const bytes = bs58.decode(addressde)
  // console.log(bytes.toString('base64'))
  return tempTokenG
}

/**
*  list of Experiment Live in Ledger
* @method liveNetworkExperimentLedger
*
*/
KBLedger.prototype.liveNetworkExperimentLedger = function () {
  console.log('get experiments live in Ledger')
  let liveExperList = ['cnrl-848388553323', 'cnrl-888355992223', 'cnrl-888355992224', 'cnrl-888388992224', 'cnrl-888388232224', 'cnrl-888388233324', 'cnrl-888388443324']
  // await this.liveDataSystem.getExpKbundles()
  return liveExperList
}

/**
* mapping of Network Experiments to Kbundles entities save retrieve
* @method experimentKbundles
*
*/
KBLedger.prototype.experimentKbundles = async function (flag, data) {
  // first time start of device, datatype context for toolkitContext
  let startStatusData = []
  if (flag === 'save') {
    startStatusData = await this.liveTestStorage.saveExpKbundles(data)
  } else if (flag === 'retreive') {
    startStatusData = await this.liveTestStorage.getExpKbundles()
  }
  return startStatusData
}

/**
*  last Knowledge Bundles from Ledger
* @method latestKBs
*
*/
KBLedger.prototype.latestKBs = async function () {
  console.log('latestKBs')
  let lastestKBs = await this.liveDataSystem.getExpKbundles()
  return lastestKBs
}

/**
*  extract Computations
* @method extractComputations
*
*/
KBLedger.prototype.extractComputations = function () {
  console.log('extractComputations')
  let livecomputeList = ['cnrl-2356388731', 'cnrl-2356388737', 'cnrl-2356388732', 'cnrl-2356383848']
  return livecomputeList
}

/**
* call the CNRL on startup to get live science in network
* @method cnrlLivingKnowledge
*
*/
KBLedger.prototype.cnrlLivingKnowledge = function (refIN) {
  let startSemantics = this.liveCNRL.livingKnowledge(refIN)
  return startSemantics
}

/**
* compute time options
* @method cnrlTimeIndex
*
*/
KBLedger.prototype.cnrlTimeIndex = function (refIN) {
  let timeSegments = this.liveCNRL.timeContracts(refIN)
  return timeSegments
}

/**
* experiment index query
* @method cnrlExperimentIndex
*
*/
KBLedger.prototype.cnrlExperimentIndex = function () {
  let cnrlDetail = []
  let index = this.liveCNRL.indexExperiments()
  for (let ie of index) {
    // lookup contracts
    let cnrlContract = this.liveCNRL.lookupContract(ie)
    cnrlDetail.push(cnrlContract)
  }
  return cnrlDetail
}

/**
* datatype on CNRL network index query
* @method cnrlNetworkDatatypeIndex
*
*/
KBLedger.prototype.cnrlNetworkDatatypeIndex = function () {
  let cnrlDetail = []
  let index = this.liveCNRL.indexDatatypes()
  for (let ie of index) {
    // lookup contracts
    let cnrlContract = this.liveCNRL.lookupContract(ie)
    cnrlDetail.push(cnrlContract)
  }
  return cnrlDetail
}

/**
* computes on CNRL network index query
* @method cnrlNetworkComputeIndex
*
*/
KBLedger.prototype.cnrlNetworkComputeIndex = function () {
  let cnrlDetail = []
  let index = this.liveCNRL.indexCompute()
  for (let ie of index) {
    // lookup contracts
    let cnrlContract = this.liveCNRL.lookupContract(ie)
    cnrlDetail.push(cnrlContract)
  }
  return cnrlDetail
}

/**
* look up device data types and return in CNRL format
* @method cnrlDeviceDTs
*
*/
KBLedger.prototype.cnrlDeviceDTs = function (cid) {
  let cnrlContract = this.liveDTsystem.DTtableStructure(cid)
  // now convert to CNRL speak
  let convertedDTs = this.liveDTsystem.convertAPIdatatypeToCNRL(cnrlContract)
  cnrlContract.datatypes = convertedDTs
  return cnrlContract
}

/**
* look up science data types and return in CNRL format
* @method cnrlScienceDTs
*
*/
KBLedger.prototype.cnrlScienceDTs = function (cid) {
  let cnrlContract = this.liveDTsystem.DTscienceStructure(cid)
  return cnrlContract
}

/**
* call the CNRL and return data types for this science
* @method cnrlLookup
*
*/
KBLedger.prototype.cnrlLookup = function (cid) {
  let cnrlContract = this.liveCNRL.lookupContract(cid)
  return cnrlContract
}

export default KBLedger
