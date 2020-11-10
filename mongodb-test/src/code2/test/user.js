const User = require('../models/User')

//异步
!(async ()=>{

    const zhangsan = await User.create({
        username: 'zhangsan',
        password : '123',
        realname: '张三'
    })
    console.log(zhangsan)

})()