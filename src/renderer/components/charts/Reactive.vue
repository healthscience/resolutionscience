<script>
  import {Line, mixins} from 'vue-chartjs'
  const { reactiveProp } = mixins
  export default Line.extend({
    mixins: [reactiveProp],
    data () {
      return {
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: false
              }
            }],
            xAxes: [ {
              gridLines: {
                display: false
              }
            }]
          },
          legend: {
            display: false
          },
          responsive: true,
          maintainAspectRatio: true
        }
      }
    },
    mounted () {
      // this.chartData is created in the mixin
      console.log(this.chartData)
      this.renderChart(this.chartData, this.options)
    }
  })
</script>
