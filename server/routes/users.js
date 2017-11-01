var express = require('express');
let mongoose = require('mongoose')
let _ = require('lodash')
mongoose.Promise = require('bluebird')
require('../util/util')
var router = express.Router();
let User = require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login',function(req,res,next){
  let userName = req.body.userName
  let userPwd = req.body.userPwd
  User.findOne({userName:userName,userPwd:userPwd}).exec()
      .catch((err) => {
        console.log(err);
      })
      .then(response => {
        if(response){
          res.cookie("userId",response.userId,{
            path:'/',
            maxAge:1000*60*60
          })
          res.cookie("userName",response.userName,{
            path:'/',
            maxAge:1000*60*60
          })
          res.json({
            status:0,
            result:{
              userName:response.userName,
              userPwd:response.userPwd
            }
          })
        }else{
          
          res.json({
            status:1,
            
          })
        }
      })
})
router.post("/logout",function(req,res,next){
  res.cookie("userId","",{
    path:'/',
    maxAge:-1
  })
  res.json({
    status:0,
    result:''
  })
})

router.get("/checkLogin",function(req,res,next){
  if(req.cookies.userId){
    res.json({
      status:0,
      result:req.cookies.userName
    })
  }else{
    res.json({
      status:1,
      result:'用户未登录'
    })
  }
})

//购物车列表
router.get('/cartList',function(req,res,next){
  let userId = req.cookies.userId
  User.findOne({userId:userId}).exec().then(response => {
    if(response){
      res.json({
        status:0,
        result:response.cartList
      })
    }else{
      res.json({
        status:1,
        result:''
      })
    }
  })
  .catch((err) => {
    console.log(err);
  })
})

//购物车删除功能
router.post('/cartDel',function(req,res,next){
  let userId = req.cookies.userId
  let productId = req.body.productId
  User.update({userId:userId},{
    $pull:{
      "cartList":{"productId":productId}
  }}).exec().then(response => {
    if(response){
      res.json({
        status:0,
        result:'suc'
      })
    }else{
      res.json({
        status:1,
        result:'fail'
      })
    }
  })
  .catch((err) => {
    console.log(err);
  })
})

//购物车编辑
router.post('/cartEdit',function(req,res,next){
  let userId = req.cookies.userId
  let productId = req.body.productId
  let productNum = req.body.productNum
  let checked = req.body.checked
  
  User.update({userId:userId,'cartList.productId':productId},{
    "cartList.$.productNum":productNum,"cartList.$.checked":checked
  }).exec().then(response => {
    if(response){
      res.json({
        status:0,
        result:'suc'
      })
    }else{
      res.json({
        status:1,
        result:'fail'
      })
    }
  })
  .catch((err) => {
    console.log(err);
  })
})

//商品全选

router.post('/editCheckAll',function(req,res,next){
  let userId = req.cookies.userId
  let checked = req.body.checkAll?1:0
  User.findOne({userId:userId}).exec()
    .then(response => {
      if(response){
        response.cartList.forEach(item => {
          item.checked = checked
        })
        response.save()
          .then(response1 => {
            if(response1){
              res.json({
                status:0,
                result:'suc'
              })
            }else{
              res.json({
                status:1,
                result:'fail'
              })
            }
          })
        res.json({
          status:0,
          result:'suc'
        })
      }
    })
})

//获取地址列表
router.get('/addressList',function(req,res,next){
  let userId = req.cookies.userId
  User.findOne({userId:userId}).exec().then(response => {
    if(response){
      res.json({
        status:0,
        result:response.addressList
      })
    }
  })
  .catch((err) => {
    console.log(err);
  })
})
//增加地址


//设置默认地址
router.post('/setDefault',function(req,res,next){
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  User.findOne({userId:userId}).exec().then(response => {
    if(response){
      response.addressList.forEach(item => {
        if(item.addressId == addressId){
          item.isDefault = true
        }else{
          item.isDefault = false
        }
      })
      
      response.save()
      .then(response1 => {
        if(response1){
          res.json({
            status:0,
            result:''
          })
        }
      })
    }else{
      res.json({
        status:1,
        result:'fail'
      })
    }
  })
  .catch((err) => {
    console.log(err);
  })
})

//删除地址
router.post('/delAddress',function(req,res,next){
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  User.update({userId:userId},{
    $pull:{"addressList":{
      addressId:addressId
      }    
    }
  }).exec().then(response => {
    if(response){
      res.json({
        status:0,
        result:''
      })
    }else{
      res.json({
        status:1,
        result:'fail'
      })
    }
  })
  .catch((err) => {
    console.log(err);
  })
})

//创建订单
router.post('/payMent',function(req,res,next){
  let userId = req.cookies.userId
  let orderTotal = req.body.orderTotal
  let addressId = req.body.addressId
  let address = ''
  let goodsList = []
  User.findOne({userId:userId}).exec().then(response => {
    if(response){
      //地址
      
      response.addressList.forEach(item => {
        if(item.addressId = addressId){
          address = item
        }
      })
      //购买商品
      response.cartList.forEach(item => {
        if(item.checked == 1){
          goodsList.push(item)
        }
      })
      let platForm = '622'
      let r1 = Math.floor(Math.random()*10)
      let r2 = Math.floor(Math.random()*10)
      let sysDate = new Date().Format('yyyyMMddhhmmss')
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
      let orderId = platForm + r1 + sysDate + r2
      let order = {
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:1,
        createDate:createDate
      }
      response.orderList.push(order)
    
      response.save().then(response1 => {
        if(response1){
          res.json({
            status:0,
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal
            }
          })
        }else{
          res.json({
            status:1,
            result:'fail'
          })
        }
      })
    }
  })
})

//查询用户订单信息
router.get('/detailOrder',function(req,res,next){
  let userId = req.cookies.userId
  let orderId = req.param('orderId')
  let orderTotal = 0
  User.findOne({userId:userId}).exec().then(response => {
    if(response ){
      
      response.orderList.forEach(item => {
        if(item.orderId == orderId){
          orderTotal = item.orderTotal
        }
      })
    
      response.save().then(response1 => {
        if(response1){
          res.json({
            status:0,
            result:{
              orderId:orderId,
              orderTotal:orderTotal
            }
          })
        }
      })
      
    }else{
      res.json({
        status:1,
        result:'无订单'
      })
    }
  })
})

//获取购物车商品数量
router.get('/getCartCount',function(req,res,next){
  let userId = req.cookies.userId
  let cartCount = 0
  User.findOne({userId:userId}).exec().then(response => {
    if(response){
      
      response.cartList.forEach(item => {
        cartCount += parseInt(item.productNum)
      })
      res.json({
        status:0,
        result:cartCount
      })
    }
  })
})

//新增地址
router.post('/addAddress',function(req,res,next){
  let userId = req.cookies.userId
  let addressInfo = req.body.addressInfo
  let r1 = Math.floor(Math.random()*10)
  let r2 = Math.floor(Math.random()*10)
  // let sysDate = new Date().Format('yyyyMMddhhmmss')
  let createDate = new Date().Format('hhmmss')
  let addressId = r1 + createDate + r2
  addressInfo.addressId = addressId
  // addressInfo.isDefault = false
  // console.log(addressInfo)
  User.findOne({userId:userId}).exec().then(response => {
    if(response){
      response.addressList.push(addressInfo)
      response.save().then(response1 => {
        // console.log(response1)
        res.json({
          status:0,
          result:addressInfo
        })
      })
    }
    else{
      res.json({
        status:1,
        result:''
      })
    }
  })
  
})

//编辑地址
router.post('/editAddress',function(req,res,next){
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  let addressInfo = req.body.addressInfo
  User.findOne({userId:userId}).exec().then(response => {
    if(response){
      response.addressList.forEach(item => {
        if(item.addressId == addressId){
          for(var key in addressInfo){
            item[key] = addressInfo[key]
          }
         
        }
      })
      response.save().then(response1 => {
        if(response1){
          res.json({
            status:0,
            result:response1
          })
        }
      })
    }

  })
})
module.exports = router;
