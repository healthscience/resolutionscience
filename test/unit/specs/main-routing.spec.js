import Vue from 'vue'
import VueRouter from 'vue-router'
import { expect } from 'chai'
import Component from '@/App.vue'

describe('App.vue', () =>
{
  it('should render correct contents', () =>
  {
    Vue.use(VueRouter);
    const router = new VueRouter({
      routes: [
        { path: '/', name: 'account', component: Component },
      ],
    });
    const vm = new Vue({
      el: document.createElement('div'),
      /* eslint-disable object-shorthand */
      router: router,
      render: h => h('router-view'),
    });
console.log(vm.$el)
    expect(vm.$el.querySelector('#account'));
  });
});
