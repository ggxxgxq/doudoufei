var express = require('express');
var router = express.Router();
var md5 = require("md5");
var Usermodel = require("../model/Usermodel")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/admin', function(req, res, next) {
  res.render('admin',{});
});
router.get('/manage', function(req, res, next) {
  res.render('manage',{});
});
router.post('/api/login',function(res,req){
    var username = req.body.username;
    var pwd = md5(req.body.pwd);

    var result={
    	status:1,
    	message:"登录成功"
    }
    Usermodel.find({username:username,pwd:pwd},function(err,docs){
       if(!err && docs.length>0){
           console.log("登录成功");
           res.send(result);
       }else{
           console.log("登录失败,请检查你的用户名或密码");
           result.status = -110;
           result.message ="登录失败,请检查你的用户名或密码";
           res.send(result);
       }
    })
})
module.exports = router;
