// import Vue from 'vue'

export default {
  state: {
    safeFlow: {},
    system: {'publickey': '', 'token': ''}
  },
  getters: {
  },
  mutations: {
    setBoth: (state, inVerified) => {
      state.system = inVerified
    },
    setPublickey: (state, inVerified) => {
      state.system.publickey = inVerified
    },
    setToken: (state, inVerified) => {
      state.system.token = inVerified
    },
    setDatatype: (state, inVerified) => {
      state.context.datatypes = inVerified
    }
  },
  actions: {
    actionSetDataTypes: (context, update) => {
    // filter a list of Kentity bundles given the Experiment CNRL
      context.commit('setDatatype', update)
    }
  }
}
