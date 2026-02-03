<template>
	<view class="content">
		<!-- 头像和登录 -->
		<view class="avatar-group">
			<view class="avatar-item" @click="handleAvatarClick">
				<up-avatar :src="avatar || defaultAvatar" shape="circle" size="55" />
				<text class="nickname">{{ name?.trim() ? name : '请登录' }}</text>
			</view>
			<view class="location">
				<up-icon name="map" color="#666" size="24" @click="onLocationClick" />
				<span class="location_text" @click="onLocationClick">{{place||"获取位置"}}</span>
			</view>
			<view class="Management_button">
				<up-button type="primary" shape="circle" text="管理学员" @click="Addto"></up-button>
			</view>
		</view>
		<!-- 功能图标 -->
		<view class="function-icons">
			<view class="icon-item">
				<u-icon name="rmb-circle" size="40" color="#2ecc71" />
				<text>0.00</text>
			</view>
			<view class="icon-item">
				<up-icon name="fingerprint" size="40" color="#3498db" @click="OnJump" />
				<text>签到</text>
			</view>
			<view class="icon-item">
				<up-icon name="coupon" size="40" color="#e67e22" />
				<text>优惠券</text>
			</view>
			<view class="icon-item">
				<up-icon name="gift" size="40" color="#1abc9c" />
				<text>礼品兑换</text>
			</view>
		</view>

		<!-- 记录列表 -->
		<view class="record-list">
			<view class="record-item" @click="Achieve">
				<up-icon name="bookmark" size="24" color="#3498db" />
				<text>兑换记录</text>
				<up-icon name="arrow-right" size="20" color="#ccc" />
			</view>
			<view class="record-item" @click="Achieve">
				<up-icon name="calendar" size="24" color="#e67e22" />
				<text>积分记录</text>
				<up-icon name="arrow-right" size="20" color="#ccc" />
			</view>
			<view class="record-item" @click="Achieve">
				<up-icon name="calendar" size="24" color="#1abc9c" />
				<text>成绩单</text>
				<up-icon name="arrow-right" size="20" color="#ccc" />
			</view>
			<view class="record-item" @click="Achieve">
				<up-icon name="calendar" size="24" color="#9b59b6" />
				<text>考勤记录</text>
				<u-icon name="arrow-right" size="20" color="#ccc" />
			</view>
			<view class="record-item" @click="Achieve">
				<up-icon name="bell" size="24" color="#2ecc71" />
				<text>机构通知</text>
				<up-icon name="arrow-right" size="20" color="#ccc" />
			</view>
			<view class="record-item" @click="naviAchieve">
				<up-icon name="share" size="24" color="#e67e22" />
				<text>分享小程序</text>
				<up-icon name="arrow-right" size="20" color="#ccc" />
			</view>
		</view>

		<!-- 登录弹出框 -->
		<view class="popup">
			<u-popup v-model:show="showLoginPopup" mode="center" :mask-close="true" round="20" bgColor="#d8f3fa">
				<view class="popup-content">
					<button v-if="!avatar || !avatar.trim()" class="button-cover" open-type="chooseAvatar"
						@chooseavatar="ChooseAvatar">上传头像</button>
					<image v-else :src="avatar" class="btn-avatar"></image>
					<input type="nickname" placeholder="请输入昵称" class="wechatname" @input="onInputNickname" />
					<input type="grade" placeholder="请输入年级" class="popup-grade" @input="onInputGrade" />
					<!-- 使用节流后的登录函数 -->
					<u-button type="primary" shape="circle" @click="throttledWxLogin">登录</u-button>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'

	import {
		MAP_KEY
	} from './Tencent MapsKey.json'
	const defaultAvatar = '/static/Avatar.png'
	const avatar = ref('')
	const name = ref('')
	const openid = ref('')
	const loggedIn = ref(false)
	const showLoginPopup = ref(false)
	let currentAvatarTarget = null;
	const grade = ref('');
	const show = ref(false);
	const mode = ref('single');

	const calendarRef = ref(null);
	//定位
	const place = ref('');
	// 点击外部头像+ 打开弹窗
	const handleAvatarClick = () => {
		if (!name.value?.trim()) {
			showLoginPopup.value = true
			return
		}
		currentAvatarTarget = avatar
		ChooseAvatar()
	}
	const close = (promes) => {
		promes.value = false;
	}

	// 选择头像
	const ChooseAvatar = (e) => {
		avatar.value = e.detail.avatarUrl
	}

	// 选择昵称
	const onInputNickname = (e) => {
		name.value = e.detail.value
	}
	//获取年级
	const onInputGrade = (e) => {
		grade.value = e.detail.value;
	}

	// 跳转管理学员
	const Addto = () => {
		uni.navigateTo({
			url: '/pages/manage/manage'
		})
	}

	// 占位点击事件
	// 点击获取定位
	const onLocationClick = async () => {
		try {
			uni.showLoading({
				title: '定位中...',
				mask: true
			});

			// 先检查是否授权定位
			// #ifdef MP-WEIXIN
			const setting = await uni.getSetting();
			const hasLocationAuth = setting.authSetting['scope.userLocation'];

			// 未授权定位 → 引导开启
			if (hasLocationAuth === false) {
				uni.hideLoading()
				return uni.showModal({
					title: '提示',
					content: '检测到您未开启定位权限，请前往设置开启。',
					confirmText: '去设置',
					showCancel: false,
					success(res) {
						if (res.confirm) uni.openSetting();
					}
				});
			}
			// #endif

			// ★ 直接使用精确定位（isHighAccuracy: true）
			const locationRes = await uni.getLocation({
				type: 'gcj02',
				geocode: true,
				isHighAccuracy: true, // 精确定位
				highAccuracyExpireTime: 3000 // 超时时间
			});
			// console.log("📍 原始定位信息（uni.getLocation）:", locationRes);
			const {
				latitude,
				longitude
			} = locationRes;

			// 反向解析
			const key = MAP_KEY;
			const url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${key}`;
			const res = await uni.request({
				url
			});
			console.log("📍 腾讯地图解析结果:", res.data);
			if (res.data.status === 0) {
				const info = res.data.result;
				const standardAddress = info.formatted_addresses?.standard_address;
				place.value = standardAddress;

				uni.showToast({
					title: '获取位置成功',
					icon: 'success'
				});
			} else {
				throw new Error(res.data.message);
			}

		} catch (err) {
			uni.hideLoading()
			console.error('定位失败:', err);

			// 用户拒绝授权
			if (err.errMsg?.includes('auth')) {
				return uni.showModal({
					title: '提示',
					content: '定位权限未开启，请前往设置打开定位权限后重试。',
					confirmText: '去设置',
					showCancel: false,
					success(res) {
						if (res.confirm) uni.openSetting();
					}
				});
			}

			// ★ 系统关闭了 GPS，比如安卓关闭定位服务
			if (err.errMsg?.includes('system permission') || err.errMsg?.includes('system')) {
				uni.hideLoading()
				return uni.showModal({
					title: '提示',
					content: '手机定位服务未开启，请前往系统设置打开 GPS 后重试。',
					showCancel: false
				});
			}

			uni.showToast({
				title: '定位失败，请重试',
				icon: 'none'
			});
		} finally {
			uni.hideLoading();
		}
	};


	const Achieve = () => {
		uni.showToast({
			title: '功能待实现',
			icon: 'none'
		})
	}

	// 节流函数
	function throttle(fn, delay = 2000) {
		let lastTime = 0
		return function(...args) {
			const now = Date.now()
			if (now - lastTime >= delay) {
				lastTime = now
				fn.apply(this, args)
			}
		}
	}
	const validate = (fields) => {
		for (const {
				value,
				msg
			}
			of fields) {
			if (!value?.trim()) {
				uni.showToast({
					title: msg,
					icon: 'none'
				});
				return false
			}
		}
		return true
	}

	// 微信登录（只拿 openid/session_key）
	async function wxLogin() {
		/**
		 @grade 类型问题未做类型校验该为年级选择*/
		try {
			const valid = validate([{
					value: avatar.value,
					msg: '请上传头像'
				},
				{
					value: name.value,
					msg: '请输入昵称'
				},
				{
					value: grade.value,
					msg: '请输入年级'
				}
			]);
			if (!valid) return

			const loginRes = await uni.login()
			const payload = {
				code: loginRes.code,
				avatar: avatar.value,
				nickname: name.value,
				grade: grade.value,
			}
			const res = await uniCloud.callFunction({
				name: 'weixinLogin',
				data: payload
			})
			if (res.result.code === 0) {
				openid.value = res.result.data.openid
				loggedIn.value = true;
				showLoginPopup.value = false // 🔹关闭弹窗
				uni.showToast({
					title: '登录成功',
					icon: 'success'
				})

			} else {
				uni.showToast({
					title: res.result.msg || '登录失败',
					icon: 'none'
				})
			}
		} catch (err) {
			console.error('登录失败:', err);
			uni.showToast({
				title: '登录失败，请重试',
				icon: 'none'
			});
		}
	}

	// 用节流函数包装登录
	const throttledWxLogin = throttle(wxLogin, 2000)
	// 页面显示时更新 tabBar
	// 页面显示时更新 tabBar 并检测登录
	onShow(() => {
		const page = getCurrentPages().pop()
		const tabBar = page?.getTabBar?.()
		if (typeof tabBar?.setData === 'function') {
			tabBar.setData({
				selected: 1
			})
		}

		// 检测是否登录
		if (!loggedIn.value) {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
			showLoginPopup.value = true;
		}
	});
	const onCalendarClose = () => {
		show.value = false;
	};
	/*跳转签到页面*/
	const OnJump = () => {
		if (!loggedIn.value) {
			uni.navigateTo({
				url: '/pages/Sign/index'
			});
		}

	};
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>