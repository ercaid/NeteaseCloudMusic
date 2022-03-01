<template>
	<view class="index">
		<navigation title="网易云音乐" :icon="false"></navigation>
		<view class="container">
			<scroll-view scroll-y="true">
				<!-- 顶部搜索条 -->
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont search"></text>
					<input type="text" placeholder="搜索歌曲" />
				</view>

				<!-- 骨架屏 -->
				<skeleton :loading="loading" avatarShape="square" avatarSize="212rpx" :row="3" :showTitle="true"
					v-for="(item, index) in topList" :key="index">
				</skeleton>
				<!-- 下方榜单区域 -->
				<view class="index-list" v-if="!loading">
					<view class="index-list-item" v-for="(item, index) in topList" :key="index"
						@tap="handleToList(item.id)">
						<view class="img">
							<image :src="item.coverImgUrl"></image>
							<text>{{ item.updateFrequency }}</text>
						</view>
						<view class="text">
							<view v-for="(i, d) in item.tracks">{{ d + 1 }}. {{ i.first }} - {{ i.second }}</view>
						</view>
					</view>
				</view>

			</scroll-view>
		</view>
	</view>
</template>

<script>
	import navigation from '@/components/navigation/navigation.vue'
	import Skeleton from '@/components/J-skeleton/J-skeleton.vue'
	import '@/static/iconfont/iconfont.css'
	import {
		topList
	} from '../../common/api.js'
	export default {
		components: {
			navigation,
			Skeleton
		},
		data() {
			return {
				topList: [],
				loading: true,
			}
		},
		onLoad() {
			topList().then(res => {
				this.topList = res[1].data.list
				// 只要前四项
				this.topList.length = 4
				setTimeout(() => {
					this.loading = false
				}, 1000)
			})
		},
		methods: {
			handleToList(id) {
				uni.navigateTo({
					url: '/pages/list/list?id=' + id
				})
			},
			handleToSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index {
		.index-search {
			display: flex;
			background-color: #f7f7f7;
			border-radius: 50rpx;
			align-items: center;
			height: 80rpx;
			margin: 0 30rpx 30rpx 30rpx;

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

		.index-list {
			margin: 0 30rpx;

			.index-list-item {
				display: flex;
				margin-bottom: 34rpx;

				.img {
					width: 212rpx;
					height: 212rpx;
					position: relative;
					border-radius: 30rpx;
					overflow: hidden;
					margin-right: 22rpx;

					image {
						width: 100%;
						height: 100%;
					}

					text {
						position: absolute;
						left: 16rpx;
						bottom: 16rpx;
						color: #fff;
						font-size: 20rpx;
					}
				}

				.text {
					font-size: 24rpx;
					line-height: 66rpx;
				}
			}
		}
	}
</style>
