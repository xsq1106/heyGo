import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('m_cart')
export default {
	onShow: function() {
		console.log('App Show')
		this.setBarBadge() 
	},
	computed: {
		...mapGetters(['cartTotal'])
	},
	watch: {
		cartTotal: {
			handler(val) {
				this.setBarBadge()
			},
			immediate: true,
		}
	},
	methods: {
		setBarBadge() {
			if (!this.cartTotal) {
				uni.removeTabBarBadge({
					index: 2, 
				})
				return
			}
			uni.setTabBarBadge({
				index: 2,
				text: this.cartTotal + '', // text必须是字符串，不能是数字
			})
			
		}
	},
}