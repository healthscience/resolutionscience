<script>
  import {Line, mixins} from 'vue-chartjs'
  const { reactiveProp } = mixins
  export default Line.extend({
    mixins: [reactiveProp],
    data () {
      return {
        options: {
          responsive: true,
          hoverMode: 'index',
          stacked: false,
          title: {
            display: true,
            text: 'Averages Per Device'
          },
          scales: {
            yAxes: [{
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: 'left',
              id: 'bpm',
              ticks: {
                beginAtZero: true
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
              }
            }]
          }
        }
      }
    },
    mounted () {
      // this.chartData is created in the mixin
      // console.log('mounted data reactive')
      // console.log(this.chartData)
      this.renderChart(this.chartData, this.options)
    }
  })
</script>
