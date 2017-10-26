var mongoose = require('mongoose')
var userSchema = mongoose.Schema({
    "userId":String,
    "userName":String,
    "userPwd":String,
    "orderList":Array,
    "cartList":[
        {
            "productId":String,
            "productName":String,
            "productImage":String,
            "salePrice":String,
            "checked":String,
            "productNum":String
        }
    ],
    "addressList":Array
})

module.exports = mongoose.model('User',userSchema)