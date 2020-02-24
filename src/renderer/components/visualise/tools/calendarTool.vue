<template>
  <div id="time-context">
    <div id="select-time">
      <ul>
        <li v-for="tv in navTime" class="context-time">
          <button class="button is-primary" @click.prevent="setTimeData(tv)">{{ tv.text }}</button>
        </li>
        <li id="tool-bar">
          <header>Tools</header>
          <a class="" href="" id="toolbarholder" @click.prevent="toolsSwitch(toolbar)" v-bind:class="{ 'active': toolbar.active}">{{ toolbar.text }}</a>
        </li>
      </ul>
    </div>
    <div id="view-time">
      {{ displayTime }}
    </div>
    <div id="calendar-selector">
      <date-picker v-model="value" @change="calendarSelect($event)" :lang="lang"></date-picker>
      <div id="time-calendar-tools">
        <button id="multi-days" @click.prevent="setMultidays($event)">{{ calendarTools.name }}</button> {{ calendarTools.active }}
      </div>
      <div id="calendar-list-view" >
        {{ calendarList }}
        <button id="multi-day-chart" @click.prevent="chartMultiday($event)">Multi-chart</button>
        <button id="multi-day-clear" @click.prevent="clearMultidays($event)">Clear</button>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from 'vue2-datepicker'

  export default {
    name: 'calendar-tool',
    components: {
      DatePicker
    },
    data: () => ({
      toolbar:
      {
        active: false,
        text: 'off'
      },
      calendarTools:
      {
        name: 'Mulit Days',
        id: 'multi-days',
        active: false
      },
      calendarList: [],
      time1: '',
      time2: '',
      time3: '',
      // custom lang
      value: '',
      lang: {
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        pickers: ['next 7 days', 'next 30 days', 'previous 7 days', 'previous 30 days'],
        placeholder: {
          date: 'Select Date',
          dateRange: 'Select Date Range'
        }
      },
      // custom range shortcuts
      shortcuts: [
        {
          text: 'Today',
          onClick: () => {
            this.time3 = [ new Date(), new Date() ]
          }
        }
      ],
      timePickerOptions: {
        start: '00:00',
        step: '00:30',
        end: '23:30'
      }
    }),
    created () {
    },
    mounted () {
    },
    computed: {
    },
    methods: {
      calendarSelect () {
        if (this.calendarTools.active !== true) {
          // convert to correct time format and update KBundle and build new visStyle
          let bTime = {}
          bTime.selectDate = this.value
          bTime.text = 'selectd'
          this.$emit('updateLearn', bTime)
        } else if (this.calendarTools.active === true) {
          this.calendarList.push(this.value)
        }
      },
      setMultidays (md) {
        this.calendarTools.active = true
      },
      clearMultidays (md) {
        this.calendarList = []
        this.makeTimeBundles = []
      },
      chartMultiday (cm) {
        // prepare list of KnowledgeBundles to visualise
        let uSeg = {}
        uSeg.text = 'timeList'
        uSeg.timelist = this.calendarList
        this.$emit('updateLearn', uSeg)
      }
    }
  }
</script>

<style>
</style>
