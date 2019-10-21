<template>
  <div id="learn-report">
    <header>REPORT</header>
    <!-- <div id="oracles">oracles</div>  -->
    <div id="tends">
      <header>trends - coming soon</header>
      <!-- <ul v-if="experimentTrends.length !== 0" >
        <li class="trend-item" v-for="(expT, index) in experimentTrends">
          <div id="live-trend-element">{{ index }}
            <p>{{ trendIcon[index] }}</p>
            <img class="smaller-trends-icons" :src="trendIcon[index].url" />
          </div>
        </li>
      </ul> -->
    </div>
    <div id="visulation-select"></div>
  </div>
</template>

<script>
  import greenBetter from '@/assets/green-better.png'
  import orangeNeutral from '@/assets/orange-neutral.png'

  export default {
    name: 'learn-report',
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
      system: function () {
        return this.$store.state.system
      },
      tools: function () {
        return this.$store.state.tools
      }
    },
    mounted () {
      this.tremdsStart()
    },
    methods: {
      tremdsStart () {
        this.experimentTrends = this.$store.getters.liveExperimentList
        this.trendIcon = [{'text': 'better', 'url': greenBetter, 'alt': 'better trend'}, {'text': 'neurtral', 'url': orangeNeutral, 'alt': 'neutral trend'}, {'text': 'better', 'url': greenBetter, 'alt': 'better trend'}, {'text': 'orange', 'url': orangeNeutral, 'alt': 'neutral trend'}, {'text': 'better', 'url': greenBetter, 'alt': 'better trend'}, {'text': 'neutral', 'url': orangeNeutral, 'alt': 'neutral trend'}, {'text': 'neutral', 'url': orangeNeutral, 'alt': 'neutral trend'}]
      }
    }
  }
</script>

<style>
#learn-report {
  margin: 1em;
  background-color: #cac8cc;
}

header {
  font-weight: bold;
}
</style>
