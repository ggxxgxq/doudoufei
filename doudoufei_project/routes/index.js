var express = require('express');
var router = express.Router();
var md5 = require("md5");
var Usermodel = require("../model/Usermodel");
var Goodsmodel = require("../model/Goodsmodel");
var multiparty = require('multiparty');

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
  Goodsmodel.find({sign:1},function(err,docs){
    res.render('mainright-list',{list:docs});
  })
});
router.get('/aaa', function(req, res, next) {
     var pageNum = req.query.pageNO || 1;
     pageNum = parseInt(pageNum);
     console.log(pageNum)
     var pageCount = req.query.perPageCnt || 5;
     pageCount = parseInt(pageCount);
     Goodsmodel.count({sign:1},function(err,count){
         var pages = Math.ceil(count/pageCount);
         if(pageNum <=0){
             pageNum = 1
          }
          if(pageNum > pages){
             pageNum = pages
          }
         //skip过滤数据
         var query = Goodsmodel.find({sign:1}).skip((pageNum-1)*pageCount).limit(pageCount);
         query.exec(function(err,docs){
             var results = {
                 count:count,
                 docs:docs,
                 pages:pages,
                 pageNum:pageNum
             }
            res.json(results)
         })
     })
});
router.post('/api/search_goods', function(req, res, next) {
  var keyword = req.body.keyword;
 Goodsmodel.find({goods_name:{$regex:keyword},sign:1},function(err,docs){
         res.send(docs);

  

  })
});


router.post('/api/remove', function(req, res, next) {
  var goods_name = req.body.goods_name;
  Goodsmodel.update({goods_name:goods_name},{$set:{sign:0}},function(err,docs){
   if(!err){
    res.send("删除成功")
   }
  })
});



router.post('/manage', function(req, res, next) {
  res.render('manage');
});



router.post('/api/add_goods', function(req, res) {
    var form = new multiparty.Form({
      uploadDir :"./public/images"
    });
 
      form.parse(req, function(err, body, files) {
          //转换后的对象都是数组形式
          var goods_name = body.goods_name[0];
          var goods_id = body.goods_id[0];
          var goods_price = body.goods_price[0];
          var imgName = files.goods_pic[0].path;
          var imgName = imgName.substr(imgName.lastIndexOf("\\")+1)
          console.log(goods_name,goods_id,goods_price,imgName)

          var gm = new Goodsmodel();
          gm.sign =1;
          gm.goods_name= goods_name;
          gm.goods_id= goods_id;
          gm.goods_price= goods_price;
          gm.img= imgName;
          gm.save(function(err){
              if( !err ){
                res.render("mainright-new")

              }else{
                res.send("文件上传失败")
              }
          })
    });
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
