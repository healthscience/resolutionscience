<template>
  <div id="add-new-cnrl">
    <header>CNRL network contributions</header>
    <ul>
      <!-- <li class="view-cnrl" >
        <button class="new-describe-cnrl" @click.prevent="newDesAPI($event)">{{ newAPIseen.text }}</button>
      </li> -->
      <li class="view-cnrl" >
        <button class="view-cnrl" id="experimentCNRL" @click.prevent="viewCNRLcontract($event)">{{ CNRLexperimentseen.text }}</button>
      </li>
      <li class="view-cnrl" >
        <button class="view-cnrl" id="datatypesCNRL" @click.prevent="viewCNRLcontract($event)">{{ CNRLdatatypesseen.text }}</button>
      </li>
      <li class="view-cnrl" >
        <button class="view-cnrl"  id="computeCNRL" @click.prevent="viewCNRLcontract($event)">{{ CNRLcomputeseen.text }}</button>
      </li>
      <li class="view-cnrl" >
        <button class="view-cnrl"  id="visualiseCNRL" @click.prevent="viewCNRLcontract($event)">{{ CNRLvisualiseseen.text }}</button>
      </li>
    </ul>
    <new-API v-if="newAPIseen.active"></new-API>
    <view-CNRL v-if="statusCNRL.active" :cnrlLive="CNRLdata"></view-CNRL>
  </div>
</template>

<script>
  import newAPI from './newAPI.vue'
  import viewCNRL from './viewCNRL.vue'

  export default {
    name: 'cnrlview-controls',
    components: {
      newAPI,
      viewCNRL
    },
    props: {
      cnrlLive:
      {
        type: Array
      }
    },
    data () {
      return {
        statusCNRL:
        {
          active: false,
          type: ''
        },
        newAPIseen:
        {
          active: false,
          text: 'Add new'
        },
        CNRLexperimentseen:
        {
          active: false,
          text: 'Experiments'
        },
        CNRLdata: [],
        CNRLdatatypesseen:
        {
          active: false,
          text: 'Datatypes'
        },
        CNRLcomputeseen:
        {
          active: false,
          text: 'Compute'
        },
        CNRLvisualiseseen:
        {
          active: false,
          text: 'Visualise'
        }
      }
    },
    created () {
    },
    mounted () {
    },
    computed: {
      computeCNRL: function () {
        return this.$store.state.compute
      },
      datatypesCNRL: function () {
        return this.$store.state.datatypesCNRL
      },
      nxpCNRL: function () {
        return this.$store.state.NXPexperimentList
      }
    },
    methods: {
      viewCNRLcontract (cnrle) {
        this.statusCNRL.active = true
        this.statusCNRL.type = cnrle.target.id
        let cnrlActive = cnrle.target.id
        if (cnrlActive === 'experimentCNRL') {
          this.CNRLdata = this.nxpCNRL
        } else if (cnrlActive === 'datatypesCNRL') {
          this.CNRLdata = this.datatypesCNRL
        } else if (cnrlActive === 'computeCNRL') {
          this.CNRLdata = this.computeCNRL
        }
      }
    }
  }
</script>

<style>
.cnrl-element {
  display: inline-block;
  margin-bottom: 1em;
}

.view-cnrl {
  display: inline-block;
}
</style>
