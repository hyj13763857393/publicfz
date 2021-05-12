const express=require("express");
const pool=require("../pool.js");
const router=express.Router();

//挂载路由
//1,商品列表   请求get   接口 /list
router.get('/list',(req,res)=>{
    //1.1获取数据
    var obj=req.query;
    //console.log(obj);//测试
    //1.2非空验证，如果为空，设置默认值
    if(!obj.m)obj.m=1;
    if(!obj.n)obj.n=5;
    //1.3把每页显示的数量转换为数字型
    obj.n=Number(obj.n);
    //1.4计算启始页
    obj.m=(obj.m-1)*obj.n;
    //1.5执行SQL语句进行分页查询
    pool.query('select * from xz_laptop limit ?,?',[obj.m,obj.n],(err,result)=>{
        if(err){//报错提示用户
            //throw err;
            res.send({code:500,msg:"服务器正忙，请稍后在试"});
        } else{
            if(result.length>0){
                res.send({code:200,msg:"ok",date:result});
            }else{
                res.send({code:500,msg:"服务器正忙，请稍后在试"});
            }
        }
        //console.log(result);//测试
    });

});
//2,商品添加
router.post('/add',(req,res)=>{
    //2.1获取数据
    var obj=req.body;
    console.log(obj);
    //2.2非空验证
    var i=400;
    for(var key in obj){
        i++;
        if(!obj[key]){
            res.send({
                code:i,
                msg:key+"不能为空"
            });
            return;
        }
    };
    //2.3执行SQL语句
    //2.4数据类型转换
    obj.family_id=Number(obj.family_id);
    obj.price=parseFloat(obj.price);
    obj.shelf_time=parseInt(obj.shelf_time);
    obj.sold_count=parseInt(obj.sold_count);
    obj.is_onsale=parseInt(obj.is_onsale);
    pool.query('insert into xz_laptop set ?',[obj],(err,result)=>{
        if(err){  //报错提示用户
            //throw err;
            res.send({code:500,msg:"服务器正忙，请稍后在试"});
        }else{
            if(result.affectedRows>0){
                res.send({code:200,msg:"注册成功"})
            }else{
                res.send({code:500,msg:"添加失败"})
            }
        }
        
    });
    //res.send("商品添加成功")
    
});
//3,商品详情
router.get('/detail',(req,res)=>{
    //3.1获取数据
    var obj=req.query;
    //3.2非空验证
    if(!obj.lid){
        res.send({code:401,msg:"商品ID不能为空"});
        return;
    }
    //3.3数据类型转换
    obj.lid=parseInt(obj.lid);
    //3.4执行SQL语句
    pool.query('select * from xz_laptop where lid=?',[obj.lid],(err,result)=>{
        if(err) {  //报错提示用户
            throw err;
            //res.send({code:500,msg:"服务器正忙，请稍后在试"});
        }
        console.log(result)
        if(result.length>0){
            res.send({
                code:200,
                msg:"ok",
                data:result[[0]]
            })
        }else{
            res.send({code:301,msg:"无此商品信息"});
        }
    });
});
//4,删除商品
router.get('/delete',(req,res)=>{
    //4.1获取数据
    var obj=req.query;
    //4.2非空验证
    if(!obj.lid)res.send({code:401,msg:"商品ID不能为空"});
    //4.3数据类型转换
    obj.lid=parseInt(obj.lid);
    //4.4执行SQL语句
    pool.query('delete from xz_laptop where lid=?',[obj.lid],(err,result)=>{
        if(err) {  //报错提示用户
            //throw err;
            res.send({code:500,msg:"服务器正忙，请稍后在试"});
        }   
        console.log(result);
        if(result.affectedRows>0){
            res.send({code:200,msg:"成功删除"});
        }else{
            res.send({code:301,msg:"删除失败"})
        };
    });
});

//导出路由器对象
module.exports=router;