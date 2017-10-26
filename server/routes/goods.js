let express = require('express')
let router = express.Router()
let mongoose = require('mongoose')
let Goods = require('../models/goods')

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
    let page = parseInt(req.param('page'))//当前页码
    let pageSize = parseInt(req.param('pageSize'))//每页数据总数量
    let sort = parseInt(req.param('sort'))//设置升降序
    let skip = parseInt((page - 1)*pageSize)//跳过的数据总数
    let goodsModel = Goods.find({}).sort({'salePrice':sort}).skip(skip).limit(pageSize)
    goodsModel.exec(function(err,doc){
        console.log(doc)
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }
            })
        }

    })
    // res.send('goodslist')
})
module.exports = router