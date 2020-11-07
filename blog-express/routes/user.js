var express = require('express');
var router = express.Router();
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.post('/login', function(req, res, next){
    const { username, password } = req.body
    const result = login(username, password)
    return result.then(data =>{
        if(data.username) {
            //session 設置
            req.session.username = data.username
            req.session.realname = data.realname

            res.json(
                new SuccessModel()
            )
            return
        }
        res.json(
            new ErrorModel('ログイン失敗')
        )
    })
});

router.get('/login-text',(req, res,next)=>{
    if(req.session.username){
        res.json({
            errorno: 0,
            msg: "ok"}
        )

    }else{
        res.json({
            error:-1,
            msg: "ng"
        })
    }
})

module.exports = router;