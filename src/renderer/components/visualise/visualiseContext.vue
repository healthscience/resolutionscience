<template>
  <div id="k-toolkit">
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
          <hsvisual @experimentMap="saveMappingExpKB" @updateLearn="navTimeLearn" :datacollection="liveDataCollection" :options="liveOptions" :displayTime="liveTimeV" :navTime="liveNavTime" :makeTimeBundles="buildTimeBundles"></hsvisual>
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
  import hsvisual from '@/components/healthscience/datastructure/hsvisual'
  import hsfuturevisual from '@/components/healthscience/datastructure/hsfuturevisual'
  import { Multipane, MultipaneResizer } from 'vue-multipane'

  export default {
    name: 'nxp-question',
    components: {
      hsvisual,
      hsfuturevisual,
      Multipane,
      MultipaneResizer
    },
    data: () => ({
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
      chartSelect () {
        console.log('chart select type bar line mixed')
      }
    }
  }
</script>

<style>
</style>
