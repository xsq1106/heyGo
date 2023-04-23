<template>
	<!-- 最外层的容器 -->
	<view class="my-settle-container">
	  <!-- 全选区域 -->
	  <label class="radio" @click="changeAllState">
	    <radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
	  </label>
	
	  <!-- 合计区域 -->
	  <view class="amount-box">
	    合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
	  </view>
	
	  <!-- 结算按钮 -->
	  <view class="btn-settle"  @click="settlement">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import { createNamespacedHelpers } from 'vuex'
	const m_cart = createNamespacedHelpers('m_cart')
	const m_user = createNamespacedHelpers('m_user')
	export default {
		name:"my-settle",
		data() {
			return {
				seconds: 3,
				timer: null,
			};
		},
		computed: {
			...m_cart.mapGetters(['checkedCount', 'cartTotal', 'checkedGoodsAmount', 'addstr']),
			...m_user.mapGetters(['addstr']),
			...m_user.mapState(['token']),
			...m_cart.mapState(['cart']),
			// 2. 是否全选
			isFullCheck() {
			  return this.cartTotal === this.checkedCount
			},
		},
		methods: {
			...m_cart.mapMutations(['updateAllGoodsState']),
			...m_user.mapMutations(['updateRedirectInfo']),
			changeAllState() {
				this.updateAllGoodsState(!this.isFullCheck)
			},
			settlement() {
				console.log(this, 'thissss')
				if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品')
				if (!this.addstr)  return uni.$showMsg('请选择收货地址')
				if (!this.token) this.delayNavigate()
				
				this.payOrder()
			},
			showTip(n) {
				console.log(n, 'n')
				uni.showToast({
					icon: 'none',
					title: '请登陆后再结算！' + n + '秒后跳转到登录页',
					mask: true, // 添加遮罩层，防止点击穿透
					duration: 1500,
				})
			},
			delayNavigate() {
				this.seconds = 3
				this.showTip(this.seconds)
				
				this.timer = setInterval(() => {
					this.seconds--
					console.log(this.seconds, 'seconds')
					if (this.seconds <= 0) {
						clearTimeout(this.timer)
						uni.switchTab({
							url: '/pages/my/my',
							success: () => {
								this.updateRedirectInfo({
									openType: 'switchTab',
									url: '/pages/cart/cart'
								})
							}
						})
						return
					}
					this.showTip(this.seconds)
				}, 1000)
			},
			async payOrder() {
				// 创建订单
				  // 1.1 组织订单的信息对象
				  const orderInfo = {
				    // 开发期间，注释掉真实的订单价格，
				    // order_price: this.checkedGoodsAmount,
				    // 写死订单总价为 1 分钱
				    order_price: 0.01,
				    consignee_addr: this.addstr,
				    goods: this.cart.filter(x => x.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
				  }
				  // 1.2 发起请求创建订单
				  const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
				  if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
				  // 1.3 得到服务器响应的“订单编号”
				    const orderNumber = res.message.order_number
				  
				// 订单预支付
				 // 2.1 发起请求获取订单的支付信息
				   const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
				   // 2.2 预付订单生成失败
				   if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')
				   // 2.3 得到订单支付相关的必要参数
				   const payInfo = res2.message.pay
				   
				// 发起微信支付
				// 3.1 调用 uni.requestPayment() 发起微信支付
				const [err, result] = await uni.requestPayment(payInfo)
				// 3.2 未完成支付
				   if (err) return uni.$showMsg('订单未支付！')
				   // 3.3 完成了支付，进一步查询支付的结果
				   const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
				   // 3.4 检测到订单未支付
				   if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
				   // 3.5 检测到订单支付完成
				   uni.showToast({
				     title: '支付完成！',
				     icon: 'success'
				   })
				
			}
		}
	}
</script>

<style lang="scss">
.my-settle-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  // 将背景色从 cyan 改为 white
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  font-size: 14px;

  .radio {
    display: flex;
    align-items: center;
  }

  .amount {
    color: #c00000;
  }

  .btn-settle {
    height: 50px;
    min-width: 100px;
    background-color: #c00000;
    color: white;
    line-height: 50px;
    text-align: center;
    padding: 0 10px;
  }
}
</style>