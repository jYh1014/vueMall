var express = require('express');
let mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
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
  }).then(response => {
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
        response.save().exec()
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
      response.save().exec().then(response1 => {
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
module.exports = router;
