const crypto = require('crypto')

//シークレットキー
const SECRET_KEY = 'WJiol_8776#'

//md5
function md5(content) {
    let md5 = crypto.createHash('ma5')
    return md5.update(content).digest('hex')
}

//暗号化
function genPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}

module.exports = {
    genPassword
}