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
			</view>
			<view class="text">
				<up-button type="primary" shape="circle" text="管理学员" @click="Addto"></up-button>
			</view>
		</view>

		<!-- 功能图标 -->
		<view class="function-icons">
			<view class="icon-item">
				<u-icon name="rmb-circle" size="40" color="#2ecc71" />
				<text>余额</text>
			</view>
			<view class="icon-item">
				<up-icon name="grid" size="40" color="#3498db" />
				<text>考勤码</text>
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
			<view class="record-item" @click="onLocationClick">
				<up-icon name="bookmark" size="24" color="#3498db" />
				<text>兑换记录</text>
				<up-icon name="arrow-right" size="20" color="#ccc" />
			</view>
			<view class="record-item" @click="onLocationClick">
				<up-icon name="calendar" size="24" color="#e67e22" />
				<text>积分记录</text>
				<up-icon name="arrow-right" size="20" color="#ccc" />
			</view>
			<view class="record-item" @click="onLocationClick">
				<up-icon name="calendar" size="24" color="#1abc9c" />
				<text>成绩单</text>
				<up-icon name="arrow-right" size="20" color="#ccc" />
			</view>
			<view class="record-item" @click="onLocationClick">
				<up-icon name="calendar" size="24" color="#9b59b6" />
				<text>考勤记录</text>
				<u-icon name="arrow-right" size="20" color="#ccc" />
			</view>
			<view class="record-item" @click="onLocationClick">
				<up-icon name="bell" size="24" color="#2ecc71" />
				<text>机构通知</text>
				<up-icon name="arrow-right" size="20" color="#ccc" />
			</view>
			<view class="record-item" @click="navionLocationClick">
				<up-icon name="share" size="24" color="#e67e22" />
				<text>分享小程序</text>
				<up-icon name="arrow-right" size="20" color="#ccc" />
			</view>
		</view>

		<!-- 登录弹出框 -->
		<u-popup v-model:show="showLoginPopup" mode="center" :mask-close="true" round="20" bgColor="#d8f3fa">
			<view class="popup-content">
				<button v-if="!avatar || !avatar.trim()" class="button-cover" open-type="chooseAvatar"
					@chooseavatar="ChooseAvatar">上传头像</button>
				<image v-else :src="avatar" class="btn-avatar"></image>
				<input type="nickname" placeholder="请输入昵称" class="wechatname" @input="onInputNickname" />
				<u-button type="primary" shape="circle" @click="wxLogin">登录</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'

	const defaultAvatar = '/static/Avatar.png'
	const avatar = ref('')
	const name = ref('');
	const openid = ref('');
	const loggedIn = ref(false)
	const showLoginPopup = ref(false);
	let currentAvatarTarget = null;

	// 点击外部头像+ 打开弹窗
	const handleAvatarClick = () => {
		if (!name.value?.trim()) {
			// 未登录，弹出登录提示框
			showLoginPopup.value = true;
			return
		}
		currentAvatarTarget = avatar
		ChooseAvatar()
	};
	const close = (promes) => {
		promes.value = false;
	};

	// 选择头像
	const ChooseAvatar = (e) => {
		avatar.value = e.detail.avatarUrl;
	}
	//选择昵称
	const onInputNickname = (e) => {
		name.value = e.detail.value;
	}


	// 跳转管理学员
	const Addto = () => {
		uni.navigateTo({
			url: '/component/manage/manage'
		})
	}

	// 占位点击事件
	const onLocationClick = () => {
		uni.showToast({
			title: '功能待实现',
			icon: 'none'
		})
	}
	/**
	 * 微信登录（只拿 openid/session_key）
	 */
	async function wxLogin() {
		try {
			// 校验头像和昵称
			if (!avatar.value?.trim()) {
				uni.showToast({
					title: '请先上传头像',
					icon: 'none'
				});
				return;
			}
			if (!name.value?.trim()) {
				uni.showToast({
					title: '请先输入昵称',
					icon: 'none'
				});
				return;
			}

			// 获取 code
			const loginRes = await uni.login()

			const payload = {
				code: loginRes.code,
				avatar: avatar.value,
				nickname: name.value
			}
			// 调用云函数
			const res = await uniCloud.callFunction({
				name: 'weixinLogin',
				data: payload
			});
			console.log('云函数返回结果:', res.result)
			if (res.result.code === 0) {
				openid.value = res.result.data.openid
				loggedIn.value = true
				uni.showToast({
					title: '登录成功',
					icon: 'success'
				})
				close(showLoginPopup);
			} else {
				uni.showToast({
					title: res.result.msg || '登录失败',
					icon: 'none'
				})
			}
		} catch (err) {
			console.error('登录失败:', err)
			uni.showToast({
				title: '登录失败，请重试',
				icon: 'none'
			})
		}
	};
	// 页面显示时更新 tabBar
	onShow(() => {
		const page = getCurrentPages().pop()
		const tabBar = page?.getTabBar?.()
		if (typeof tabBar?.setData === 'function') {
			tabBar.setData({
				selected: 1
			})
		}
	});
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>