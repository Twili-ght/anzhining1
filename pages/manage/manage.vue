<template>
	<view class="content">
		<view class="u-demo-block">
			<!-- 表头 -->
			<view class="tr th">
				<view class="td">姓名</view>
				<view class="td">年级</view>
			</view>

			<!-- 表体 -->
			<scroll-view scroll-y class="table-body">
				<view class="tr" v-for="item in tableData" :key="item._id">
					<view class="td checkbox">
						<checkbox :checked="checkedIds.includes(item._id)" @tap="toggleRow(item)" />
					</view>
					<view class="td">{{ item.nickname }}</view>
					<view class="td">{{ item.grade }}</view>
				</view>
			</scroll-view>
		</view>

		<!-- 底部按钮 -->
		<view class="footer-box">
			<up-button type="error" shape="circle" text="删除" :custom-style="customStyle" @click="handleDelete" />
			<up-button type="primary" shape="circle" text="刷新" :custom-style="customStyle" @click="getTableData" />
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed,
		onMounted
	} from 'vue'

	/* 表格数据 */
	const tableData = ref([])

	/* 选中行 id */
	const checkedIds = ref([])

	/* 底部按钮样式 */
	const customStyle = reactive({
		width: '30%'
	})

	/* 是否全选 */
	const isAllChecked = computed(() => {
		return (
			tableData.value.length > 0 &&
			checkedIds.value.length === tableData.value.length
		)
	})

	/* 单行选择 */
	const toggleRow = (row) => {
		const index = checkedIds.value.indexOf(row._id)
		if (index > -1) {
			checkedIds.value.splice(index, 1)
		} else {
			checkedIds.value.push(row._id)
		}
	}

	/* 全选 / 取消全选 */
	const toggleAll = () => {
		if (isAllChecked.value) {
			checkedIds.value = []
		} else {
			checkedIds.value = tableData.value.map(item => item._id)
		}
	}

	/* 删除 */
	const handleDelete = async () => {
		if (!checkedIds.value.length) {
			return uni.showToast({
				title: '请先选择要删除的用户',
				icon: 'none'
			})
		}

		uni.showModal({
			title: '确认删除',
			content: `确定删除 ${checkedIds.value.length} 个用户吗？`,
			success: async (res) => {
				if (!res.confirm) return

				uni.showLoading({
					title: '删除中...'
				})
				try {
					const result = await uniCloud.callFunction({
						name: 'Delete',
						data: {
							ids: checkedIds.value
						}
					})

					if (result.result?.code === 200) {
						uni.showToast({
							title: '删除成功'
						})
						checkedIds.value = []
						getTableData()
					} else {
						uni.showToast({
							title: result.result?.msg || '删除失败',
							icon: 'none'
						})
					}
				} catch (e) {
					uni.showToast({
						title: '服务器错误',
						icon: 'none'
					})
				} finally {
					uni.hideLoading()
				}
			}
		})
	}

	/* 查询数据 */
	const getTableData = async () => {
		uni.showLoading({
			title: '加载中...'
		})
		try {
			const res = await uniCloud.callFunction({
				name: 'queryCollection',
				data: {
					collectionName: 'user',
					page: 1,
					pageSize: 300,
					orderBy: [
						['create_time', 'desc']
					]
				}
			})
			tableData.value = res.result?.data || []
		} catch (e) {
			uni.showToast({
				title: '加载失败',
				icon: 'none'
			})
		} finally {
			uni.hideLoading()
		}
	}

	onMounted(getTableData)
</script>

<style lang="scss" scoped>
	@import "index.scss";

	.content {
		padding: 24rpx;
	}

	.u-demo-block {
		// border: 2rpx solid #8c8c8c;
		border-radius: 8rpx;
		overflow: hidden;
	}

	/* 表头 / 行 */
	.tr {
		display: flex;
	}

	.th {
		background: #f5f5f5;
		font-weight: bold;
	}

	/* 单元格 */
	.td {
		flex: 1;
		padding: 16rpx;
		// border-right: 1rpx solid #8c8c8c;
		border-bottom: 1rpx solid #8c8c8c;
		text-align: center;
		box-sizing: border-box;
	}

	.checkbox {
		flex: 0 0 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 表体滚动 */
	.table-body {
		max-height: 600rpx;
	}
</style>