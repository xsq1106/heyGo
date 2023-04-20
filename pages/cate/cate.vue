<template>
	<view>
		<my-search></my-search>
		<view>
		    <view class="scroll-view-container">
		      <!-- 左侧的滚动视图区域 -->
		      <scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
				<block v-for="(item, index) in cateList" :key="index">
					<view @click="handleChange(item, index)" :class="['left-scroll-view-item', index === active ? 'active' : '']">{{item.cat_name}}</view>
				</block>
		      </scroll-view>
		      <!-- 右侧的滚动视图区域 -->
		      <scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
		        <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
		          <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
				  <!-- 动态渲染三级分类的列表数据 -->
				      <view class="cate-lv3-list">
				        <!-- 三级分类 Item 项 -->
				        <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
				          <!-- 图片 -->
				          <!-- <image :src="item3.cat_icon"></image> -->
				          <!-- 文本 -->
				          <text>{{item3.cat_name}}</text>
				        </view>
				      </view>

		        </view>
		      </scroll-view>
		    </view>
		  </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active: 0,
				wh: 0, // 窗口的可用宽度 = 屏幕高度- navigatorBar高度 - tabBargaodu
				cateList: [],
				cateLevel2: [],
				scrollTop: 0,
			};
		},
		onLoad() {
			// 获取当前系统的信息
			const sysInfo = uni.getSystemInfoSync()
			// 为wh窗口可用高度动态赋值  -50减去搜索栏的高度
			this.wh = sysInfo.windowHeight - 50
			
			this.getCateList()
		},
		methods: {
			async getCateList() {
				const { data: res } = await uni.$http.get('/api/public/v1/categories')
				console.log(res, 'res')
				if (res.meta.status !== 200) return uni.$showMsg
				uni.$showMsg('数据请求成功')
				this.cateList = res.message
				// 为二级分类赋值
				  this.cateLevel2 = res.message[0].children
			},
			handleChange(item, index) {
				this.active = index
				console.log(this.active, 'active')
				this.cateLevel2 = this.cateList[index].children
				console.log(this.scrollTop, 'scroot')
				this.scrollTop = this.scrollTop ? 0 : 1
			},
				
			gotoGoodsList(item) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid' + item.cat_id
				})
			}
		},
	}
</script>

<style lang="scss">
.scroll-view-container {
  display: flex;

  .left-scroll-view {
    width: 120px;

    .left-scroll-view-item {
      line-height: 60px;
      background-color: #f7f7f7;
      text-align: center;
      font-size: 12px;

      // 激活项的样式
      &.active {
        background-color: #ffffff;
        position: relative;

        // 渲染激活项左侧的红色指示边线
        &::before {
          content: ' ';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}

.cate-lv2-title {
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  padding: 15px 0;
}
.cate-lv3-list {
  display: flex;
  flex-wrap: wrap;

  .cate-lv3-item {
    width: 33.33%;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    image {
      width: 60px;
      height: 60px;
    }

    text {
      font-size: 12px;
    }
  }
}
</style>
