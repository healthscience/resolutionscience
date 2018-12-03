<script>
  import {Bar, mixins} from 'vue-chartjs'
  // eslint-disable-next-line
  import annotation from 'chartjs-plugin-annotation'
  // eslint-disable-next-line
  import draggable from 'chartjs-plugin-draggable'
  const { reactiveProp } = mixins

  export default Bar.extend({
    mixins: [reactiveProp],
    props: {
      options: {
        type: Object
      }
    },
    data () {
    },
    methods: {
      learnClicked () {
        console.log('called collect start analsys')
        // const startA = this.analysisStart
        // const endA = this.analysisEnd
        // pass to computations system
      }
    },
    mounted () {
      // this.chartData is created in the mixin
      // console.log(this.chartData)
      // console.log(this.options)
      // console.log(reactiveProp)
      this.renderChart(this.chartData, this.options)
    }
  })
</script>
