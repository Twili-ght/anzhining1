'use strict';

const {
	create
} = require("domain");

const db = uniCloud.database();

exports.main = async (event, context) => {
	const {
		collectionName, // 集合名称
		query = {}, // 查询条件，如 { status: 1 }
		page = 1, // 当前页码
		pageSize = 100, // 每页条数，最大建议不超过300
		orderBy = [], // 排序，如 [['create_time', 'desc']]
		field = null // 字段筛选，如 ['name', 'age']
	} = event;

	const maxLimit = 100;
	const totalLimit = pageSize;
	const skipCount = (page - 1) * pageSize;

	try {
		const collection = db.collection(collectionName);

		let queryBuilder = collection.where(query);

		// 字段筛选
		if (field && Array.isArray(field)) {
			queryBuilder = queryBuilder.field(field.reduce((acc, cur) => {
				acc[cur] = true;
				return acc;
			}, {}));
		}

		// 排序
		if (orderBy && Array.isArray(orderBy)) {
			orderBy.forEach(([key, direction]) => {
				queryBuilder = queryBuilder.orderBy(key, direction);
			});
		}

		// 分页获取数据（突破100条限制）
		let allData = [];
		for (let i = 0; i < Math.ceil(totalLimit / maxLimit); i++) {
			const res = await queryBuilder
				.skip(skipCount + i * maxLimit)
				.limit(Math.min(maxLimit, totalLimit - i * maxLimit))
				.get();

			allData = allData.concat(res.data);

			if (res.data.length < maxLimit) break;
		}

		return {
			code: 0,
			data: allData,
			msg: '查询成功'
		};
	} catch (err) {
		return {
			code: -1,
			data: null,
			msg: err.message || '查询失败'
		};
	}
};