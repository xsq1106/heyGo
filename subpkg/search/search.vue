<template>
	<view>
		<view class="search-box">
			<uni-search-bar @input="input" :radius="100" cancelButton="none" placeholder="请输入搜搜内容"></uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
		  <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
		    <view class="goods-name">{{item.goods_name}}</view>
		    <uni-icons type="arrowright" size="16"></uni-icons>
		  </view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
		  <!-- 标题区域 -->
		  <view class="history-title">
		    <text>搜索历史</text>
		    <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
		  </view>
		  <!-- 列表区域 -->
		  <view class="history-list">
		    <uni-tag :text="item" v-for="(item, i) in historyList" :key="i" @click="gotoGoodsList(item)"></uni-tag>
		  </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				searchValue: '',
				searchResults: [],
				historyList: ['a', 'app', 'apple']
			};
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('searchHis') || '[]')
		},
		methods: {
			input(e) {
			    // e.value 是最新的搜索内容
			    console.log(e)
				// 做防抖处理
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.searchValue = e
					this.getSearchList()
				}, 500)
			},
			  // 根据搜索关键词，搜索商品建议列表
			async getSearchList() {
			    // 判断关键词是否为空
			    if (this.searchValue === '') {
			      this.searchResults = []
			      return
			    }
			    // 发起请求，获取搜索建议列表
			    const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.kw })
			    if (res.meta.status !== 200) return uni.$showMsg()
			    this.searchResults = res.message
				this.saveSearchHistory()
			  },
			gotoDetail(goods_id) {
				uni.navigateTo({
				  // 指定详情页面的 URL 地址，并传递 goods_id 参数
				  url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				})
			},
			saveSearchHistory() {
				let arr = [this.searchValue, ...this.historyList]
				this.historyList = [...new Set(arr)]
				
				// 将记录存储在本地
				uni.setStorageSync('searchHis', JSON.stringify(this.historyList))
			},
			cleanHistory() {
				this.historyList = []
				uni.setStorageSync('searchHis', '[]')
			},
			gotoGoodsList(item) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query='+item
				})
			}
		}
	}
</script>

<style lang="scss">
.uni-searchbar {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  position: relative;
  padding: 16rpx;
  /* 将默认的 #FFFFFF 改为 #C00000 */
  background-color: #c00000;
}
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}
.sugg-list {
  padding: 0 5px;

  .sugg-item {
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .goods-name {
      // 文字不允许换行（单行文本）
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      // 文本溢出后，使用 ... 代替
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
}
.history-box {
  padding: 0 5px;

  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }

  .history-list {
    display: flex;
    flex-wrap: wrap;

    .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
