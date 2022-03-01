<template>
	<view class="list">
		<view class="fixbg" :style="{ backgroundImage: `url(${list.coverImgUrl})` }"></view>
		<navigation title="歌单" :icon="true" color="white"></navigation>
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true">
				<!-- 头部信息区域 -->
				<view class="head">
					<view class="list-head-img">
						<image :src="list.coverImgUrl"></image>
						<text class="iconfont yousanjiao">{{ list.playCount | formatCount }}</text>
					</view>
					<view class="list-head-text">
						<view>{{ list.name }}</view>
						<!-- 多层表达式，不加虽然数据可以正常加载但是会报错 -->
						<view v-if="list.creator">
							<image :src="list.creator.avatarUrl"></image>
							{{ list.creator.nickname }}
						</view>
						<view>{{ list.description }}</view>
					</view>
				</view>
				<!-- 歌单列表区域 -->
				<view class="list-music">
					<view class="list-music-head">
						<text class="iconfont bofang"></text>
						<text>播放全部</text>
						<text>(共{{ list.trackCount }}首)</text>
					</view>
					<view class="list-music-item" v-for="(item, index) in list.tracks" :key="index"
						@tap="handleToDetail(item.id)">
						<view class="list-music-index">{{ index + 1 }}</view>
						<view class="list-music-song">
							<view>{{ item.name }}</view>
							<view>
								<text v-for="(i, d) in item.ar">{{ i.name }}
									<text v-if="d != item.ar.length - 1">/</text>
								</text>
								<text>{{ ' - ' + item.al.name }}</text>
							</view>
						</view>
						<view class="iconfont bofang1"></view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import navigation from '@/components/navigation/navigation.vue'
	import '@/static/iconfont/iconfont.css'
	import {
		listDetail
	} from '../../common/api.js'
	export default {
		data() {
			return {
				list: {},
				privileges: [],
				isLoading: true
			}
		},
		onLoad(options) {
			uni.showLoading({
				title: '加载中...'
			})

			listDetail(options.id).then(res => {
				this.list = res[1].data.playlist
				this.privileges = res[1].data.privileges
				this.$store.commit('INIT_IDS', res[1].data.playlist.trackIds)
				this.isLoading = false
				uni.hideLoading()
			})
		},
		methods: {
			handleToDetail(id) {
				this.$store.commit('NEXT_ID', id)
				uni.navigateTo({
					url: '/pages/detail/detail?id=' + id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.head {
		display: flex;
		padding: 30rpx;

		.list-head-img {
			width: 264rpx;
			height: 264rpx;
			border-radius: 20rpx;
			overflow: hidden;
			position: relative;
			margin-right: 42rpx;

			image {
				width: 100%;
				height: 100%;
			}

			text {
				position: absolute;
				right: 12rpx;
				top: 8rpx;
				color: #fff;
				font-size: 26rpx;
			}
		}

		.list-head-text {
			flex: 1;
			color: #f0f2f7;

			view:nth-child(1) {
				color: #fff;
				font-size: 34rpx;
			}

			view:nth-child(2) {
				display: flex;
				align-items: center;
				margin: 20rpx 0;
				font-size: 24rpx;

				image {
					width: 54rpx;
					height: 54rpx;
					border-radius: 50%;
					margin-right: 14rpx;
				}
			}

			view:nth-child(3) {
				line-height: 34rpx;
				font-size: 22rpx;
				// 最多显示两行
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}
		}

	}

	.list-music {
		background-color: #fff;
		border-radius: 50rpx 50rpx 0 0;
		margin-top: 40rpx;
		padding: 30rpx 30rpx 0 30rpx;
		min-height: calc(100% - 390rpx);

		.list-music-head {
			height: 50rpx;
			margin-bottom: 70rpx;

			text:nth-child(1) {
				height: 50rpx;
				font-size: 40rpx;
			}

			text:nth-child(2) {
				margin: 0 10rpx 0 26rpx;
				font-size: 30rpx;
			}

			text:nth-child(3) {
				font-size: 26rpx;
				color: #b2b2b2;
			}
		}

		.list-music-item {
			display: flex;
			align-items: flex-start;
			padding: 0 16rpx 46rpx 0;
			color: #959595;

			.list-music-index {
				padding-top: 5rpx;
				width: 58rpx;
				font-size: 30rpx;
				text-align: center;
			}

			.list-music-song {
				flex: 1;
				margin-left: 20rpx;

				view:nth-child(1) {
					width: 60vw;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					font-size: 28rpx;
					color: #000;
					margin-bottom: 12rpx;
				}

				view:nth-child(2) {
					width: 60vw;
					font-size: 20rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.iconfont {
				padding-top: 10rpx;
				font-size: 50rpx;
				color: #c7c7c7;
			}
		}
	}
</style>
