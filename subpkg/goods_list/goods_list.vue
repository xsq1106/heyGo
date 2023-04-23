<template>
	<view>
		<view class="goods-list">
			<block v-for="(goods, i) in goodsList" :key="i">
				<my-goods :goods="goods" @click="gotoDetail(goods)"></my-goods>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj: {
					// 查询关键词
					query: '',
					// 商品分类Id
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pagesize: 10
				},
				// 商品列表的数据
				goodsList: [],
				// 总数量，用来实现分页
				total: 0,
				// 默认的空图片
			}
		},
		onLoad(options) {
			// this.queryObj.query = options.query
			// this.queryObj.cid = options.cid
			// 调用获取商品列表数据的方法
			this.getGoodsList()
		},
		onPullDownRefresh() {
			this.queryObj.pagenum = 1
			this.goodsList = []
			this.getGoodsList()
		},
		onReachBottom() {
			this.queryObj.pagenum += 1
			this.getGoodsList()
		},
		methods: {
			async getGoodsList() {
				const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				console.log(res, 'res')
				if (res.meta.status !== 200) return uni.$showMsg()
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
			},
			gotoDetail(item) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			},
		},
		
	}
</script>

<style lang="scss">
	.goods-item {
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;

		.goods-item-left {
			margin-right: 5px;

			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.goods-item-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
			}

			.goods-price {
				font-size: 16px;
				color: #c00000;
			}
		}
	}
</style>
