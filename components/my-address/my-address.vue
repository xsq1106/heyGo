<template>
	<view>
	  <!-- 选择收货地址的盒子 -->
	  <view class="address-choose-box"  v-if="JSON.stringify(address) === '{}'">
	    <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
	  </view>
	
	  <!-- 渲染收货信息的盒子 -->
	  <view class="address-info-box" v-else  @click="chooseAddress">
	    <view class="row1">
	      <view class="row1-left">
	        <view class="username">收货人：<text>{{address.userName}}</text></view>
	      </view>
	      <view class="row1-right">
	        <view class="phone">电话：<text>{{address.telNumber}}</text></view>
	        <uni-icons type="arrowright" size="16"></uni-icons>
	      </view>
	    </view>
	    <view class="row2">
	      <view class="row2-left">收货地址：</view>
	      <view class="row2-right">{{addstr}}</view>
	    </view>
	  </view>
	
	  <!-- 底部的边框线 -->
	  <image src="/static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
	import { createNamespacedHelpers } from 'vuex'
	const { mapMutations, mapState, mapGetters } = createNamespacedHelpers('m_user')
	export default {
		name:"my-address",
		data() {
			return {
				// 收货地址
				// address: {},
			};
		},
		computed: {
			...mapState(['address']),
			...mapGetters(['addstr']),
		},
		methods: {
			...mapMutations(['updateAddress']),
			async chooseAddress() {
				// 调用uni内置方法选择收获地址的功能，第一个值时错误对象，第二个值时成功之后的收获对象
				const [err, succ] = await uni.chooseAddress()
				// 用户成功获取收获地址
				if (err === null && succ.errMsg === 'chooseAddress:ok') {
					// this.address = succ
					this.updateAddress(succ)
				}
				// 用户没有授权 Android机上提示chooseAddress:fail auth deny，iphone机上提示chooseAddress:fail authorize no response
				// 2023/4/21现在没有授权了
				if (err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response')) {
					this.reAuth()
				}
			},
			async reAuth() {
				// 提示用户对地址进行授权
				const [err2, confirmResult] = await uni.showModal({
					content: '检测到您没打开地址权限，是否去设置打开？',
					confirmText: '确认',
					cancelText: '取消',
				})
				
				// 如果弹框异常，则直接退出 
				if (err2) return
				
				// 如果用户点击了取消，则提示'您取消了授权地址'
				if (confirmResult.cancel) return uni.$showMsg('您取消了授权地址!')
				
				// 如果用户点击了取消，则调用uni.openSetting()方法进入授权页面，让用户重新授权
				if (confirmResult.confirm) return uni.openSetting({
					success: (settingResult) => {
						if (settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功！请选择地址')
						if (!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了授权地址！')
					}
				})
			}
		}
	}
</script>

<style lang="scss">
// 底部边框线的样式
.address-border {
  display: block;
  width: 100%;
  height: 5px;
}

// 选择收货地址的盒子
.address-choose-box {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 渲染收货信息的盒子
.address-info-box {
  font-size: 12px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5px;

  // 第一行
  .row1 {
    display: flex;
    justify-content: space-between;

    .row1-right {
      display: flex;
      align-items: center;

      .phone {
        margin-right: 5px;
      }
    }
  }

  // 第二行
  .row2 {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .row2-left {
      white-space: nowrap;
    }
  }
}
</style>