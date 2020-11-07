const MongodbClient = require('mongodb').MongoClient

const url = 'mongodb://localhost:27017'
const dbName = 'myblog'

MongodbClient.connect(
    url,
    {
        useUnifiedTopology: true
    },
    (err, client)=>{
        if(err){
            console.log('mongodb connect error '+err);
            return
        }

        console.log('mongodb connect success');

        //切换到数据库
        const db = client.db(dbName)

        //关闭连接
        client.close()
    }
)