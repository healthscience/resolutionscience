<template>
  <div id="k-toolkit">chart
    Charts:
    <div id="chart-type">
      <ul>
        <li>
          <button @click.prevent="chartSelect()">Bar</button>
        </li>
        <li>
          <button @click.prevent="chartSelect()">Line</button>
        </li>
        <li>
          <button @click.prevent="chartSelect()">Mixed</button>
        </li>
        <li>
          <button @click.prevent="chartSelect()">Tools</button>
        </li>
      </ul>
    </div>
    <hsvisual :datacollection="liveData.Collection" :options="liveData.Options" :displayTime="liveData.TimeV" :navTime="liveData.NavTime" :makeTimeBundles="liveData.buildTimeBundles"></hsvisual>
    <!-- <div id="add-experiment">
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
    </div> -->
  </div>
</template>

<script>
  import hsvisual from '@/components/visualise/hsvisual'
  // import hsfuturevisual from '@/components/visualise/hsfuturevisual'

  export default {
    name: 'nxp-question',
    components: {
      hsvisual
    },
    created () {
    },
    mounted () {
    },
    computed: {
      liveData: function () {
        console.log('live data vis')
        console.log(this.$store.state.NXPexperimentStatus)
        return this.$store.state.NXPexperimentStatus
      }
    },
    data: () => ({
      timeSelect: true,
      kContext: {},
      saveStatusEK: {}
    }),
    methods: {
      chartSelect () {
        console.log('chart select type bar line mixed')
      }
    }
  }
</script>

<style>
</style>
