<template>
	<view class="navigation" :style="{ color: color }">
		<view class="icon" v-if="icon">
			<text class="iconfont back1" @tap="handleToBack"></text>
			<text class="i"></text>
			<text class="iconfont home" @tap="handleToHome"></text>
		</view>
		<view class="title">{{ title }}</view>
	</view>
</template>

<script>
	import '@/static/iconfont/iconfont.css'
	export default {
		name: "navigation",
		props: ['title', 'icon', 'color'],
		data() {
			return {};
		},
		methods: {
			handleToBack() {
				uni.navigateBack()
			},
			handleToHome() {
				uni.navigateTo({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.navigation {
		position: relative;
		width: 100%;
		height: 75px;
		font-size: 16px;
		line-height: 75px;
		color: #000;

		.icon {
			display: flex;
			justify-content: space-around;
			align-items: center;
			position: absolute;
			left: 10px;
			top: 22.5px;
			width: 90px;
			line-height: 30px;
			height: 30px;
			box-sizing: border-box;
			padding: 0 8px;
			background-color: rgba(0, 0, 0, 0.4);
			font-weight: 200;
			color: #fff;
			border-radius: 15px;
			
			.i {
				height: 20px;
				background-color: rgba(255, 255, 255, 0.4);
				width: 1px;
			}
		}

		.title {
			width: 170px;
			text-align: center;
			position: absolute;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			left: calc(50% - 85px);
		}
	}
</style>
