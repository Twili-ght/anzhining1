'use strict';
const db = uniCloud.database();
const collection = db.collection('user'); // 确认集合名

exports.main = async (event, context) => {
	try {
		const grades = ["七年级", "八年级", "九年级", "高一", "高二", "高三", "大一", "大二", "大三", "大四", "大五"];
		const firstNames = ["王", "张", "李", "赵", "刘", "陈", "杨", "黄", "周", "吴", "徐", "孙", "朱", "马", "胡"];
		const secondNames = ["一", "二", "三", "四", "五", "六", "七", "琪", "白", "武", "思", "磊", "琦", "强", "俊"];

		const usedNameAge = new Set();
		const dataList = [];

		// 生成 100 条数据
		while (dataList.length < 100) {
			const name = firstNames[Math.floor(Math.random() * firstNames.length)] +
				secondNames[Math.floor(Math.random() * secondNames.length)];
			const age = Math.floor(Math.random() * 18) + 18;
			const key = name + "_" + age;
			if (usedNameAge.has(key)) continue;
			usedNameAge.add(key);

			dataList.push({
				name,
				age,
				phone: "13" + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0'),
				grade: grades[Math.floor(Math.random() * grades.length)],
				type: Math.random() > 0.5 ? 1 : 0,
				gender: Math.random() > 0.5 ? "男" : "女"
			});
		}

		// 并发插入 100 条独立文档
		await Promise.all(
			dataList.map(item => collection.add(item))
		);

		return {
			code: 0,
			msg: '批量插入成功',
			count: dataList.length
		};

	} catch (err) {
		console.error(err);
		return {
			code: 1,
			msg: '批量插入失败',
			err
		};
	}
};