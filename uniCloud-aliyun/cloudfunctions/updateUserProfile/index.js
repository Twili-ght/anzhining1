'use strict';
const db = uniCloud.database()
const users = db.collection('users')

exports.main = async (event, context) => {
	const {
		openid,
		avatar,
		nickname
	} = event

	if (!openid) {
		return {
			code: -1,
			msg: '缺少 openid'
		}
	}

	// 后端兜底昵称
	const finalNickname = nickname && nickname.trim() ? nickname : '微信用户'

	try {
		// 查询是否存在该用户
		const userRes = await users.where({
			openid
		}).get();

		if (userRes.data.length > 0) {
			// 已存在 → 更新用户资料
			const userId = userRes.data[0]._id
			await users.doc(userId).update({
				avatar,
				nickname: finalNickname,
				update_time: Date.now()
			})
			return {
				code: 0,
				msg: '资料更新成功',
				data: {
					openid,
					avatar,
					nickname: finalNickname
				}
			}
		} else {
			// 不存在 → 新增一条记录
			await users.add({
				openid,
				avatar,
				nickname: finalNickname,
				create_time: Date.now(),
				update_time: Date.now()
			})
			return {
				code: 0,
				msg: '资料新增成功',
				data: {
					openid,
					avatar,
					nickname: finalNickname
				}
			}
		}
	} catch (err) {
		console.error('更新资料失败:', err)
		return {
			code: -1,
			msg: '资料更新失败',
			error: err.message
		}
	}
}