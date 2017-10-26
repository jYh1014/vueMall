<template>
  <div >
    <nav-header></nav-header>
    <nav-bread>
        <span slot="bread">Goods</span>
    </nav-bread>
          <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" >Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterby}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" :class="{cur:priceChecked === 'all'}" @click="setPriceFilter('all')">All</a></dd>
                <dd v-for="(item,index) in priceFilter"  :key="index">
                  <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{cur:priceChecked === index}">{{item.startPrice}} - {{item.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="item in goodsList.list" :key="item.productId">
                    <div class="pic">
                      <a href="#"><img alt="" v-lazy="'/static/'+item.productImage"></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" >加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <!-- <div class="view-more-normal"
                   v-infinite-scroll="loadMore"
                   infinite-scroll-disabled="busy"
                   infinite-scroll-distance="20">
                <img src="./../assets/loading-spinning-bubbles.svg" >
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import '../assets/css/base.css'
import '../assets/css/product.css'
import '../assets/css/base.styl'
import NavHeader from '../components/NavHeader'
import NavFooter from '../components/NavFooter'
import NavBread from '../components/NavBread'
import axios from 'axios'
export default {
  name: 'GoodsList',
  data(){
    return {
      goodsList:[],
      priceChecked:'all',
      filterby:false,
      overLayFlag:false,
      priceFilter:[
        {
          startPrice:0.00,
          endPrice:1000
        },
        {
          startPrice:1000.00,
          endPrice:2000
        },
        {
          startPrice:2000.00,
          endPrice:3000
        },
      ]
    }
  },
  components:{
      NavHeader,NavFooter,NavBread
  },
  mounted(){
      this.getGoodsList()
  },
  methods:{
      getGoodsList(){
          axios.get('/goods')
          .then(res => {
            console.log(res)
            if(res.data.status == '0'){
              this.goodsList = res.data.result
            }else{
              this.goodsList =[]
            }
              
          })
      },
      setPriceFilter(index){
        this.priceChecked = index
        this.closePop()
      },
      showFilterPop(){
        this.filterby = true
        this.overLayFlag = true
      },
      closePop(){
        this.overLayFlag = false
        this.filterby = false
      }
  }
}
</script>

<style lang="stylus">
  
</style>
