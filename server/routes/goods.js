let express = require('express')
let router = express.Router()
let mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
let Goods = require('../models/goods')
let User = require('../models/user')

// mongoose.connect('mongodb://127.0.0.1:27017/db_mall')
// mongoose.connection.on('connected',function(){
//     console.log('connect success')
// })

// mongoose.connection.on('disconnected',function(){
//     console.log('disconnect')
// })

// mongoose.connection.on('error',function(){
//     console.log('connect fail')
// })

//查询商品数据
router.get('/list',function(req,res,next){
    
    let page = parseInt(req.param('page'))//当前页码
    let pageSize = parseInt(req.param('pageSize'))//每页数据总数量
    let sort = parseInt(req.param('sort'))//设置升降序
    let skip = parseInt((page - 1)*pageSize)//跳过的数据总数
    let priceLevel = req.param('priceLevel')//价格区间
    let priceGt = ''
    let priceLte = ''
    let params = {}
    if(priceLevel != 'all'){
        switch (priceLevel){
            case '0':priceGt = 0;priceLte = 100;break;
            case '1':priceGt = 100;priceLte = 500;break;
            case '2':priceGt = 500;priceLte = 1000;break;
            case '3':priceGt = 1000;priceLte = 5000;break;
            
        }
        params = {
            salePrice:{
                $gt:priceGt,
                $lte:priceLte
            }
        }
    }
    
    let goodsModel = Goods.find(params).sort({'salePrice':sort}).skip(skip).limit(pageSize).exec()
    
    goodsModel.then((response) => {
        
        if(!response){
            res.json({
                status:'1',
                result:'失败'
            })
        }else{
            res.json({
                status:'0',
                msg:'',
                result:{
                    count:response.length,
                    list:response
                }
            })
        
        }
    })
    .catch((err) => {
        console.log(err);
      })
})

//加入购物车

router.post('/addCart',function(req,res,next){
    
    let userId = '100000077'
    let productId = req.body.productId
    User.findOne({userId:userId}).exec()
        .then((response) => {
            // console.log(response)
            if(!response){
                res.json({
                    status:'1',
                    result:'失败'
                })
            }else{
                let goodsItem = ''
                response.cartList.forEach(item => {
                    if(item.productId == productId){
                        goodsItem = item
                        item.productNum ++                     
                    }
                })
                if(goodsItem){
                    response.save().then(result => {
                        
                        if(!result){
                            res.json({
                                status:'1',
                                result:'失败'
                            })
                        }else{
                            res.json({
                                status:'0',
                                
                                result:{
                                    
                                    list:result
                                }
                            })
                        
                        }
                    })
                }else{
                    Goods.findOne({productId:productId}).exec()
                        .then(result => {
                            
                            result.productNum = 1
                            result.checked = 1
                            response.cartList.push(result)
                            response.save().then(response1 => {
                                if(!response1){
                                    res.json({
                                        status:'1',
                                        result:'失败'
                                    })
                                }else{
                                    res.json({
                                        status:'0',
                                       
                                        result:{
                                            
                                            list:response1
                                        }
                                    })
                                
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                              })
                        })
                }
            }
        })
        .catch((err) => {
            console.log(err);
          })
})
module.exports = router