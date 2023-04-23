<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
	<!-- @getuserinfo事件处理函数的形参中可以从中获取用户的基本信息 -->
	<button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
	import { createNamespacedHelpers } from 'vuex'
	const m_user = createNamespacedHelpers('m_user')
	export default {
		name:"my-login",
		data() {
			return {
				
			};
		},
		computed: {
			...m_user.mapState(['redirectInfo']),
		},
		methods: {
			...m_user.mapMutations(['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			getUserInfo(e) {
				console.log(e, '一键登录')
				if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了授权登录！')
				
				// 获取到用户信息， 保存到vuex中
				this.updateUserInfo(e.detail.userInfo)
				// 获取token
				this.getToken(e.detail)
			},
			async getToken(info) {
				const [err, res] = await uni.login().catch(err => err)
				// 判断uni.login是否调用成功
				if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')
				
				// 参数对象
				const query = {
				    code: res.code,
				    encryptedData: info.encryptedData,
				    iv: info.iv,
				    rawData: info.rawData,
				    signature: info.signature
				  }
				
				console.log(11111111)
				  // 获取 token  接口不能用
				  // const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
				  // if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
				  uni.$showMsg('登录成功')
				  this.updateToken(loginResult.meta.token)
				  const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo' // 假token
				  this.updateToken(token)
				  // 若从某个页面过来，则登录成功后返回某页
				  if (this.redirectInfo) {
					  uni[this.redirectInfo.openType]({
						  url: this.redirectInfo.url,
						  complate: () => {
							  this.updateRedirectInfo(null)
						  }
					  })
				  }
			}
		}
	}
</script>

<style lang="scss">
.login-container {
  // 登录盒子的样式
  height: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;

  // 绘制登录盒子底部的半椭圆造型
  &::after {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    background-color: white;
    border-radius: 100%;
    transform: translateY(50%);
  }

  // 登录按钮的样式
  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #c00000;
  }

  // 按钮下方提示消息的样式
  .tips-text {
    font-size: 12px;
    color: gray;
  }
}
</style>