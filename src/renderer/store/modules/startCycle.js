import Vue from 'vue'

export default {
  state: {
    safeFlow: {},
    system: {'publickey': '', 'token': ''},
    context: {}
  },
  getters: {
    liveSafeFlow: state => state.safeFlow,
    liveSystem: state => state.system,
    liveContext: state => state.context
  },
  mutations: {
    setSafeflow: (state, inVerified) => {
      state.safeFlow = inVerified
    },
    setBoth: (state, inVerified) => {
      state.system = inVerified
    },
    setPublickey: (state, inVerified) => {
      state.system.publickey = inVerified
    },
    setToken: (state, inVerified) => {
      state.system.token = inVerified
    },
    setDevice: (state, inVerified) => {
      state.context.device = Vue.set(state, 'device', inVerified)
    },
    setDatatype: (state, inVerified) => {
      state.context.datatypes = inVerified
    }
  },
  actions: {
    actionDeviceDataAPI: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('setDevice', update)
    },
    actionSetDataTypes: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('setDatatype', update)
    }
  }
}
