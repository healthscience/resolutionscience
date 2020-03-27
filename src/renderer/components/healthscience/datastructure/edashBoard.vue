<template>
  <div id="dashboard-holder"> <!-- v-if="moduleContent" -->
    <div id="dash-modules"> modCNRL -- {{ moduleCNRL }}
      content per module {{ moduleContent }}
      <module-board @close="closeModule">
        <template v-slot:header>
        <!-- The code below goes into the header slot -->
          MODULE {{ moduleContent.prime.text }}
        </template>
        <template v-slot:body>
        <!-- The code below goes into the header slot -->
          <header>CONTENT</header>
          <!-- <div id="dashboard-grid" >
            <div class='layoutJSON'>
                Displayed as <code>[x, y, w, h]</code>
                <div class='columns'> currstart--- {{ currentLayout }}
                    <div class='layoutItem' v-for='item in currentLayout' :key='item.id'>
                        <b>{{item.i}}</b>:  [{{item.x}}, {{item.y}}, {{item.w}}, {{item.h}}]
                    </div>
                </div>
            </div>
          </div>-->
          <div id="module-toolbar">
            <header>TOOLBAR---</header>
            <!-- <button @click='decreaseWidth'>Decrease Width</button>
            <button @click='increaseWidth'>Increase Width</button> -->
            <button @click='addItem'>Add an item</button>
            <input type='checkbox' v-model='draggable'/> Draggable
            <input type='checkbox' v-model='resizable'/> Resizable
            <br/> <!-- @changes="updateLayout"  -->
            layoutDataObject-- {{ layout }}
            <grid-layout v-if="layout"
                         :layout='layout'
                         :col-num='12'
                         :row-height='30'
                         :is-draggable='draggable'
                         :is-resizable='resizable'
                         :vertical-compact='true'
                         :use-css-transforms='true'
            >
              <grid-item v-for='item in layout' :key='item.id'
                         :static='item.static'
                         :x='item.x'
                         :y='item.y'
                         :w='item.w'
                         :h='item.h'
                         :i='item.i'
                      >
                  <span class='text'>kbid holder box{{itemTitle(item)}}</span>
                  module type --- {{ moduleType }} ii {{ moduleContent.prime.vistype }} md -- {{ moduleContent.data }}
                  <component v-bind:is="moduleContent.prime.vistype" :moduleCNRL="moduleContent.prime.cnrl" :mData="moduleContent.data"></component>
                  <!-- <nxp-visualise :moduleCNRL="mod"></nxp-visualise> -->
                  {{ item.i }} --
              </grid-item>
            </grid-layout>
          </div>
        </template>
      </module-board>
    </div>
  </div>
</template>

<script>
  import ModuleBoard from './moduleBoard.vue'
  import VueGridLayout from 'vue-grid-layout'
  // import progressMessage from '@/components/toolbar/inProgress'
  // import learnReport from '@/components/reports/LearnReport'
  // import learnAction from '@/components/reports/LearnAction'
  import nxpVisualise from '@/components/healthscience/nxp/nxpVisualise.vue'
  import nxpPlain from '@/components/visualise/plainBoard.vue'
  // const moment = require('moment')

  export default {
    name: 'visual-dashview',
    components: {
      ModuleBoard,
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
      nxpVisualise,
      nxpPlain
      // progressMessage,
      // learnReport,
      // learnAction
    },
    props: {
      moduleCNRL: '',
      shellCNRL: ''
    },
    computed: {
      dashState: function () {
        let dashStateNXP = this.$store.state.experimentStatus
        return dashStateNXP[this.shellCNRL]
      },
      moduleContent: function () {
        console.log('module holder')
        console.log(this.$store.state.NXPexperimentStatus)
        let contentModule = this.$store.state.NXPexperimentStatus // [{'kbid': {'id': '2323232323'}}]
        return contentModule[this.shellCNRL][this.moduleCNRL]
      },
      kBundles: function () {
        console.log('kbids per module')
        let cnrlKBIDS = this.$store.state.NXPexperimentKBundles
        return cnrlKBIDS[this.moduleCNRL]
      },
      layout: function () {
        console.log('dashboard grid vue')
        console.log(this.$store.state.dashboardGrid)
        let cnrlGrid = this.$store.state.dashboardGrid
        return cnrlGrid[this.shellCNRL]
      }
    },
    data () {
      return {
        moduleType: 'nxp-visualise',
        draggable: true,
        resizable: true,
        index: 0,
        peerChart: {},
        chartUI:
        {
          analysisStart: 'd----',
          analysisEnd: '---dd-'
        }
      }
    },
    created () {
    },
    mounted () {
    },
    methods: {
      closeModule () {
        console.log('close module')
      },
      itemTitle (item) {
        var result = item.i
        if (item.static) {
          result += ' - Static'
        }
        return result
      },
      /*
      increaseWidth: function (item) {
          var width = document.getElementById('content').offsetWidth;
          width += 20;
          document.getElementById('content').style.width = width+'px';
      },
      decreaseWidth: function (item) {

          var width = document.getElementById('content').offsetWidth;
          width -= 20;
          document.getElementById('content').style.width = width+'px';
      },
      removeItem: function(item) {
          //console.log('### REMOVE ' + item.i);
          this.layout.splice(this.layout.indexOf(item), 1);
      }, */
      addItem () {
        // console.log('### LENGTH: ' + this.layout.length);
        var item = { 'x': 0, 'y': 0, 'w': 2, 'h': 2, 'i': this.index + '', whatever: 'bbb' }
        this.index++
        // this.layout.push(item)
        this.$store.dispatch('actionGrideupdateItem', item)
      },
      setDashTime () {
        // call action to update state
        this.updateChartOptions()
      },
      updateChartOptions () {
        let optState = {}
        optState.syncOptions = []
        optState.expCNRL = this.moduleCNRL
        // this.$store.dispatch('actionUpdateChartOptions', optState)
      }
    }
  }
</script>

<style>
#dashboard-view {
  border: 2px solid white;
  margin: 2em;
  width: 98%;
}

header {
  margin-bottom: 12px;
  font-weight: bold;
}

.summary-item {
  display: inline-block;
  margin-left: 20px;
  font-weight: bold;
  font-size: 1.4em;
}

#progess {
  margin-left: 2em;
}

.vue-grid-layout {
    border: 5px solid black;
    background: #eee;
}

.layoutJSON {
    background: #ddd;
    border: 1px solid black;
    margin-top: 10px;
    padding: 10px;
}

.eventsJSON {
    background: #ddd;
    border: 1px solid black;
    margin-top: 10px;
    padding: 10px;
    height: 100px;
    overflow-y: scroll;
}

.columns {
    -moz-columns: 120px;
    -webkit-columns: 120px;
    columns: 120px;
}

/*.vue-resizable-handle {
    z-index: 5000;
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: 0;
    right: 0;
    background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=');
    background-position: bottom right;
    padding: 0 3px 3px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: se-resize;
}*/

.vue-grid-item:not(.vue-grid-placeholder) {
    background: #ccc;
    border: 3px solid red;
}

.vue-grid-item.resizing {
    opacity: 0.9;
}

.vue-grid-item.static {
    background: #cce;
}

.vue-grid-item .text {
    font-size: 24px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 100%;
    width: 100%;
}

.vue-grid-item .no-drag {
    height: 100%;
    width: 100%;
}

.vue-grid-item .minMax {
    font-size: 12px;
}

.vue-grid-item .add {
    cursor: pointer;
}

.vue-draggable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
    background-position: bottom right;
    padding: 0 8px 8px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: pointer;
}

#dash-modules ul {
  border: 1px solid grey;
  margin: 1em;
  list-style: none;
}
</style>
