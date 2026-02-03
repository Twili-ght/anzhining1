'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	console.log('前端传入参数:', event);

	const {
		ids
	} = event; // 前端传来的id数组
	const DeleteUser = db.collection('user');

	if (!ids || !Array.isArray(ids) || ids.length === 0) {
		return {
			code: 400,
			msg: '请传入要删除的用户id数组'
		};
	}

	try {
		// 批量删除操作
		const res = await DeleteUser.where({
			_id: db.command.in(ids)
		}).remove();

		return {
			code: 200,
			msg: '删除成功',
			deletedCount: res.deleted,
			data: res
		};
	} catch (err) {
		console.error('删除失败:', err);
		return {
			code: 500,
			msg: '服务器错误',
			error: err
		};
	}
};