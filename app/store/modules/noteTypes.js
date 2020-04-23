const state = {
  noteTypes: null,
}

const getters = {
  noteTypes: state => {
    return state.noteTypes
  },
}

const mutations = {
  updateNoteTypes (state, newData) {
    state.noteTypes = newData
  }
}

const actions = {
}

// export this module.
export default {
  state,
  mutations,
  getters,
  actions
}
