<template>
	<view v-if="goods_info.goods_name" class="goods-detail-container">
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
		  <swiper-item v-for="(item, i) in goods_info.pics" :key="i">
		    <image :src="item.pics_big" @click="preview(i)"></image>
		  </swiper-item>
		</swiper>
		<!-- 商品信息区域 -->
		<view class="goods-info-box">
		  <!-- 商品价格 -->
		  <view class="price">￥{{goods_info.goods_price}}</view>
		  <!-- 信息主体区域 -->
		  <view class="goods-info-body">
		    <!-- 商品名称 -->
		    <view class="goods-name">{{goods_info.goods_name}}</view>
		    <!-- 收藏 -->
		    <view class="favi">
		      <uni-icons type="star" size="18" color="gray"></uni-icons>
		      <text>收藏</text>
		    </view>
		  </view>
		  <!-- 运费 -->
		  <view class="yf">快递：免运费</view>
		</view>
		<!-- 商品详情信息 -->
		<!-- 使用rich-text将带有html标签的内容，渲染为小程序的页面 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		<!-- 商品导航组件 -->
		<view class="goods_nav">
			<!-- fill 控制右侧按钮的样式 -->
			<!-- options 左侧按钮的配置项 -->
			<!-- buttonGroup 右侧按钮的配置项 -->
			<!-- click 左侧按钮的点击事件处理函数 -->
			<!-- buttonClick 右侧按钮的点击事件处理函数 -->
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	import { createNamespacedHelpers } from 'vuex'
	const { mapState, mapMutations, mapGetters } = createNamespacedHelpers('m_cart')

	export default {
		data() {
			return {
				goods_info: {},
				options: [
					{ icon: 'shop', text: '店铺' },
					{ icon: 'cart', text: '购物车', info: 0 }
				],
				buttonGroup: [
					{ text: '加入购物车', backgroundColor: '#ff0000', color: '#fff'},
					{ text: '立即购买', backgroundColor: '#ffa200', color: '#fff'}
					
				],
			};
		},
		onLoad(options) {
			const goods_id = options.goods_id
			this.getGoodsDetail(goods_id)
		},
		computed: {
			...mapState(['cart']),
			...mapGetters(['cartTotal'])
		},
		watch: {
			cartTotal: {
				handler(val) {
					this.options[1].info = val
				},
				immediate: true,
			}
		},
		methods: {
			...mapMutations(['setCart']),
			async getGoodsDetail(goods_id) {
				const { data: res } = await uni.$http.get('/api/public/v1/goods/detail', { goods_id })
				if (res.meta.status !== 200) return uni.$showMsg()
				
				// 使用字符串的replace方法，为img标签添加行内样式display:block，解决图片底部空白间隙的问题
				// 以及解决ios不能识别webp格式的图片，将其转换为jpg格式
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display: block;"').replace(/webp/g, '.jpg')
				
				// 为 data 中的数据赋值
				this.goods_info = res.message
			},
			preview(i) {
				uni.previewImage({
					// 预览时默认显示的图片索引
					current: i,
					// 所有图片url地址的数组
					urls: this.goods_info.pics.map(item => item.pics_big)
				})
			},
			onClick(e) {
				console.log(e, 'e')
				if (e.content.text === '购物车') {
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			},
			buttonClick(e) {
				console.log(e, 'e')
				if (e.content.text === '加入购物车') {
					const goods = {
						 goods_id: this.goods_info.goods_id,       // 商品的Id
						 goods_name: this.goods_info.goods_name,   // 商品的名称
						 goods_price: this.goods_info.goods_price, // 商品的价格
						 goods_count: 1,                           // 商品的数量
						 goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
						 goods_state: true                         // 商品的勾选状态
					}
					this.setCart(goods)
					console.log(this.cart, this.cartTotal, 'cart111111')
				}
			},
		}
	}
</script>

<style lang="scss">
swiper {
  height: 750rpx;

  image {
    width: 100%;
    height: 100%;
  }
}
// 商品信息区域的样式
.goods-info-box {
  padding: 10px;
  padding-right: 0;

  .price {
    color: #c00000;
    font-size: 18px;
    margin: 10px 0;
  }

  .goods-info-body {
    display: flex;
    justify-content: space-between;

    .goods-name {
      font-size: 13px;
      padding-right: 10px;
    }
    // 收藏区域
    .favi {
      width: 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #efefef;
      color: gray;
    }
  }

  // 运费
  .yf {
    margin: 10px 0;
    font-size: 12px;
    color: gray;
  }
}
.goods-detail-container {
  // 给页面外层的容器，添加 50px 的内padding，
  // 防止页面内容被底部的商品导航组件遮盖
  padding-bottom: 50px;
}

.goods_nav {
  // 为商品导航组件添加固定定位
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
