<template>
	<view>
		<view class="fixbg" :style="{ backgroundImage: `url(${songDetail.al.picUrl})` }"></view>
		<!-- 遮罩层 -->
		<view class="mask"></view>
		<navigation :title="songDetail.name" :icon="true" color="white"></navigation>
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true">
				<!-- 头部唱片区域 -->
				<view class="detail-play">
					<image :class="{ run: isPlay }" :src="songDetail.al.picUrl"></image>
					<text class="iconfont" :class="{ playfill: !isPlay, stop: isPlay }" @tap="play"></text>
					<!-- 指针 -->
					<view></view>
				</view>
				<!-- 歌词区域 -->
				<view class="detail-lyric">
					<view class="detail-lyric-wrap"
						:style=" { transform: 'translateY(' + -( lyricIndex - 1) * 81 + 'rpx)' } ">
						<view class="detail-lyric-row" v-for="(item, index) in songLyric"
							:class="{ active: lyricIndex === index }" :key="index">{{ item.lyric }}</view>
					</view>
				</view>
				<!-- 喜欢这首歌的人也听 -->
				<view class="detail-like">
					<view class="detail-like-title">喜欢这首歌的人也听</view>
					<view class="detail-like-item" v-for="(item, index) in songSimi" :key="index"
						@tap="handleToSimi(item.id)">
						<view class="list-music-img">
							<image :src="item.album.picUrl"></image>
						</view>
						<view class="list-music-song">
							<view>{{ item.name }}</view>
							<view>
								<text v-for="(i, d) in item.artists">{{ i.name }}
									<text v-if="d != item.artists.length - 1">{{ ' / ' }}</text>
								</text>
								<text>{{ ' - ' + item.album.name }}</text>
							</view>
						</view>
						<view class="iconfont bofang1"></view>
					</view>
				</view>
				<!-- 评论 -->
				<view class="detail-comment">
					<view class="detail-comment-head">精彩评论</view>
					<view class="detail-comment-item" v-for="(item, index) in songComment" :key="index">
						<view class="detail-comment-img">
							<image :src="item.user.avatarUrl"></image>
						</view>
						<view class="detail-comment-content">
							<view class="top">
								<view class="name">
									<view>{{ item.user.nickname }}</view>
									<view>{{ item.timeStr }}</view>
								</view>
								<view class="like">
									{{ item.likedCount | formatCount }}
									<text class="iconfont appreciate"></text>
								</view>
							</view>
							<view class="bottom">{{ item.content }}</view>
						</view>
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
		songDetail,
		songSimi,
		songComment,
		songLyric,
		songUrl
	} from '../../common/api.js'
	export default {
		data() {
			return {
				songDetail: {
					al: {}
				},
				songSimi: {},
				privileges: [],
				songComment: [],
				songLyric: [],
				lyricIndex: 0,
				isPlay: false,
				bgAudioMannager: null,
				timer: null,
				isLoading: true
			}
		},
		methods: {
			getMusic(id) {
				uni.showLoading({
					title: '加载中...'
				})
				// 顺序发起所有请求
				Promise.all([songDetail(id), songSimi(id), songComment(id), songLyric(id), songUrl(id)]).then(res => {
					if (res[0][1].data.code === 200) {
						this.songDetail = res[0][1].data.songs[0]
					}
					if (res[1][1].data.code === 200) {
						this.songSimi = res[1][1].data.songs
					}
					if (res[2][1].data.code === 200) {
						this.songComment = res[2][1].data.hotComments
					}
					if (res[3][1].data.code === 200) {
						let lyric = res[3][1].data.lrc.lyric
						// 正则匹配
						let re = /\[([^\]]+)\]([^\[]+)/g
						let result = []
						lyric.replace(re, ($0, $1, $2) => {
							result.push({
								time: this.formatTimeToSec($1),
								lyric: $2
							})
						})
						this.songLyric = result
					}
					if (res[4][1].data.code === 200) {
						this.isPlay = false
						this.lyricIndex = 0
						this.$innerAudio.src = res[4][1].data.data[0].url || ''
						this.listenLyricIndex()
						// 自动播放
						this.$innerAudio.autoplay = true
						this.$innerAudio.onPlay(() => {
							this.isPlay = true
							this.listenLyricIndex()
						})
						this.$innerAudio.onPause(() => {
							this.cancelLyricIndex()
						})
						// 结束播放后
						this.$innerAudio.onEnded(() => {
							this.isPlay = false
							if(this.$store.state.nextId != '') {
								this.getMusic(this.$store.state.nextId)
							}
						})
					}
					this.isLoading = false
					uni.hideLoading()
				})
			},
			// 歌词时间格式化 - 转换成秒数
			formatTimeToSec(value) {
				let arr = value.split(':')
				return parseFloat(arr[0]) * 60 + parseFloat(parseFloat(arr[1]).toFixed(1))
			},
			// 监听播放时间
			listenLyricIndex() {
				clearInterval(this.timer)
				this.timer = setInterval(() => {
					for (let i = 0; i < this.songLyric.length; i++) {
						if (this.$innerAudio.currentTime > this.songLyric[this.songLyric.length - 1].time) {
							this.lyricIndex = this.songLyric.length - 1
							break
						}
						if (this.$innerAudio.currentTime > this.songLyric[i].time && this.$innerAudio.currentTime < this
							.songLyric[i + 1].time) {
							this.lyricIndex = i
						}
					}
				}, 500)
			},
			cancelLyricIndex() {
				clearInterval(this.timer)
			},
			// 播放按钮
			play() {
				// 路径存在才能播放
				if (this.$innerAudio.src != '') {
					if (!this.isPlay) {
						this.$innerAudio.play()
					} else {
						this.$innerAudio.pause()
					}
					this.isPlay = !this.isPlay
				}
			},
			// 跳转到相似歌曲页
			handleToSimi(id) {
				this.getMusic(id)
			}
		},
		onLoad(options) {
			this.getMusic(options.id)
		},
		onUnload() {
			// this.$innerAudio.destroy()
			// this.cancelLyricIndex()
			// this.isPlay = false
			// this.lyricIndex = 0
		},
		onHide() {}
	}
</script>

<style lang="scss" scoped>
	.mask {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.7);
	}

	.detail-play {
		width: 580rpx;
		height: 580rpx;
		position: relative;
		background: url(../../static/disc.png);
		background-size: cover;
		margin: 214rpx auto 0;

		image {
			position: absolute;
			// 水平垂直居中
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			width: 370rpx;
			height: 370rpx;
			border-radius: 50%;
			animation: 10s linear move infinite;
			animation-play-state: paused;
		}

		.run {
			animation-play-state: running;
		}

		@keyframes move {
			from {
				transform: rotate(0);
			}

			to {
				transform: rotate(360deg);
			}
		}

		text {
			position: absolute;
			font-size: 60rpx;
			line-height: 100rpx;
			text-align: center;
			border: 1rpx solid #fff;
			border-radius: 50%;
			color: #fff;
			background-color: rgba(0, 0, 0, 0.4);
			height: 100rpx;
			width: 100rpx;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
		}

		view {
			position: absolute;
			left: 100rpx;
			top: -200rpx;
			right: 0;
			margin: auto;
			width: 230rpx;
			height: 360rpx;
			background: url(../../static/needle.png);
			background-size: cover;
		}
	}

	.detail-lyric {
		margin: 20rpx 30rpx 0;
		font-size: 32rpx;
		// 移动的时候有偏差，暂时设置为81rpx每次
		line-height: 82rpx;
		// 只显示三行
		height: 246rpx;
		overflow: hidden;
		text-align: center;
		color: #6f6e73;

		.detail-lyric-wrap {
			transition: .5s;
		}

		.detail-lyric-row {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.active {
			color: #fff;
		}
	}

	.detail-like {
		margin: 0 30rpx;

		.detail-like-title {
			font-size: 36rpx;
			color: #fff;
			margin: 50rpx 0;
		}

		.detail-like-item {
			display: flex;
			align-items: center;
			padding: 0 16rpx 46rpx 0;
			color: #c6c2bf;

			.list-music-img {
				width: 82rpx;
				height: 82rpx;
				border-radius: 10rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
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
					color: #fff;
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
				font-size: 50rpx;
				color: #717171;
			}
		}
	}

	.detail-comment {
		margin: 0 30rpx;

		.detail-comment-head {
			font-size: 36rpx;
			color: #fff;
			margin: 50rpx 0;
		}

		.detail-comment-item {
			padding-bottom: 28rpx;
			display: flex;

			.detail-comment-img {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 18rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.detail-comment-content {
				flex: 1;
				color: #717171;

				.top {
					display: flex;
					justify-content: space-between;

					.name {
						view:nth-child(1) {
							color: #bfbfbf;
							font-size: 26rpx;
						}

						view:nth-child(2) {
							margin-top: 5rpx;
							font-size: 20rpx;
						}
					}

					.like {
						font-size: 26rpx;

						text {
							margin-left: 8rpx;
						}
					}
				}

				.bottom {
					margin-top: 15rpx;
					font-size: 28rpx;
					line-height: 40rpx;
					color: #fff;
					padding-bottom: 30rpx;
					border-bottom: 0.5px #7f7f7f solid;
				}
			}
		}

		.detail-comment-item:last-child {
			.bottom {
				border: none;
			}
		}
	}
</style>
