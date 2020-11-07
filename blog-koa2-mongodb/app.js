const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')

const index = require('./routes/index')
const users = require('./routes/users')
const blog  = require('./routes/blog')
const user  = require('./routes/user')




const { REDIS_CONF } = require('./conf/db')

//npm install --save @cloudbase/node-sdk
//https://docs.cloudbase.net/api-reference/server/node-sdk/introduction.html#an-zhuang
const tcb = require("@cloudbase/node-sdk");
// 初始化
const appC = tcb.init({
  secretId: 'AKIDbx0j3plyY0C8oF6S3QaS4vWqtb7MudOr',
  secretKey: 'LQM6tPgmb8KE79wXu1sZ1FerrgCS81eQ',
  env: "hew-6gnlqghu3cfd5ebd"
});
//获取db
const db = appC.database();
const add01 = async (event, context) => {
  //选择集合 进行操作
  const res = await db.collection('db01')
    .add({
      category: 'Computer',
      name: 'Thinking in Java',
      sailing: true,
      sales: 100
    })
  console.log(res)
  return {
    res
  }
}
const getList = async (event, context) => {
  //选择集合 进行操作
  const res = await db.collection('db01')
    .get()
  console.log(res)
  return {
    res
  }
}

// add01();
getList();

// db.collection("db01").get();



// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

const ENV = process.env.NODE_ENV
if(ENV != 'production') {
  //开发环境/ 测试环境
  app.use(morgan('dev'));
} else{
  //线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(morgan('combined', {
    stream: writeStream
  }));
}
// session 配置
app.keys = ['WJiol#23123_']
app.use(session({
  // 配置 cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  // 配置 redis
  store: redisStore({
    // all: '127.0.0.1:6379'   // 写死本地的 redis
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
