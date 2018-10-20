import moment from 'moment'
const state = {
  msgs: [{moment: new moment(), msg: 'welcome to the demo app'},],
}
  
const mutations = {
  appendMsg: (state, msg) => {
      state.msgs.unshift({timestamp: new moment(), msg: msg})
      state.msgs.splice(10,2)
  },
}

const getters = {
  msgs: (state) => state.msgs ,
}

// export this module.
export default {
  state,
  mutations,
  getters
}