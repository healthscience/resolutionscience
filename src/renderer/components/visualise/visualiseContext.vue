<template>
  <div id="k-toolkit"> {{ nxpKbidsList }} {{ nxpKbids }}
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
          <hsvisual :datacollection="liveData.Collection" :options="liveData.Options" :displayTime="liveData.TimeV" :navTime="liveData.NavTime" :makeTimeBundles="liveData.buildTimeBundles"></hsvisual>
        </div>
      </div>
      <multipane-resizer></multipane-resizer>
      <div class="pane" :style="{ flexGrow: 1, width: '10%', maxWidth: '100%' }">
        <div>
          <hsfuturevisual :datacollection="futureliveDataCollection" :options="futureliveOptions" :displayTime="liveTimeVFuture" :navTime="liveNavTime" :makeTimeBundles="buildTimeBundles"></hsfuturevisual>
        </div>
      </div>
    </multipane>
  </div>
</template>

<script>
  import hsvisual from '@/components/visualise/hsvisual'
  import hsfuturevisual from '@/components/visualise/hsfuturevisual'
  import { Multipane, MultipaneResizer } from 'vue-multipane'

  export default {
    name: 'nxp-question',
    components: {
      hsvisual,
      hsfuturevisual,
      Multipane,
      MultipaneResizer
    },
    created () {
    },
    mounted () {
    },
    computed: {
      nxpKbidsList: function () {
        return this.$store.state.liveNXPbundleList
      },
      nxpKbids: function () {
        return this.$store.state.liveNXPbundle
      },
      liveData: function () {
        return this.$store.state.liveBundleData
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
