<template>
	<view class="sigin-content">
		<view class="top-content">
			<image class="bg" src="../../static/bg1.png" mode="aspectFill" lazy-load />
			<span class="sigin-date">{{formattedTime}}</span>
		</view>
	</view>
</template>
<script setup>
	const now = new Date()
	const year = now.getFullYear()
	const month = now.getMonth() + 1
	const day = now.getDate()
	const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
	const week = weekMap[now.getDay()]
	const formattedTime = `${year}年${month}月${day}日 ${week}`
</script>

<style lang="scss">
	@import'index.scss'
</style>