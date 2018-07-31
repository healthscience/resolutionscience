import Vue from 'vue'
import { expect } from 'chai'
import Component from '@/hs-nav-heart.vue'

describe('hs-nav-heart.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      /* eslint-disable object-shorthand */
      render: h => h(hs - nav - heart)
    }).$mount()
    console.log('selector')
    console.log(vm.$el)
    console.log(vm.$el.querySelector('nav'))
    //    expect(vm.$el.querySelectorAll('#account').length).to(1)
  })
})
