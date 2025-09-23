<template>
	<view class="container">
		<!-- 在线课程卡片 -->
		<view car-car-image>
			<image src="../../static/卡片1.png" mode="aspectFill" class="banner-image"></image>
		</view>

		<!-- 功能图标区域 -->
		<view class="function-area">
			<view class="function-row">
				<view class="function-item">
					<view class="function-icon bg-green">
						<u-icon name="edit-pen" color="#ffffff" size="24"></u-icon>
					</view>
					<text class="function-text">课后作业</text>
				</view>
				<view class="function-item">
					<view class="function-icon bg-orange">
						<u-icon name="calendar" color="#ffffff" size="26"></u-icon>
					</view>
					<text class="function-text">我的课程</text>
				</view>
				<view class="function-item">
					<view class="function-icon bg-blue">
						<u-icon name="list" color="#ffffff" size="24"></u-icon>
					</view>
					<text class="function-text">上课记录</text>
				</view>
				<view class="function-item">
					<view class="function-icon bg-purple">
						<u-icon name="checkbox-mark" color="#ffffff" size="24"></u-icon>
					</view>
					<text class="function-text">打卡作业</text>
				</view>
			</view>

			<view class="function-row">
				<view class="function-item">
					<view class="function-icon bg-cyan">
						<u-icon name="star" color="#ffffff" size="24"></u-icon>
					</view>
					<text class="function-text">评价老师</text>
				</view>
				<view class="function-item">
					<view class="function-icon bg-blue-light">
						<u-icon name="play-right" color="#ffffff" size="24"></u-icon>
					</view>
					<text class="function-text">在线约课</text>
				</view>
				<view class="function-item">
					<view class="function-icon bg-green-light">
						<u-icon name="bell" color="#ffffff" size="24"></u-icon>
					</view>
					<text class="function-text">请假</text>
				</view>
				<view class="function-item">
					<view class="function-icon bg-blue-dark">
						<u-icon name="chat" color="#ffffff" size="24"></u-icon>
					</view>
					<text class="function-text">课后点评</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onShow
	} from '@dcloudio/uni-app';

	onShow(() => {
		const page = getCurrentPages().pop();
		const tabBar = page?.getTabBar?.()
		if (typeof tabBar?.setData === 'function') {
			tabBar.setData({
				selected: 0
			})
		}
	});
</script>

<style scoped lang="scss">
	@import'index.scss'
</style>