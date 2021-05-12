const express=require("express");
const app=express();
const bodyParser=require('body-parser');   //引入中间件
//引入用户路由器
const userRouter=require('./routes/user.js');
//引入商品路由器
const prouctRouter=require('./routes/product.js')
app.listen(8080);

//托管静态资源到public
app.use(express.static('public'));
//使用body-parser中间件
app.use(bodyParser.urlencoded({
    extended:false  //不使用扩展的QS模块，使用querystring模块
}));

//把用户路由器挂载到服务器下，添加前缀  /user
app.use('/user',userRouter);
//把商品路由器挂载到服务器下，添加前缀  /product
app.use('/product',prouctRouter);
