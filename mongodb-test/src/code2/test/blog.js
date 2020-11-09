const Blog = require('../models/Blog')

!(async ()=>{
    const blog1 = await Blog.create({
        title: "title3",
        content : "content3",
        author: "miao"
    })
    console.log(blog1)
})()