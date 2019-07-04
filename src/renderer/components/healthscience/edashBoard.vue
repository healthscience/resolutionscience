<template>
  <div id="dashboard-view">
    <header v-if="experimentDash.length !== 0" >Dashboard for experiment {{ experimentDash.cnrl }} {{ liveEntities }}</header>
    <div id="exerpiment-name"> Experiment: {{ experimentDash.contract.prime.text }} </div>
    <div id="exerpiment-livingpaper"> LivingPaper: {{ experimentDash.contract.livingpaper.link }} </div>
    <expvisual></expvisual>
    <expvisual></expvisual>
  </div>
</template>

<script>
  import expvisual from '@/components/healthscience/expVisual'
  export default {
    name: 'visual-liveview',
    components: {
      expvisual
    },
    props: {
      dashcollection: {
        type: Object
      },
      options: {
        type: Object
      },
      displayTime: ''
    },
    data () {
      return {
        experimentCNRL: 'empty'
      }
    },
    computed: {
      experimentDash: function () {
        return this.$store.state.experimentCNRL
      },
      liveEntities: function () {
        return this.$store.state.expEntities
      }
    },
    created () {
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style>
#dashboard-view {
  border: 2px solid orange;
  margin: 2em;
  width: 98%;
}
</style>
