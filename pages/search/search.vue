<template>
	<view class="search-container">
		<navigation title="搜索" :icon="true"></navigation>
		<view class="container">
			<scroll-view scroll-y="true">
				<!-- 顶部搜索条 -->
				<view class="search-search">
					<text class="iconfont search"></text>
					<input type="text" placeholder="搜索歌曲" v-model="searchWord" @confirm="handleToSearch(searchWord)" @input="handleToSuggest" />
					<text class="iconfont close" v-show="searchWord != ''" @tap="handleToClose"></text>
				</view>
				<!-- 历史记录和热搜区 -->
				<block v-if="searchType === 1">
					<!-- 历史记录 -->
					<view class="search-history" v-if="searchHistory.length > 0">
						<view class="head">
							<text>历史记录</text>
							<text class="iconfont delete" @tap="handleToClear"></text>
						</view>
						<view class="search-history-list">
							<view v-for="(item, index) in searchHistory" :key="index" @tap="handleToSearch(item)">{{ item }}</view>
						</view>
					</view>
					<!-- 热搜榜 -->
					<view class="search-hot">
						<view class="head">
							<text>热搜榜</text>
						</view>
						<view class="search-hot-item" v-for="(item, index) in searchHot" :key="index"
							@tap="handleToSearch(item.searchWord)">
							<view class="search-hot-index">{{ index + 1 }}</view>
							<view class="search-hot-word">
								<view>
									{{ item.searchWord }}
									<image :src="item.iconUrl" mode="aspectFit"></image>
								</view>
								<view>{{ item.content }}</view>
							</view>
							<view class="search-hot-count">{{ item.score }}</view>
						</view>
					</view>
				</block>
				<!-- 搜索结果区 -->
				<block v-else-if="searchType === 2">
					<view class="search-result">
						<view class="search-result-item" v-for="(item, index) in searchList" :key="index" @tap="handleToDetail(item.id)">
							<view class="search-result-word">
								<view>{{ item.name }}</view>
								<view>
									<text v-for="(i, d) in item.artists">{{ i.name }}
										<text v-if="d != item.artists.length - 1">{{ ' / ' }}</text>
									</text>
									<text>{{ ' - ' + item.album.name }}</text>
								</view>
							</view>
							<text class="iconfont bofang1"></text>
						</view>
					</view>
				</block>
				<!-- 搜索建议 -->
				<block v-else-if="searchType === 3">
					<view class="search-suggest">
						<view class="top">搜索“{{ searchWord }}”</view>
						<view class="item" v-for="(item, index) in searchSuggest" :key="index" @tap="handleToSearch(item.keyword)">
							<text class="iconfont search"></text>
							<text>{{ item.keyword }}</text>
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import navigation from '@/components/navigation/navigation.vue'
	import '@/static/iconfont/iconfont.css'
	import {
		searchHot,
		searchWord,
		searchSuggest
	} from '../../common/api.js'
	export default {
		data() {
			return {
				searchHot: [],
				searchWord: '',
				searchHistory: [],
				searchType: 1,
				searchList: [],
				searchSuggest: []
			}
		},
		methods: {
			// 按下完成按钮触发搜索
			handleToSearch(searchWord) {
				this.searchWord = searchWord
				this.getSearchList(searchWord)
				
				this.searchHistory.unshift(searchWord)
				// 利用 set 去重
				this.searchHistory = [...new Set(this.searchHistory)]
				// 最多保留十个历史记录
				if (this.searchHistory.length > 10) {
					this.searchHistory.length = 10
				}
				// 本地存储
				uni.setStorage({
					key: 'searchHistory',
					data: this.searchHistory
				})
			},
			// 清空历史记录
			handleToClear() {
				// 本地存储
				uni.removeStorage({
					key: 'searchHistory',
					success: () => {
						this.searchHistory = []
					}
				})
			},
			// 获取搜索列表
			getSearchList(word) {
				searchWord(word).then(res => {
					if(res[1].data.code === 200) {
						// 默认前30首歌
						this.searchList = res[1].data.result.songs
						this.searchType = 2
					}
				})
			},
			// 搜索内容清空
			handleToClose() {
				this.searchWord = ''
			},
			// 去详情页
			handleToDetail(id) {
				uni.navigateTo({
					url: '/pages/detail/detail?id=' + id
				})
			},
			// 搜索建议
			 handleToSuggest(ev) {
				let word = ev.detail.value
				if(word != '') {
					searchSuggest(word).then(res => {
						if(res[1].data.code === 200) {
							this.searchSuggest = res[1].data.result.allMatch
							this.searchType = 3
						}
					})
				}
			 }
		},
		onLoad() {
			searchHot().then((res) => {
				if (res[1].data.code == '200') {
					this.searchHot = res[1].data.data
				}
			})
			uni.getStorage({
				key: 'searchHistory',
				success: (res) => {
					this.searchHistory = res.data
				}
			})
		},
		watch: {
			searchWord(val) {
				// 搜索词为空，返回第一页面
				if(val === '') {
					this.searchType = 1
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-search {
		display: flex;
		background-color: #f7f7f7;
		border-radius: 50rpx;
		align-items: center;
		height: 80rpx;
		margin: 0 30rpx 50rpx 30rpx;

		text {
			font-size: 26rpx;
			margin-left: 28rpx;
			margin-right: 26rpx;
		}

		input {
			font-size: 28rpx;
			flex: 1;
		}
	}

	.search-history {
		margin: 0 30rpx 50rpx 30rpx;
		font-size: 26rpx;

		.head {
			display: flex;
			justify-content: space-between;
			margin-bottom: 36rpx;
		}

		.search-history-list {
			display: flex;
			flex-wrap: wrap;

			view {
				border-radius: 40rpx;
				padding: 16rpx 28rpx;
				background-color: #f7f7f7;
				margin: 0 30rpx 30rpx 0;
			}
		}
	}

	.search-hot {
		margin: 0 30rpx;
		font-size: 26rpx;

		.head {
			margin-bottom: 36rpx;
		}

		.search-hot-item {
			display: flex;
			align-items: center;
			padding-bottom: 58rpx;

			.search-hot-index {
				color: #fb2222;
				width: 60rpx;
				margin-left: 8rpx;
			}

			.search-hot-word {
				font-size: 30rpx;
				width: 70vw;

				image {
					width: 48rpx;
					height: 22rpx;
				}

				view:nth-child(2) {
					font-size: 24rpx;
					color: #878787;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.search-hot-count {
				color: #878787;
			}
		}
	}

	.search-result {
		padding: 30rpx;
		border-top: 2rpx solid #e4e4e4;

		.search-result-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 30rpx;
			margin-bottom: 30rpx;
			border-bottom: 2rpx solid #e4e4e4;

			.search-result-word {
				view:nth-child(1) {
					font-size: 28rpx;
					color: #235790;
					margin-bottom: 12rpx;
				}

				view:nth-child(2) {
					font-size: 22rpx;
					color: #898989;
				}
			}
		}

		.iconfont {
			font-size: 50rpx;
			color: #e4e4e4;
		}
	}

	.search-suggest {
		padding: 30rpx;
		border-top: 2rpx solid #e4e4e4;
		font-size: 26rpx;
		
		.top {
			color: #4574a5;
			margin-bottom: 74rpx;
		}
		.item {
			display: flex;
			align-items: center;
			padding-bottom: 74rpx;
			
			.iconfont {
				color: #bdbdbd;
				margin-right: 28rpx;
			}
		}
	}
</style>
