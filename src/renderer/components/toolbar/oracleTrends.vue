<template>
  <div id="oracle-view">TENDS
    <ul v-if="experimentTrends.length !== 0" >
      <li class="trend-item" v-for="(expT, index) in experimentTrends">
        <div id="live-trend-element">{{ index }}
          <p>{{ trendIcon[index].text }}</p>
          <img :src="trendIcon[index].url" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import greenBetter from '@/assets/green-better.png'
  import orangeNeutral from '@/assets/orange-neutral.png'
  // import redPoorer from '@/assets/red-poorer.png'

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
        imgS: greenBetter
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
        this.trendIcon = [{'text': 'How to sleep better?', 'url': greenBetter, 'alt': 'better trend'}, {'text': 'Active step advisor', 'url': orangeNeutral, 'alt': 'neutral trend'}, {'text': 'How to sleep better?', 'url': greenBetter, 'alt': 'better trend'}, {'text': 'Active step advisor', 'url': orangeNeutral, 'alt': 'neutral trend'}, {'text': 'How to sleep better?', 'url': greenBetter, 'alt': 'better trend'}, {'text': 'Active step advisor', 'url': orangeNeutral, 'alt': 'neutral trend'}, {'text': 'Active step advisor', 'url': orangeNeutral, 'alt': 'neutral trend'}]
        // this.trendIcon = [{'url': 'green-better.png', 'alt': 'better trend'}, {'url': 'orange-neutral.png', 'alt': 'neutral trend'}]
      }
    }
  }
</script>

<style>
.trend-item {
  border: 1px solid orange;
  display: inline-block;
  padding: 0em;
  margin: 1.1em;
}

</style>
