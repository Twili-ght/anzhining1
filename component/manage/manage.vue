<template>
	<view class="content">
		<view class="u-demo-block">
			<view class="u-demo-block__content">
				<u-table2 :data="tableData" :columns="columnsCheck" row-key="_id"
					@selection-change="handleSelectionChange" />
			</view>
		</view>
		<view class="footer-box">
			<up-button type="primary" shape="circle" size="18" text="添加"></up-button>
			<up-button type="error" shape="circle" size="18" text="删除"></up-button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted
	} from 'vue'
	import cloudRequest from '../../cloudRequest/index.js'

	// 表格数据
	const tableData = ref([])

	// 表格列配置
	const columnsCheck = reactive([{
			type: 'selection'
		},
		{
			title: '姓名',
			key: 'nickname'
		},
		{
			title: '年龄',
			key: 'age'
		}
	])

	// 选择改变事件处理
	const handleSelectionChange = (selection) => {
		console.log('选中的行:', selection)
	}
	onMounted(async () => {
		uniCloud.callFunction({
			name: 'queryCollection',
			data: {
				collectionName: 'user',
				query: {},
				page: 1,
				pageSize: 300,
				orderBy: [
					['create_time', 'desc']
				],
				field: null
			},
			success: res => {
				tableData.value = res.result.data;
				console.log('查询结果:', res.result.data);
			},
			fail: err => {
				console.error('调用失败:', err);
			}
		});

	})
</script>

<style lang="scss">
	.content {
		padding: 15px;
	}

	.u-demo-block {
		&__title {
			font-size: 14px;
			color: #666;
			margin-bottom: 10px;
		}

		&__content {
			border-radius: 4px;
		}
	}
</style>