<template>
  <div id="oracle-view">TENDS
    <!-- <ul v-if="experimentTrends.length !== 0" >
      <li class="trend-item" v-for="(expT, index) in experimentTrends">
        <div id="live-trend-element">{{ index }}
          <p>{{ trendIcon[index] }}</p>
          <img class="smaller-trends-icons" :src="trendIcon[index].url" />
        </div>
      </li>
    </ul> -->
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
      // this.tremdsStart()
    },
    methods: {
      tremdsStart () {
        this.experimentTrends = this.$store.getters.liveExperimentList
        this.trendIcon = [{'text': 'Daily Step Planning?', 'url': orangeNeutral, 'alt': 'better trend'}, {'text': 'Sleep', 'url': orangeNeutral, 'alt': 'neutral trend'}, {'text': 'Recovery heart rate?', 'url': orangeNeutral, 'alt': 'better trend'}, {'text': 'Air quality', 'url': orangeNeutral, 'alt': 'neutral trend'}, {'text': 'Intermitting fasting?', 'url': orangeNeutral, 'alt': 'better trend'}, {'text': 'Stem cell recovery help?', 'url': orangeNeutral, 'alt': 'neutral trend'}, {'text': 'CALE update', 'url': orangeNeutral, 'alt': 'neutral trend'}, {'text': 'Mitochondrial therapy', 'url': orangeNeutral, 'alt': 'neutral trend'}]
        // this.trendIcon = [{'url': 'green-better.png', 'alt': 'better trend'}, {'url': 'orange-neutral.png', 'alt': 'neutral trend'}]
      }
    }
  }
</script>

<style>
.trend-item {
  border: 1px solid lightgrey;
  display: inline-block;
  padding: 0em;
  margin: 1.1em;
}

.smaller-trends-icons {
  width: 20px;
  height: 20px;
}
</style>
