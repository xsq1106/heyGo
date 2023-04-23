<template>
	<view>
		<view class="search-box">
			<my-search @click="gotoSearch"></my-search>
		</view>
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item, index) in swiperList" :key="index">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<image :src="item.image_src" mode=""></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 分类导航 -->
		<view class="nav-list">
			<view v-for="(item,index) in navList" :key="index" @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>
		<!-- 楼层区域 -->
		<view class="floor-list">
			<view v-for="(item,index) in floorList" :key="index">
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<view class="floor-img-box">
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>
					<view class="right-img-box">
						<navigator v-for="(subItem,subIndex) in item.product_list" :key="subIndex" v-if="subIndex !== 0" :url="subItem.url">
							<image :src="subItem.image_src" mode="widthFix" :style="{width: subItem.image_width + 'rpx'}"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		mixins: [badgeMix],
		data() {
			return {
				value: '',
				swiperList: [],
				navList: [],
				floorList: [],
			};
		},
		onLoad() {
			this.getSwiperList()
			this.getNavList()
			this.getfloorList()
		},
		methods: {
			async getSwiperList() {
				const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata')
				console.log(res, 'res')
				if (res.meta.status !== 200) return uni.$showMsg
				uni.$showMsg('数据请求成功')
				this.swiperList = res.message
			},
			async getNavList() {
				const { data: res } = await uni.$http.get('/api/public/v1/home/catitems')
				console.log(res, 'res')
				if (res.meta.status !== 200) return uni.$showMsg
				uni.$showMsg('数据请求成功')
				this.navList = res.message
			},
			navClickHandler(item) {
				// 判断点击的是哪个nav
				if (item.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},
			async getfloorList() {
				const { data: res } = await uni.$http.get('/api/public/v1/home/floordata')
				if (res.meta.status !== 200) return uni.$showMsg
				uni.$showMsg('数据请求成功')
				res.message.forEach(item => {
					item.product_list.forEach(subItem => {
						subItem.url = '/subpkg/goods_list/goods_list?' + subItem.navigator_url.split('?')[1]
					})
				})
				this.floorList = res.message
				console.log(this.floorList, 'this.floorList')
			},
			gotoSearch() {
				console.log('gotosearchhhhh')
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
swiper {
 height: 330rpx;

 .swiper-item,
 image {
   width: 100%;
   height: 100%;
 }
}
.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;

  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}
.floor-title {
  height: 60rpx;
  width: 100%;
  display: flex;
}
.right-img-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.floor-img-box {
  display: flex;
  padding-left: 10rpx;
}
.search-box {
	position: sticky;
	top: 0;
	z-index: 999;
}
</style>
