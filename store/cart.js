export default {
  // 为当前模块开启命名空间
  namespaced: true,

  // 模块的 state 数据
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('goods_cart') || '[]'),
  }),

  // 模块的 mutations 方法
  mutations: {
	setCart(state, goods) {
		// 判断购物车内是否存在该商品，存在，则goods_count+1
		let idx = state.cart.findIndex(item => item.goods_id === goods.goods_id)
		if (idx !== -1) {
			state.cart[idx].goods_count += 1
		} else {
			state.cart.push(goods)
		}
		console.log(this, 'thi8sss')
		this.commit('m_cart/saveToStorage')
	},
	// 更新购物车中商品的勾选状态
	updateGoodsState(state, goods) {
	  // 根据 goods_id 查询购物车中对应商品的信息对象
	  const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
	
	  // 有对应的商品信息对象
	  if (findResult) {
	    // 更新对应商品的勾选状态
	    findResult.goods_state = goods.goods_state
	    // 持久化存储到本地
	    this.commit('m_cart/saveToStorage')
	  }
	},
	// 更新购物车中商品的数量
	updateGoodsCount(state, goods) {
	  // 根据 goods_id 查询购物车中对应商品的信息对象
	  const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
	
	  if(findResult) {
	    // 更新对应商品的数量
	    findResult.goods_count = goods.goods_count
	    // 持久化存储到本地
	    this.commit('m_cart/saveToStorage')
	  }
	},
	// 根据 Id 从购物车中删除对应的商品信息
	removeGoodsById(state, goods_id) {
	  // 调用数组的 filter 方法进行过滤
	  state.cart = state.cart.filter(x => x.goods_id !== goods_id)
	  // 持久化存储到本地
	  this.commit('m_cart/saveToStorage')
	},
	// 更新所有商品的勾选状态
	updateAllGoodsState(state, newState) {
	  // 循环更新购物车中每件商品的勾选状态
	  state.cart.forEach(x => x.goods_state = newState)
	  // 持久化存储到本地
	  this.commit('m_cart/saveToStorage')
	},
	saveToStorage(state) {
		uni.setStorageSync('goods_cart', JSON.stringify(state.cart))
	}
  },

  // 模块的 getters 属性
  getters: {
	  cartTotal(state) {
		  const sum = state.cart.map(item => (item.goods_count)).reduce((p, c) => (p + c), 0)
		  console.log(sum, 'summm-getter')
		  return sum
	  },
	  // 勾选的商品的总数量
	  checkedCount(state) {
	    // 先使用 filter 方法，从购物车中过滤器已勾选的商品
	    // 再使用 reduce 方法，将已勾选的商品总数量进行累加
	    // reduce() 的返回值就是已勾选的商品的总数量
	    return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
	  },
	  // 已勾选的商品的总价
	  checkedGoodsAmount(state) {
	    // 先使用 filter 方法，从购物车中过滤器已勾选的商品
	    // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
	    // reduce() 的返回值就是已勾选的商品的总价
	    // 最后调用 toFixed(2) 方法，保留两位小数
	    return state.cart.filter(x => x.goods_state)
	                     .reduce((total, item) => total += item.goods_count * item.goods_price, 0)
	                     .toFixed(2)
	  }
  },
}