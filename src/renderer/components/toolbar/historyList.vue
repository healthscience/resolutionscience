<template>
  <div id="history-view">
  <header>Compute List</header>
  <div id="filter-history-list">
    FILTERS - latest, per device, per compute, per datatype
  </div>
  <ul>
    <li id="data-type-history" v-for="(lh, index) in historyData" v-bind:key="lh.kbid">
      <div id="list-knowledge-elements">
        <div id="select-kbox" class="select-element">
          <div id="select-kbox-container">
            <div id="select-status">
              <header>Select</header>
              <input type="checkbox" v-bind:id="lh.cnrl" v-bind:value="lh.kbid" v-model="kboxSelect" @change="makeKLive($event)">
              <label for="k-select"></label>
            </div>
          </div>
        </div>
        <div id="history-context-science" class="live-element">
          <header>Compute</header>
          <div class="live-item">{{ lh.science.prime.text }}</div>
        </div>
        <div id="context-language" class="live-element">
          Language: <div class="live-item">{{ lh.language.word }}</div>
        </div>
        <div id="live-context-devices" class="live-element">
          <header>Devices:</header>
            <ul>
              <li v-for="dev in lh.devices">
                 <div class="live-item">{{ dev.device_name }}</div>
              </li>
            </ul>
        </div>
        <div id="live-context-datatypes" class="live-element">
          <header>DataTypes - </header>
            <ul>
              <li id="bmp-data-sensor" v-for="dts in lh.datatypes">
                <div class="live-item">{{ dts.text }}</div>
              </li>
              <li>
                <header>Category</header>
                  <div id="live-context-category" class="live-element">
                    <ul>
                      <li id="cat-items" v-for="catL in lh.categories">
                        <div class="live-item">{{ catL.text }}</div>
                      </li>
                    </ul>
                  </div>
              </li>
            </ul>
        </div>
        <div id="context-time" class="live-element" >
          <header>Time:</header>
            <ul>
              <li>
                 <div class="live-item">{{ parseTime[lh.kbid].startperiod}}</div>
              </li>
              <li>
                 <div class="live-item">{{ parseTime[lh.kbid].timeseg[0]}}</div>
              </li>
            </ul>
        </div>
        <div id="context-resolution" class="live-element">
          <header>Resolution:</header>
            <div class="live-item">{{ lh.resolution }}</div>
        </div>
        <div id="open-on-start" class="live-element">
          <div id="start-learn-container">
            <div id="start-status">
              <header>Save compute</header>
              <a href="" v-bind:id="lh.kbid" v-bind:value="lh.kbid" @click.prevent="startStatusSave($event)" v-bind:class="{ 'active': lh.startStatus.active}">{{ lh.startStatus.name }}</a>
              <button @click.prevent="removeCompute(lh.kbid)">Remove</button>
            </div>
          </div>
        </div>
        <div id="publish-dapp" class="live-element">
          <div id="dapp-publish-container">
            <div id="dapp-status">
              <header>Publish Dapp</header>
              Y / N
            </div>
          </div>
        </div>
        <div id="learn-close"></div>
        <button @click.prevent="SeenStartCompute($event)"  v-bind:value="lh.kbid" id="view-compute-controls">View controls</button>
        <div v-if="entityPrepareStatus[lh.kbid].seen" id="compute-control-panel">
          <header>compute control panel</header>
          <div class="compute-control-item">
            <header>Status:</header>
              <div id="update-status">
              {{ entityPrepareStatus[lh.kbid].update }}
              </div>
          </div>
          <div class="compute-control-button">
            <button @click.prevent="filterStartCompute($event)"  v-bind:value="lh.kbid" id="compute-start">Start</button>
          </div>
          <div class="compute-control-button">
            <button id="compute-stop">Stop:</button>
          </div>
          <div class="compute-control-item" id="repeat-select">
            <header>Repeat</header>
            <div>
              <b>Manual</b> --- AUTO
            </div>
          </div>
          <div class="compute-control-itemmedium" id="dashboard-select">
            <header>Dashboards</header>
            <div>
            <b>Live</b>
              <ul v-for="dxp in mappedExps[lh.kbid]">
                <li>
                  {{ dxp.text }}
                  <button @click.prevent="removeDashboard(lh.kbid)">Remove</button>
                </li>
              </ul>
            </div>
          </div>
          <div class="compute-control-item">
            <progress-Message v-bind:progressMessage="entityPrepareStatus[lh.kbid]"></progress-Message>
          </div>
        </div>
      </div>
    </li>
  </ul>
  </div>
</template>

<script>
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'
  import progressMessage from '@/components/toolbar/inProgress'
  // import { sBus } from '../../main.js'
  const moment = require('moment')

  export default {
    name: 'knowledge-history',
    components: {
      progressMessage
    },
    props: {
      historyData: {
        type: Array
      }
    },
    data () {
      return {
        kboxSelect: [],
        activeListEntities: {},
        liveMapExpKbsB: [],
        liveExperimentList: [],
        liveExperimentB: [],
        cStatus: 'needs updating',
        entityPrepareStatus: {},
        controlsSeen: {},
        dashboardElement: {},
        computeEntityKID: '',
        timeClean: {}
      }
    },
    created () {
      this.startKup()
    },
    computed: {
      startK: function () {
        return this.$store.state.startBundles
      },
      liveexerimentList: function () {
        return this.$store.state.experimentList
      },
      livemapExperimentKbundles: function () {
        return this.$store.state.mapExperimentKbundles
      },
      mappedExps: function () {
        return this.mappJOIN()
      },
      parseTime: function () {
        return this.parseTimeSaved()
      }
    },
    mounted () {
    },
    mixins: [liveMixinSAFEflow],
    methods: {
      startKup () {
        const nowTime = moment()
        let startPeriodTime = moment.utc(nowTime).startOf('day')
        let MSstartTime = moment(startPeriodTime).format('x')
        this.$store.dispatch('actionComputeStatus', MSstartTime)
        if (this.startK.length > 0) {
          // this.historyData = this.$store.getters.startBundlesList
          this.entityPrepareStatus = this.$store.getters.liveKComputeStatus
        }
      },
      async makeKLive (status) {
        // loop over array of bundles and match bid number and make active
        if (status.target.checked === true) {
          for (let ukb of this.historyData) {
            let makeInt = status.target.value
            if (ukb.kbid === makeInt) {
              // console.log('make live bundle')
              // console.log(ukb)
              this.$emit('setLiveBundle', ukb)
            }
          }
        }
      },
      startStatusSave (se) {
        // change start status and save or delete settings
        let startKID = se.target.id
        this.$store.dispatch('actionUpdateBundleItem', startKID)
        let updateBundle = this.$store.getters.startBundlesList
        for (let iB of updateBundle) {
          if (iB.kbid === startKID) {
            this.saveStartBundle(iB)
          }
        }
      },
      filterStartCompute (fsc) {
        let computeEntityKID = fsc.target.value
        // create compute progress entry for this Kbid
        this.computeProgressLive(computeEntityKID)
        this.updateCompute(computeEntityKID)
      },
      updateCompute (updateC) {
        // loop over arry of bundles and match bid number and make active
        for (let ukb of this.historyData) {
          if (ukb.kbid === updateC) {
            this.$emit('setLiveBundle', ukb)
          }
        }
      },
      computeSeenProgressLive (computeEntityKID) {
        this.$store.dispatch('actionUpdateSeenComputeStatus', computeEntityKID)
        this.entityPrepareStatus = this.$store.getters.liveKComputeStatus
      },
      computeProgressLive (computeEntityKID) {
        this.$store.dispatch('actionUpdateComputeStatus', computeEntityKID)
        this.entityPrepareStatus = this.$store.getters.liveKComputeStatus
      },
      SeenStartCompute (fsc) {
        this.computeEntityKID = fsc.target.value
        // create compute progress entry for this Kbid
        this.computeSeenProgressLive(this.computeEntityKID)
        // this.updateCompute(computeEntityKID)
      },
      mappJOIN () {
        let experPerCompute = []
        let compDashHolder = {}
        for (let tss of this.historyData) {
          for (let mapE of this.livemapExperimentKbundles) {
            if (tss.kbid === mapE.kbid) {
              for (let expDet of this.liveexerimentList) {
                if (mapE.experimentCNRL === expDet.cnrl) {
                  experPerCompute.push(expDet.contract.prime)
                }
              }
            }
          }
          compDashHolder[tss.kbid] = experPerCompute
          experPerCompute = []
        }
        return compDashHolder
      },
      removeCompute (removeID) {
        let keepHL = []
        for (let hls of this.historyData) {
          if (hls.kbid !== removeID) {
            keepHL.push(hls)
          }
        }
        this.$store.dispatch('actionStartKBundles', keepHL)
        // remove from viewDatastore
        this.removeStartBundle(removeID)
      },
      removeDashboard (removeID) {
        // need to dispatch to remove and datastore
        this.$store.dispatch('actionRemoveExpDashMap', removeID)
        // and remove from datastore
      },
      parseTimeSaved () {
        for (let tss of this.historyData) {
          let timeParser = tss.time // JSON.parse(tss.time)
          this.timeClean[tss.kbid] = timeParser
        }
        return this.timeClean
      }
    }
  }
</script>

<style>
#live-view {
  border: 1px solid lightgrey;
  margin-left: 1em;
}

.select-element {
  float: left;
  width: 40px;
}

.live-element {
  float: left;
  width: 140px;
  word-wrap: break-word;
}

.live-element header {
  background-color: #d7e6f5;
  border-bottom: 2px dotted #6F6B63;
  margin: 4px;
}

.live-item {
  font-weight: bold;
}
#learn-close {
  clear:both;
}

#learn-button {
  font-size: 1.6em;
  padding: .25em;

}

#data-type-history {
  margin: 1em;
  border: 1px solid grey;
  padding: 1em;
  background-color: #f1e6f5;
}

#compute-control-panel {
  background-color: #f2f6fa;
}

#compute-control-panel header {
  font-weight: bold;
}

.compute-control-item {
  display: inline-block;
  margin: 1em;
  width: 140px;
}

.compute-control-itemmedium {
  display: inline-block;
  margin: 1em;
  width: 340px;
}

.compute-control-item header {
  background-color: #EBE7E0;
  border-bottom: 2px dotted #6F6B63;
  margin: 4px;
}

.compute-control-button {
  display: inline-block;
  margin: 1em;
  width: 60px;
  padding: 30px;
}

#compute-start {
  padding: 1em;
  border: 2px solid green;
}

#compute-stop {
  padding: 1em;
  border: 2px solid red;
}

#repeat-select {
  margin-left: 40px;
}

#list-knowledge-elements {
  background-color: #EBE7E0;
}
</style>
