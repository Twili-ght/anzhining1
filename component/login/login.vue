<template>
	<up-popup :show="show" :round="10" mode="center" @close="close" :overlay="true">
		<view class="popup-outer">
			<view class="popup-body">
				<u-icon name="weixin-fill" size="50" color="#07C160"></u-icon>
				<view class="login-text">微信登录</view>
				<!-- 登录按钮 -->
				<button class="wx-btn" @click="wxLogin">一键登录</button>
			</view>
			<view class="popup-close" @click="close">
				<u-icon name="close-circle" size="40" color="#999"></u-icon>
			</view>
		</view>
	</up-popup>

	<!-- 打开登录弹窗 -->
	<button @click="open">微信登录</button>

	<!-- 登录后再设置头像昵称 -->
	<view v-if="loggedIn" class="profile-form">
		<button open-type="chooseAvatar" @chooseavatar="onChooseAvatar">选择头像</button>
		<image v-if="avatarLocal" :src="avatarLocal" class="avatar-preview"></image>

		<!-- 改成普通 text 输入框 -->
		<input type="text" v-model="nickname" placeholder="请输入昵称" class="nickname-input" />

		<button class="save-btn" @click="saveProfile">保存资料</button>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const show = ref(false)
	const loggedIn = ref(false)
	const openid = ref('')

	// 用户资料
	const avatarLocal = ref('')
	const nickname = ref('')

	function open() {
		show.value = true
	}

	function close() {
		show.value = false
	}

	/**
	 * 微信登录（只拿 openid/session_key）
	 */
	async function wxLogin() {
		try {
			// 获取 code
			const loginRes = await uni.login()

			// 调用云函数
			const res = await uniCloud.callFunction({
				name: 'weixinLogin',
				data: {
					code: loginRes.code
				}
			})

			if (res.result.code === 0) {
				openid.value = res.result.data.openid
				loggedIn.value = true
				uni.showToast({
					title: '登录成功',
					icon: 'success'
				})
				close()
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
	}

	/**
	 * 选择头像
	 */
	function onChooseAvatar(e) {
		avatarLocal.value = e.detail.avatarUrl
	}

	/**
	 * 上传头像 + 保存资料
	 */
	async function saveProfile() {
		if (!avatarLocal.value || !nickname.value) {
			return uni.showToast({
				title: '请先选择头像和输入昵称',
				icon: 'none'
			})
		}
		try {
			// 上传头像到云存储
			const uploadRes = await uniCloud.uploadFile({
				cloudPath: `avatars/${Date.now()}.jpg`,
				filePath: avatarLocal.value
			})

			// 调用 updateUserProfile 云函数
			const res = await uniCloud.callFunction({
				name: 'updateUserProfile',
				data: {
					openid: openid.value,
					avatar: uploadRes.fileID,
					nickname: nickname.value
				}
			})

			if (res.result.code === 0) {
				uni.showToast({
					title: '资料更新成功',
					icon: 'success'
				})
			} else {
				uni.showToast({
					title: res.result.msg || '更新失败',
					icon: 'none'
				})
			}
		} catch (err) {
			console.error(err)
			uni.showToast({
				title: '资料更新失败',
				icon: 'none'
			})
		}
	}
</script>

<style scoped lang="scss">
	@import './index.scss';
</style>