var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Goods = require('../models/goods')

mongoose.connect('mongodb://127.0.0.1:27017/db_mall')
mongoose.connection.on('connected',function(){
    console.log('connect success')
})

mongoose.connection.on('disconnected',function(){
    console.log('disconnect')
})

mongoose.connection.on('error',function(){
    console.log('connect fail')
})

router.get('/',function(req,res,next){
    res.send('goodslist')
})
module.exports = router