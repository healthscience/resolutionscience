<template>
  <div id="history-view">
    <header>HISTORY</header>
  <ul>
    <li id="data-type-history" v-for="lh in historyData">--histd-- {{ lh }}
      <div id="live-knowledge-elements">
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
        <div id="context-time" class="live-element">
          <header>Time:</header>
            <ul>
              <li v-for="ts in lh.time">
                 <div class="live-item">{{ ts }}</div>
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
              <header>View on Start</header>
              <a href="" id="start-save" v-bind:id="lh.kbid" @click.prevent="startStatus(lh.startStatus, $event)" v-bind:class="{ 'active': lh.startStatus.active}">{{ lh.startStatus.name }}</a>
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
        <div id="select-kbox" class="live-element">
          <div id="select-kbox-container">
            <div id="select-status">
              <header>Select</header>
              <input type="checkbox" v-bind:id="lh.cnrl" v-bind:value="lh.kbid" v-model="kboxSelect" @change="makeKLive($event)">
              <label for="k-select"></label>
            </div>
          </div>
        </div>
        <div id="learn-close"></div>
        <div id="compute-control-panel">
          <header>compute control panel</header>
          <div class="compute-control-item">
            <header>Status:</header>
              <div id="update-status">
              {{ cStatus }}
              </div>
          </div>
          <div class="compute-control-button">
            <button id="compute-start" v-bind:id="lh.kbid" @click.prevent="filterStartCompute($event)">Start</button>
          </div>
          <div class="compute-control-button">
            <button id="compute-stop">Stop:</button>
          </div>
          <div class="compute-control-item">
            <header>Repeat</header>
            <b>Manual</b> --- AUTO
          </div>
          <div class="compute-control-item">{{ entityPrepareStatus[lh.kbid] }}
            <progress-Message v-bind:progressMessage="entityPrepareStatus[lh.kbid]"></progress-Message>
          </div>-a- {{ entityPrepareStatus[lh.kbid] }}
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
        entityPrepareStatus: {}
      }
    },
    created () {
      this.startKup()
    },
    computed: {
      startK: function () {
        return this.$store.state.startBundles
      }
    },
    mounted () {
    },
    mixins: [liveMixinSAFEflow],
    methods: {
      startKup () {
        this.$store.dispatch('actionComputeStatus')
        if (this.startK.length > 0) {
          this.historyData = this.$store.getters.startBundlesList
          this.entityPrepareStatus = this.$store.getters.liveKComputeStatus
          console.log('compute status')
          console.log(this.entityPrepareStatus)
        }
      },
      async makeKLive (status) {
        console.log('make live kbundle')
        console.log(status)
        // loop over arry of bundles and match bid number and make active
        if (status.target.checked === true) {
          for (let ukb of this.historyData) {
            let makeInt = status.target.value
            if (ukb.kbid === makeInt) {
              this.$emit('setLiveBundle', ukb)
            }
          }
        }
      },
      startStatus (lss, se) {
        // change start status and save or delete settings
        let startInt = se.target.value
        // this.$store.dispatch('actionUpdateBundleItem', startInt)
        let updateBundle = this.$store.getters.startBundlesList
        for (let iB of updateBundle) {
          if (iB.kbid === startInt) {
            this.saveStartBundle(iB)
          }
        }
      },
      filterStartCompute (fsc) {
        console.log('compute ID')
        let computeEntityKID = fsc.target.id
        // create compute progress entry for this Kbid
        this.computeProgressLive(computeEntityKID)
        console.log('new status compute progress')
        console.log(this.entityPrepareStatus)
        this.updateCompute(computeEntityKID)
      },
      async updateCompute (updateC) {
        console.log('update compute no visualisation')
        // loop over arry of bundles and match bid number and make active
        for (let ukb of this.historyData) {
          if (ukb.kbid === updateC) {
            console.log('match' + updateC)
            // this.$emit('setLiveBundle', ukb)
          }
        }
      },
      computeProgressLive (computeEntityKID) {
        this.$store.dispatch('actionUpdateComputeStatus', computeEntityKID)
        this.entityPrepareStatus = this.$store.getters.liveKComputeStatus
        console.log('update status compute')
        console.log(this.entityPrepareStatus)
      }
    }
  }
</script>

<style>
#live-view {
  border: 2px solid lightgrey;
  margin-left: 1em;
}

.live-element {
  float: left;
  width: 140px;
  word-wrap: break-word;
}

.live-element header {
  background-color: #EBE7E0;
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
  background-color: #FCE8C1;
}

.compute-control-item {
  display: inline-block;
  margin: 1em;
  width: 140px;
}

.compute-control-item header {
  background-color: #EBE7E0;
  border-bottom: 2px dotted #6F6B63;
  margin: 4px;
}

.compute-control-button {
  display: inline-block;
  margin: 1em;
  width: 40px;
  padding: 30px;
}

#compute-start {
  padding: 1em;
}

#compute-stop {
  padding: 1em;
}

</style>
