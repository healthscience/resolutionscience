<template>
  <div id="k-toolkit">
    VISUALISE
    <progress-Message :progressMessage="entityPrepareStatus"></progress-Message>
    <div id="add-experiment">
      <div v-if="timeSelect" id="time-select" >
        <div id="start-point" class="context-selecttime">Start: {{ kContext.analysisStart }}</div>
        <div id="end-point" class="context-selecttime">End: {{ kContext.analysisEnd }}</div>
      </div>
      <div id="save-component">
          <button @click.prevent="startStatusSave()">SAVE</button>
          <transition name="fade" >
            <div v-if="saveStatusEK.active === true" id="confirm-add-experiment">{{ saveStatusEK.text }}</div>
          </transition>
      </div>
    </div>
    <multipane class="custom-resizer" layout="vertical">
      <multipane-resizer></multipane-resizer>
      <div class="pane" :style="{ width: '50%', maxWidth: '100%' }">
        <div>
          <hsvisual @experimentMap="saveMappingExpKB" @updateLearn="navTimeLearn" :datacollection="liveDataCollection" :options="liveOptions" :displayTime="liveTimeV" :navTime="liveNavTime" :makeTimeBundles="buildTimeBundles" :tablecollection="liveTable"></hsvisual>
        </div>
      </div>
      <multipane-resizer></multipane-resizer>
      <div class="pane" :style="{ flexGrow: 1, width: '10%', maxWidth: '100%' }">
        <div>
          <hsfuturevisual @experimentMap="saveMappingExpKB" @updateLearn="navTimeLearn" :datacollection="futureliveDataCollection" :options="futureliveOptions" :displayTime="liveTimeVFuture" :navTime="liveNavTime" :makeTimeBundles="buildTimeBundles"></hsfuturevisual>
        </div>
      </div>
    </multipane>
  </div>
</template>

<script>
  import progressMessage from '@/components/toolbar/inProgress'
  import hsvisual from '@/components/healthscience/datastructure/hsvisual'
  import hsfuturevisual from '@/components/healthscience/datastructure/hsfuturevisual'
  import pastfuture from '@/components/healthscience/datastructure/pastfuture'
  import { Multipane, MultipaneResizer } from 'vue-multipane'

  export default {
    name: 'nxp-question',
    components: {
      progressMessage,
      hsvisual,
      hsfuturevisual,
      Multipane,
      MultipaneResizer,
      pastfuture
    },
    data: () => ({
      entityPrepareStatus:
      {
        active: false,
        text: 'Preparing visualisation'
      },
      timeSelect: true,
      kContext: {},
      saveStatusEK: {}
    }),
    created () {
    },
    mounted () {
    },
    computed: {
    },
    methods: {
      async navTimeLearn (uSeg) {
        let updateTbundle = {}
        let timeAsk = []
        // did UI give nav segment or date from calendar?
        if (uSeg.text === 'selectd') {
          updateTbundle.visualisation = ['vis-sc-1', 'vis-sc-2']
          // convert time to correct format
          timeAsk.push('day')
          let updateTime = {}
          updateTime.startperiod = uSeg.selectDate
          updateTime.timeseg = this.liveData.timeLive
          updateTime.timevis = timeAsk
          updateTime.laststartperiod = this.liveTimeV
          updateTbundle.time = updateTime
          this.$store.dispatch('actionLiveBundleNav', updateTbundle)
          let updatedBundleSet = this.$store.getters.liveBundle
          this.entityPrepareStatus.active = true
          this.learnManager(updatedBundleSet)
        } else if (uSeg.text === 'timeList') {
          let updateTime = {}
          updateTime.startperiod = uSeg.selectDate
          updateTime.timeseg = this.liveData.timeLive
          updateTime.timevis = timeAsk
          updateTime.laststartperiod = this.liveTimeV
          updateTbundle.time = updateTime
          this.prepareMultiLearn(updateTbundle, uSeg.timelist)
        } else {
          // time setTimeSegments
          // updateTbundle.visualisation = ['vis-sc-1', 'vis-sc-2']
          timeAsk.push(uSeg.text)
          // timeAsk.push('day')
          let updateTimen = {}
          updateTimen.startperiod = 'relative'
          updateTimen.timeseg = this.liveData.timeLive
          updateTimen.timevis = timeAsk
          updateTimen.laststartperiod = this.liveTimeV
          updateTbundle.time = updateTimen
          this.$store.dispatch('actionLiveBundleNav', updateTbundle)
          let updatedBundleSetN = this.$store.getters.liveBundle
          this.entityPrepareStatus.active = true
          this.learnManager(updatedBundleSetN)
        }
        // pass on to learn safeFlow
      },
      async prepareMultiLearn (liveKB, timeList) {
        let updateTbundle = {}
        let timeAsk = []
        this.buildTimeBundles = []
        for (let tl of timeList) {
          let updateTime = {}
          timeAsk.push('day')
          updateTime.startperiod = tl
          updateTime.timeseg = this.liveData.timeLive
          updateTime.timevis = timeAsk
          updateTime.laststartperiod = this.liveTimeV
          updateTbundle.time = updateTime
          this.$store.dispatch('actionLiveBundleNav', updateTbundle)
          let updatedBundleSet = this.$store.getters.liveBundle
          let visDataBack = await this.learnStart(updatedBundleSet)
          this.buildTimeBundles.push(visDataBack)
        }
        return true
      }
    }
  }
</script>

<style>
</style>
