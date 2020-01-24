<template>
  <div id="nxp-toolbar">Controls over NXPs
    <div id="nxp-master-toolbar">
      Dashboard
      <select v-model="liveexerimentList" class="button-expadd" href="" id="add-exp-button" @change="addToExperiment($event)">
        <option class="science-compute" v-for="expi in liveexerimentList" v-bind:value="expi.prime.cnrl">
          {{ expi.prime.text }}
        </option>
      </select>
      <div id="new-button">
        <button v-model="newNXP" class="button-new-nxp" href="" id="new-exp-button" @click.prevent="nxpNew($event)">New</button>
      </div>
    </div>
    <cnrl-controls></cnrl-controls>
  </div>
</template>

<script>
  import crnlControls from './cnrlControls.vue'

  export default {
    name: 'nxp-controls',
    components: {
      crnlControls
    },
    data () {
      return {
        saveStatusEK: {},
        saveExpKid:
        {
          active: false,
          text: ''
        },
        newAPIseen:
        {
          active: false,
          text: 'Add new'
        },
        CNRLdata: []
      }
    },
    created () {
    },
    mounted () {
    },
    computed: {
      liveexerimentList: function () {
        return this.$store.state.experimentList
      },
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
      addToExperiment (exB) {
        this.selectedExperiment = exB.target.value
      },
      experADD (expA) {
        // need to keep permanent store of experiments to Ecomponents linked (save, delete, update also)
        const localthis = this
        console.log(this.selectedExperiment)
        this.saveMappingExpKB(this.selectedExperiment)
        // this.$emit('experimentMap', this.selectedExperiment)
        setTimeout(function () {
          localthis.saveStatusEK.active = false
        }, 3000) // hide the message after 3 seconds
      }
    }
  }
</script>

<style>

</style>
