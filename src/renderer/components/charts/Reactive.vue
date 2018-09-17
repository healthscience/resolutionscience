<script>
  import {Bar, mixins} from 'vue-chartjs'
  const { reactiveProp } = mixins
  export default Bar.extend({
    mixins: [reactiveProp],
    data () {
      return {
        options: {
          responsive: true,
          hoverMode: 'index',
          stacked: false,
          title: {
            display: true,
            text: 'Device Raw Data Charting'
          },
          scales: {
            yAxes: [{
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: 'left',
              id: 'bpm',
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Beats Per Minute Heart Rate'
              }
            }, {
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: 'right',
              id: 'steps',
              // grid line settings
              gridLines: {
                drawOnChartArea: false // only want the grid lines for one axis to show up
              },
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Number of Steps'
              }
            }]
          }
        }
      }
    },
    mounted () {
      // this.chartData is created in the mixin
      // console.log(this.chartData)
      // console.log(reactiveProp)
      this.renderChart(this.chartData, this.options)
    }
  })
</script>
