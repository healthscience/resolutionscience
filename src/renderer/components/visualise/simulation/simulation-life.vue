<template>
  <div id="simulation-live">
    <div id="heart-sim" >
      <header>Heart</header>
      <div id="sim-toolbar">
        <div id="sim-tools">
          2D 3D  Playback speed: Realtime  1/4/ 1/2 *2 *10
        </div>
        <button id="sim-controls">Play Start Stop Pause</button>
      </div>
    </div>
    <div id="movement-sim" >
      <header>Heart</header>
      <canvas id="heart-canvas-sim" width="400px" height="200px" ></canvas>
    </div>
    <div id="movement-sim" >
      <header>Movement</header>
      <canvas id="movement-canvas-sim" width="400px" height="200px" ></canvas>
    </div>
    <div id="time-sim" >
      <header>Time</header>
      <canvas id="time-canvas-sim" width="200px" height="200px" ></canvas>
    </div>
    <div id="clearFloat"></div>
    <heart-Canvas-Sim></heart-Canvas-Sim>
  </div>
</template>

<script>
  import heartCanvasSim from '@/components/visualise/simulation/heartCanvasSim.vue'

  export default {
    name: 'simulation-view',
    components: {
      heartCanvasSim
    },
    props: {
      simData: {
        type: Object
      }
    },
    data: () => ({
      canvas: null,
      ctx: null
    }),
    created () {
    },
    mounted () {
      this.simHeart()
      this.simMovement()
      this.startClock()
      console.log(this.simData)
    },
    computed: {
    },
    methods: {
      simHeart () {
        this.canvas = document.getElementById('heart-canvas-sim')
        this.ctx = this.canvas.getContext('2d')
        this.ctx.beginPath()
        this.ctx.arc(100, 75, 50, 0, 2 * Math.PI)
        this.ctx.stroke()
      },
      simMovement () {
        this.canvas = document.getElementById('movement-canvas-sim')
        this.ctx = this.canvas.getContext('2d')
        this.ctx.beginPath()
        this.ctx.rect(100, 75, 50, 5)
        this.ctx.rect(50, 75, 50, 10)
        this.ctx.stroke()
      },
      startClock () {
        let clockCanvas = document.getElementById('time-canvas-sim')
        let Clockctx = clockCanvas.getContext('2d')
        let radius = clockCanvas.height / 2
        Clockctx.translate(radius, radius)
        radius = radius * 0.90
        setInterval(this.drawClock(Clockctx, radius), 1000)
      },
      drawClock (ctx, radius) {
        this.drawFace(ctx, radius)
        this.drawNumbers(ctx, radius)
        this.drawTime(ctx, radius)
      },
      drawFace (ctx, radius) {
        var grad
        ctx.beginPath()
        ctx.arc(0, 0, radius, 0, 2 * Math.PI)
        ctx.fillStyle = 'white'
        ctx.fill()
        grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05)
        grad.addColorStop(0, '#333')
        grad.addColorStop(0.5, 'white')
        grad.addColorStop(1, '#333')
        ctx.strokeStyle = grad
        ctx.lineWidth = radius * 0.1
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI)
        ctx.fillStyle = '#333'
        ctx.fill()
      },
      drawNumbers (ctx, radius) {
        var ang
        var num
        ctx.font = radius * 0.15 + 'px arial'
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        for (num = 1; num < 13; num++) {
          ang = num * Math.PI / 6
          ctx.rotate(ang)
          ctx.translate(0, -radius * 0.85)
          ctx.rotate(-ang)
          ctx.fillText(num.toString(), 0, 0)
          ctx.rotate(ang)
          ctx.translate(0, radius * 0.85)
          ctx.rotate(-ang)
        }
      },
      drawTime (ctx, radius) {
        var now = new Date()
        var hour = now.getHours()
        var minute = now.getMinutes()
        var second = now.getSeconds()
        // hour
        hour = hour % 12
        hour = (hour * Math.PI / 6) +
        (minute * Math.PI / (6 * 60)) +
        (second * Math.PI / (360 * 60))
        this.drawHand(ctx, hour, radius * 0.5, radius * 0.07)
        // minute
        minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60))
        this.drawHand(ctx, minute, radius * 0.8, radius * 0.07)
        // second
        second = (second * Math.PI / 30)
        this.drawHand(ctx, second, radius * 0.9, radius * 0.02)
      },
      drawHand (ctx, pos, length, width) {
        ctx.beginPath()
        ctx.lineWidth = width
        ctx.lineCap = 'round'
        ctx.moveTo(0, 0)
        ctx.rotate(pos)
        ctx.lineTo(0, -length)
        ctx.stroke()
        ctx.rotate(-pos)
      }
    }
  }
</script>

<style>
#heart-sim {
  float: left;
  width: 200px;
}

#movement-sim {
  float: left;
}

#time-sim {
  float: left;
}
#clearFloat {
  clear: both;
}
</style>
