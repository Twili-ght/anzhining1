Component({
	data: {
		selected: 0,
		color: "#7A7E83",
		selectedColor: "#3471ED",
		list: [{
			"pagePath": "pages/home/index",
			"text": "首页",
			"iconPath": "/static/首页 (1).png",
			"selectedIconPath": "/static/首页.png"
		}, {
			"pagePath": "pages/mine/index",
			"text": "我的",
			"iconPath": "/static/我的 (1).png",
			"selectedIconPath": "/static/我的.png"
		}]
	},
	attached() {},
	methods: {
		switchTab(e) {
			const path = e.currentTarget.dataset.path
			const index = e.currentTarget.dataset.index
			if (this.data.selected === index) {
				return;
			}
			this.setData({
				selected: index,
			});
			wx.switchTab({
				url: `/${path}`,
			})
		}

	}
})