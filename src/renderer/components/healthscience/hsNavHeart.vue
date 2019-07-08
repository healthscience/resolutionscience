<template>
  <section class="container">
    <section id="knowledge">
      <div id="experiment-learn" class="live-element">
        <div id="experiment-learn-container">
          <div id="experiment-view">
            <a href="" id="experiment-button" @click.prevent="viewExperiment(exper)" v-bind:class="{ 'active': exper.active}">{{ exper.name }}</a>
          </div>
        </div>
      </div>
      <div id="experiments" v-if="exper.active">
        <experiment-List :experimentData="KLexperimentData" ></experiment-List>
      </div>
    </section>
  </section>
</template>

<script>
  import SAFEflow from '../../safeflow/safeFlow.js'
  import experimentList from '@/components/toolbar/experimentList.vue'
  import { sBus } from '../../main.js'

  export default {
    name: 'VueChartJS',
    components: {
      experimentList
    },
    data () {
      return {
        liveSafeFlow: null,
        exper:
        {
          name: 'View experiments',
          id: 'learn-experiments',
          active: false
        },
        liveDataCollection: {},
        liveOptions: {},
        liveAnnotations: {},
        liveSelectTime: 'ppp',
        liveanalysisStart: 'select',
        liveanalysisEnd: 'select',
        startLine: '',
        activeEntity: '',
        liveBundle: {},
        liveExper: [],
        liveTimeV: 'time',
        chartmessage: {
          text: 'compute status = stopped',
          active: false
        }
      }
    },
    computed: {
      system: function () {
        return this.$store.state.system
      }
    },
    mounted () {
    },
    created () {
      this.setAccess()
      this.experimentsStart()
      sBus.$on('saveLBundle', (cData) => {
        console.log('NOT USED')
      })
    },
    methods: {
      setAccess () {
        this.liveSafeFlow = new SAFEflow(this.system)
      },
      viewExperiment (exper) {
        exper.active = !exper.active
        // query CNRL to get live EXPERIMENTS
        this.$emit('liveExperiments')
        if (exper.active === true) {
          exper.name = 'Close experiment'
        } else {
          exper.name = 'View experiments'
        }
      },
      makeLiveExperiment () {
        // make experiment dashboard ie. all visualisation, setting and ptop status numbers etc.
        console.log('live experiment dashboard')
      },
      experimentsStart () {
        console.log('get experiments')
        this.liveExper = []
        let experimentList = this.liveSafeFlow.cnrlExperimentIndex()
        for (let exl of experimentList) {
          let expCNRL = this.liveSafeFlow.cnrlLookup(exl)
          let experBundle = {}
          experBundle.cnrl = exl
          experBundle.status = false
          experBundle.contract = expCNRL
          this.liveExper.push(experBundle)
        }
        this.KLexperimentData = this.liveExper
        this.$store.dispatch('actionExperimentList', this.liveExper)
      }
    }
  }
</script>

<style scoped>
a {
  color: #42b983;
}

.active{
  background-color:#8ec16d;
  color: white;
}
</style>
