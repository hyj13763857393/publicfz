const express = require("express");
const pool=require('../pool.js');//引入连接池
const router=express.Router();

//挂载路由
//1，用户注册   请求POST    接口/register
router.post('/register',(req,res)=>{
    //1.1获取POST请求的数据
    var obj=req.body;
    //console.log(obj);//测试是否获取到数据
    //1.2非空验证
    var i=400;  //状态码
    var str=""; //提示用户信息
    for(var key in obj){
        i++;
        switch(i){
            case 401:
                str="用户名";
                break;
            case 402:
                str="密码";
                break;
            case 403:
                str="邮箱";
                break;
            case 404:
                str="电话";
                break;
        }
        if(!obj[key]){
            res.send({
                code:i,
                msg:str+"不能为空"
            })
        }
    }
    //插入数据判断是否存在，存在提示用户，不存在插成成功同样提示用户，使用数据库执行SQL语句
    //1.3执行SQL语句
    pool.query('select uname from xz_user where uname=?',[obj.uname],(err,result)=>{
        if(err){    //报错提示用户
            res.send({
                code:500,
                msg:"服务器正忙，请稍后在试"
            });
        }; 
        //1.4判断用户输入的信息是否存在，并提示用户
        if(result.length>0){  //用户ID存在重名，提示“用户名已存在，请更换”
            res.send({code:501,msg:"用户已存在，请更换用户名"})
        }else{    //判断用户输入的用户名不存在，提示注册成功
            pool.query('insert into xz_user set ?',[obj],(err,result)=>{
                if(err){  //报错提示用户
                    res.send({code:500,msg:"服务器正忙，请稍后在试"});
                }
                res.send({code:200,msg:"注册成功"})
            })
        }
    });
});

//2,用户登陆    请求POST   接口login
router.post('/login',(req,res)=>{
    //2.1获取数据
    var obj=req.body;
    //console.log(obj);//测试，查看是否有获取到数据
    //2.2非空验证
    if(!obj.uname){
        res.send({code:401,msg:"用户名不能为空"});
        return;
    };
    //2.3验证数据密码是否为空
    if(!obj.upwd){
        res.send({code:402,msg:"密码不能为空"});
        return;
    };
    //2.4执行SQL语句，验证用户名是否存在，密码是否正确
    pool.query('select * from xz_user where uname=? and upwd=?',[obj.uname,obj.upwd],(err,result)=>{
        if(err){ //报错提示用户
            res.send({code:500,msg:"服务器正忙，请稍后在试"});
        }else{
            //console.log(result)//测试
            //存在登陆成功
            if(result.length>0){
                res.send({code:200,msg:"登陆成功"})
            }else{//不存在提示用户
                res.send({code:301,msg:"用户名或密码错误"})
            }
        }
    });
});

//3,用户检索     请求SET   接口detail
router.get('/detail',(req,res)=>{
    //3.1获取数据，
    var obj=req.query;
    //console.log(obj2);//测试
    //3.2非空验证
    if(!obj.uid){
        res.send({code:401,msg:"用户ID不能为空"});
        return;
    };
    //3.3执行SQL语句，查找数据,
    pool.query('select * from xz_user where ?',[obj],(err,result)=>{
        if(err){ //报错提示用户
            res.send({code:500,msg:"服务器正忙，请稍后在试"});
        }else{
            //console.log(result); //测试
            if(result.length>0){//判断数据是否存在数据，存在提示用户并给出数据
                res.send({
                    code:200,
                    msg:"用户数据为",
                    data:result[0]
                });
            }else{//判断数据是否存在数据，不存在提示用户
                res.send({code:301,msg:"未检索到用户"});
            }
        }
    })
});

//4,删除用户     请求SET   接口delete
router.get('/delete',(req,res)=>{
    //4.1获取数据
    var obj=req.query;
    console.log(obj);//测试
    //4.2非空验证
    if(!obj.uid){
        res.send({code:401,msg:"用户编号不能为空"});
        return;
    }else{ //4.3执行SQL语句
        pool.query('delete from xz_user where uid=?',[obj.uid],(err,result)=>{
            if(err){
                throw err;
                //res.send({code:500,msg:"服务器正忙，请稍后在试"});
            }else{ // 4.4判断SQL语句是否执行成功
                if(result.affectedRows>0){
                    res.send({code:200,msg:"删除成功"});
                }else{
                    res.send({code:301,msg:"删除失败"});
                }
            }
        })
    }

});
//5,修改用户信息  请求post   接口update
router.post('/update',(req,res)=>{
    //5.1获取数据
    var obj=req.body;
    //console.log(obj);//测试
    //5.2非空验证，性别在前端做了默认处理后端不做判断
    var i=400;
    var str=""
    for(var key=0 in obj){
        i++;
        switch(i){
            case 401:
                str="用户编号";
                break;
            case 402:
                str="邮箱";
                break;
            case 403:
                str="电话";
                break;
        }
        if(!obj[key]){
            res.send({
                code:i,
                msg:str+"不能为空"
            })
            return;
        }
    }
    //5.3执行SQL语句，查询用户输入的uid是否存在
    pool.query('update xz_user set ? where uid=?',[obj,obj.uid],(err,result)=>{
        if(err){
            throw err;
          //res.send({code:500,msg:"服务器正忙，请稍后在试"});
        }else{
            if(result.affectedRows>0){   //用户ID存在，提示修改成功
                res.send({code:200,msg:"修改成功"})
            }else{   //用户ID不存在，提示修改失败
                res.send({code:301,msg:"修改失败"})
            }
        }
    })
});

//6,用户列表    请求SET   接口list
router.get('/list',(req,res)=>{
    var obj=req.query;
    //6.1判断用户输入的页码信息，如信息为空，设备默认数据
    if(!obj.m)obj.m=1+2;
    if(!obj.n)obj.n=2;
    //6.2将用户输入的每页显示的转为数字型
    obj.n=Number(obj.n);
    //6.3计算用户输入的页码
    obj.m=(obj.m-1)*obj.n;
    pool.query('select * from xz_user limit ?,?',[obj.m,obj.n],(err,result)=>{
        if(err){  //报错，提示用户
          res.send({code:500,msg:"服务器正忙，请稍后在试"});
        }else{   //正常，输出数据
            res.send({
                code:200,
                msg:"OK",
                data:result
            })
        }
    })
    
});


//导出路由器对象
module.exports=router;

