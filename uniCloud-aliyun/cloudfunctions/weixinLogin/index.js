'use strict';
exports.main = async (event, context) => {
	const {
		code,
		avatar,
		nickname
	} = event;
	if (!code) {
		return {
			code: 1,
			msg: '缺少登录凭证 code'
		}
	}

	const appid = 'wx9755c30eeb917cf9';
	const secret = '334752ae93aa90b23c5eb724bce1975c';

	// 调用微信接口换取 openid
	const res = await uniCloud.httpclient.request(
		'https://api.weixin.qq.com/sns/jscode2session', {
			method: 'GET',
			dataType: 'json',
			data: {
				appid,
				secret,
				js_code: code,
				grant_type: 'authorization_code'
			}
		}
	);

	const body = res.data;
	if (!body.openid) {
		return {
			code: 2,
			msg: '微信登录失败',
			detail: body
		}
	}

	// 存储到数据库
	const db = uniCloud.database();
	const userCollection = db.collection('user');

	// 查询是否已存在
	const userInDB = await userCollection.where({
		openid: body.openid
	}).get();

	if (userInDB.data.length === 0) {
		// 新用户，插入数据
		await userCollection.add({
			openid: body.openid,
			session_key: body.session_key,
			avatar: avatar,
			nickname: nickname,
			create_time: Date.now()

		});
	} else {
		// 老用户，更新头像和昵称
		await userCollection.doc(userInDB.data[0]._id).update({
			session_key: body.session_key,
			avatar: avatar || userInDB.data[0].avatar,
			nickname: nickname || userInDB.data[0].nickname,
			update_time: Date.now()
		});
	}
	// 返回给前端
	const userInfo = {
		avatar: avatar,
		nickname: nickname
	};
	return {
		code: 0,
		msg: '登录成功',
		data: {
			openid: body.openid,
			userInfo: {
				avatar,
				nickname
			}
		}
	};
};