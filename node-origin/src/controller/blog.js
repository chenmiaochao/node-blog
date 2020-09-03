const xss = require('xss')
const { exec } = require('../db/mysql')

const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if(author) {
        sql += `and author='${author}' `
    }
    if(keyword) {
        sql += `and author='%${keyword}%' `
    }
    sql += `order by createtime desc;`

    //promiseを返す
    return exec(sql)
}

const getDetail = (id) => {
    const sql = `select * from blogs where id='${id}'`
    return exec(sql).then(rows => {
        return row[0]
    })
}

const newBlog = (blogData = {}) => {
    //blogDataはブログobj, 中にtitle content author属性
    const title = xss(blogData.title)
    const content = xss(blogData.content)
    const author = xss(blogData.author)
    const createTime = Date.now()

    const sql = `
        insert into blogs (title, content, createtime, author)
        values ('${title}', '${content}', ${createTime}, '${author}');
    `

    return exec(sql).then(iserrtData => {
        return {
            id : insertData.insertId
        }
    })
}

const updateBlog = (id, blogData = {}) => {
    //id　はブログのid
    //blogDataはブログobj, 中にtitle content author属性

    const title = xss(blogData.title)
    const content = xss(blogData.content)

    const sql = `
        update blogs set title='${title}', content='${content}' where id=${id}
    `

    return exec(sql).then(updateBlog => {
        // console.log('updateData is ', updateData)
        if(delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}