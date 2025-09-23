export default function cloudRequest({
	name,
	data = {},
	loading = true
}) {
	return new Promise((resolve, reject) => {
		if (!name) {
			reject(new Error('云函数名称不能为空'))
			return
		}

		if (loading) {
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
		}

		uniCloud.callFunction({
			name,
			data,
			success(res) {
				if (res.result && res.result.code === 0) {
					resolve(res);
				} else {
					reject(res.result || res)
				}
			},
			fail(err) {
				reject(err)
			},
			complete() {
				if (loading) uni.hideLoading()
			}
		})
	})
}