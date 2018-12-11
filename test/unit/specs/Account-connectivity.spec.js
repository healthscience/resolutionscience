import Vue from 'vue'
import Account from '@/components/Account'

describe('Account.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(Account)
    }).$mount()
    console.log('selector')
    console.log(vm.$el)
    console.log(vm.$el.querySelector('#account'))
<<<<<<< HEAD
  //    expect(vm.$el.querySelectorAll('#account').length).to(1)
=======
    //    expect(vm.$el.querySelectorAll('#account').length).to(1)
>>>>>>> upstream/master
  })
})
