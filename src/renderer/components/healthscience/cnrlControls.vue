<template>
  <div id="add-new-cnrl">
    <header>CNRL network contributions</header>
    <ul>
      <li>
        <button class="new-describe-cnrl" @click.prevent="newDesAPI($event)">{{ newAPIseen.text }}</button>
      </li>
      <li>
        <button class="view-cnrl" id="experimentCNRL" @click.prevent="viewCNRL($event)">{{ CNRLexperimentseen.text }}</button>
      </li>
      <li>
        <button class="view-cnrl" id="datatypesCNRL" @click.prevent="viewCNRL($event)">{{ CNRLdatatypesseen.text }}</button>
      </li>
      <li>
        <button class="view-cnrl"  id="computeCNRL" @click.prevent="viewCNRL($event)">{{ CNRLcomputeseen.text }}</button>
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
        CNRLexperimentseen:
        {
          active: false,
          text: 'Experiments'
        },
        CNRLdatatypesseen:
        {
          active: false,
          text: 'Datatypes'
        },
        CNRLcomputeseen:
        {
          active: false,
          text: 'Compute'
        }
      }
    },
    created () {
    },
    mounted () {
    },
    computed: {
    },
    methods: {

    }
  }
</script>

<style>
.cnrl-element {
  display: inline-block;
  margin-bottom: 1em;
}
</style>
