import {
	baseUrl
} from './config.js'

// 获取榜单列表摘要
export const topList = () => {
	return uni.request({
		url: `${baseUrl}/toplist/detail`,
		method: 'GET'
	})

}

// 获取歌单详情
export const listDetail = (id) => {
	return uni.request({
		url: `${baseUrl}/playlist/detail`,
		data: {
			id: id
		},
		method: 'GET'
	})
}

// 获取歌曲详情
export const songDetail = (ids) => {
	return uni.request({
		url: `${baseUrl}/song/detail`,
		data: {
			ids: ids
		},
		method: 'GET'
	})
}

// 获取相似歌曲
export const songSimi = (id) => {
	return uni.request({
		url: `${baseUrl}/simi/song`,
		data: {
			id: id
		},
		method: 'GET'
	})
}

// 获取歌曲评论
export const songComment = (id) => {
	return uni.request({
		url: `${baseUrl}/comment/music`,
		data: {
			id: id
		},
		method: 'GET'
	})
}

// 获取歌词
export const songLyric = (id) => {
	return uni.request({
		url: `${baseUrl}/lyric`,
		data: {
			id: id
		},
		method: 'GET'
	})
}

// 获取歌曲链接
export const songUrl = (id) => {
	return uni.request({
		url: `${baseUrl}/song/url`,
		data: {
			id: id
		},
		method: 'GET'
	})
}

// 获取热搜榜
export const searchHot = () => {
	return uni.request({
		url: `${baseUrl}/search/hot/detail`,
		method: 'GET'
	})
}

// 获取搜索结果
export const searchWord = (keywords) => {
	return uni.request({
		url: `${baseUrl}/search`,
		data: {
			keywords: keywords
		},
		method: 'GET'
	})
}

// 下拉提示
export const searchSuggest = (keywords) => {
	return uni.request({
		url: `${baseUrl}/search/suggest`,
		data: {
			keywords: keywords,
			type: 'mobile'
		},
		method: 'GET'
	})
}
