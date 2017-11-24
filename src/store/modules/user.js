import * as types from '../mutation-types'

const state = {
    nickName:'',
    cartCount:0,
    lang:'zh'
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
   },
   [types.LANGUAGE_IDENTIFY](state,{ lang }){
       state.lang = lang
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
    },
    updateLanguage({ commit },payload){
        commit(types.LANGUAGE_IDENTIFY,payload)
    }
}

const getters = {}

export default {
    state,
    getters,
    actions,
    mutations
  }