'use strict';
exports.main = async (event, context) => {
	const {
		code,
		userInfo
	} = event
	if (!code) {
		return {
			code: 1,
			msg: '缺少登录凭证 code'
		}
	}

	const appid = 'wx9755c30eeb917cf9'
	const secret = '334752ae93aa90b23c5eb724bce1975c'

	// 调用微信接口换取 openid
	const res = await uniCloud.httpclient.request(
		'https://api.weixin.qq.com/sns/jscode2session', {
			method: 'GET',
			dataType: 'json',
			data: {
				appid,
				secret,
				js_code: code,
				grant_type: 'authorization_code',
			},
		}
	)

	const body = res.data
	if (!body.openid) {
		return {
			code: 2,
			msg: '微信登录失败',
			detail: body
		}
	}

	// 数据库操作
	const db = uniCloud.database()
	const userCollection = db.collection('user')

	const userInDB = await userCollection.where({
		openid: body.openid
	}).get()

	if (userInDB.data.length === 0) {
		// 新用户
		await userCollection.add({
			openid: body.openid,
			session_key: body.session_key,
			nickname: userInfo.nickName || '',
			avatar: userInfo.avatarUrl || '',
			gender: userInfo.gender || 0,
			create_time: Date.now(),
		})
	} else {
		// 老用户更新
		await userCollection.doc(userInDB.data[0]._id).update({
			nickname: userInfo.nickName || '',
			avatar: userInfo.avatarUrl || '',
			gender: userInfo.gender || 0,
			update_time: Date.now(),
		})
	}

	return {
		code: 0,
		msg: '登录成功',
		data: {
			openid: body.openid,
			userInfo
		},
	}
}