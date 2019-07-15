<template>
  <div id="oracle-view">TENDS {{ imgS }}
  <img src="require(imgS)" />
    <ul v-if="experimentTrends.length !== 0" >
      <li class="trend-item" v-for="(expT, index) in experimentTrends">
        <div id="live-trend-element">{{ index }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'oracle-trends',
    components: {
    },
    props: {
    },
    data () {
      return {
        experimentTrends: [],
        trendIcon: [],
        imgS: '~@/assets/green-better.png'
      }
    },
    created () {
    },
    computed: {
    },
    mounted () {
      this.tremdsStart()
    },
    methods: {
      tremdsStart () {
        this.experimentTrends = this.$store.getters.liveExperimentList
        this.trendIcon = [{'url': './assets/green-better.png', 'alt': 'better trend'}, {'url': '~@/assets/orange-neutral.png', 'alt': 'neutral trend'}]
        // this.trendIcon = [{'url': 'green-better.png', 'alt': 'better trend'}, {'url': 'orange-neutral.png', 'alt': 'neutral trend'}]
      }
    }
  }
</script>

<style>
.trend-item {
  border: 1px solid orange;
  display: inline-block;
  padding: 2em;
}

</style>
