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
        type: Object,
        default: null
      }
    },
    watch: {
      optionsa: function () {
        console.log('watching for update chart data')
        this._chart.destroy()
        this.renderChart(this.chartData, this.options)
      },
      options: {
        deep: true,
        handler: function (val, oldVal) {
          console.log('watcheru')
          this._chart.destroy()
          this.renderChart(this.chartData, this.options)
        }
      }
    },
    /* watch: {
      chartData: function () {
        console.log('watching for update chart data')
        this._chart.destroy()
        this.renderChart(this.chartData, this.options)
      }
    } */
    /* watch: {
      'options': {
        handler () {
          this.renderChart(this.chartData, this.options)
        },
        deep: true
      }
    }, */
    mounted () {
      // this.chartData is created in the mixin
      // console.log(this.chartData)
      console.log('inmounted')
      console.log(this.options)
      // console.log(reactiveProp)
      this.renderChart(this.chartData, this.options)
    }
  })
</script>
