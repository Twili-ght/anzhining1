let navigating = false
let timer = null

// tabBar 页面路径（⚠️必须与 pages.json 一致）
const TAB_PAGES = [
	'/pages/mine/index',
	'/pages/home/index'
]

/**
 * 全局安全跳转
 * @param {string} url 跳转路径
 * @param {Object} options
 * @param {boolean} options.needLogin 是否需要登录
 * @param {number} options.unlockDelay 解锁延迟（ms）
 */
export function safeNavigate(
	url, {
		needLogin = true,
		unlockDelay = 800
	} = {}
) {
	// 登录校验（你可以按自己项目改）
	const isLogin = uni.getStorageSync('loggedIn')

	if (needLogin && !isLogin) {
		uni.showToast({
			title: '请先登录',
			icon: 'none'
		})
		return
	}

	// 防止重复跳转
	if (navigating) return
	navigating = true

	// 判断跳转方式
	const isTab = TAB_PAGES.includes(url)
	const method = isTab ? 'switchTab' : 'navigateTo'

	return new Promise((resolve, reject) => {
		uni[method]({
			url,
			success: resolve,
			fail: reject,
			complete() {
				timer = setTimeout(() => {
					navigating = false
					timer = null
				}, unlockDelay)
			}
		})
	})
}

/**
 * 页面销毁时调用，释放跳转锁
 */
export function resetNavigateLock() {
	navigating = false
	if (timer) {
		clearTimeout(timer)
		timer = null
	}
}