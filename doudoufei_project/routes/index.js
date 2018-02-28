var express = require('express');
var router = express.Router();
var md5 = require("md5");
var Usermodel = require("../model/Usermodel")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/main', function(req, res, next) {
  res.render('main');
});
router.get('/header', function(req, res, next) {
  res.render('header');
});
router.get('/mainleft', function(req, res, next) {
  res.render('mainleft');
});
router.get('/maincenter', function(req, res, next) {
  res.render('maincenter');
});
router.get('/mainright-new', function(req, res, next) {
  res.render('mainright-new');
});
router.get('/mainright-list', function(req, res, next) {
  res.render('mainright-list');
});
router.get('/manage', function(req, res, next) {
  res.render('manage');
});
router.post('/api/login',function(req,res){
    var username = req.body.username;
    var pwd = req.body.pwd;
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
