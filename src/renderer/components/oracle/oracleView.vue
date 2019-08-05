<template>
  <div id="oracle-view">ORACLE
    <oracle-Summary></oracle-Summary>
    <oracle-Trends></oracle-Trends>
  </div>
</template>

<script>
  import oracleSummary from '@/components/oracle/oracleSummary.vue'
  import oracleTrends from '@/components/oracle/oracleTrends.vue'

  export default {
    name: 'oracle-status',
    components: {
      oracleSummary,
      oracleTrends
    },
    props: {
    },
    data () {
      return {
      }
    },
    created () {
    },
    computed: {
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style>
</style>
