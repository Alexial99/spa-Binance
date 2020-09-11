import Vue from 'vue'
import Router from 'vue-router'
import DepthOfMarket from "./components/DepthOfMarket";
Vue.use(Router)

export default new Router({
  mode:'history',
  routes:[
    {
      path:'/',
      component: DepthOfMarket
    },
    {
      path:'/list',
      component: () => import('./components/ListOfPairs.vue')
    }
  ]
})
