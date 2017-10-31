import * as types from '../mutation-types'

const state = {
    nickName:'',
    cartCount:0
}

const mutations = {
   [types.UPDATE_USERINFO](state,{ nickName }){
     state.nickName = nickName
   },
   [types.UPDATE_CARTCOUNT](state,{ cartCount }){
    state.cartCount += cartCount
   },
   [types.INIT_CARTCOUNT](state,{ cartCount }){
    state.cartCount = cartCount
   }
}

const actions = {
    updateUserInfo({ commit },payload){
        commit(types.UPDATE_USERINFO,payload)
    },
    updateCartCount({ commit },payload){
        commit(types.UPDATE_CARTCOUNT,payload)
    },
    initCartCount({ commit },payload){
        commit(types.INIT_CARTCOUNT,payload)
    }
}

const getters = {}

export default {
    state,
    getters,
    actions,
    mutations
  }