import {fetchBannerImg,fetchRecommendList,fetchSongList, fetchPeakList} from '../../services/music'
import getHeight from '../../utils/getHeight'
// import hyThrottle from '../../utils/hyThrottle'
import { throttle, values } from 'underscore'
import recommendStore from '../../store/recommendStore'
import rankingStore, { peakSongsInfos } from '../../store/rankingStore'
import playerStore from '../../store/playerStore'

const ThrottleGetHeight = throttle(getHeight,100)
Page({
  data:{
    bannerList:[],
    swiperHeight:0,

    // 推荐歌曲
    recommendSongs:[],

    // 热门歌单 和 推荐歌单
    hotSongList:[],
    recommendSongList:[],

    // 巅峰榜
    rankingInfos:{},
    hasData:false,

    // 音乐播放器
    songDetail:[],
    isPlay:false
  },


// ========= 调转页面代码 =========
  // 跳转搜索页面
  onSearchFocus() {
    wx.navigateTo({
      url: '/pages/detail-search/detail-search',
    })
  },
  // 点击推荐更多跳转到歌单页面
  onRecommendMoreTap() {
    wx.navigateTo({
      url: `/pages/detail-song/detail-song?type=recommend&name=recommendInfos`,
    })
  },


// ========= onLoad =================
  onLoad() {
    // ====== 发送请求代码 ======
    // 1.发送获取轮播图数据请求
    this.getBannerImg()    
    // 2.发送获取推荐歌单和热门歌单数据请求
    this.getSongList()

    // ====== 发送action ======
    // 1.获取推荐歌曲
    // recommendStore.onState("recommendList", this.handleRecommendList)
    recommendStore.onState("recommendInfos", this.handleRecommendSongs)
    recommendStore.dispatch('fetchRecommendListData')

    // 2.获取巅峰榜数据
    for(const key in peakSongsInfos) {
      rankingStore.onState(key,this.handleRankingList(key))
    }
    rankingStore.dispatch('fetchPeakListData')
 
    
    // 3.获取音乐播放器数据
    playerStore.onStates(["songDetail","isPlay"],this.handleSongDetail)
    // ===== onLoad非发送网络请求代码 =====
    
  },

  // ========= onState注册的事件 =====
  handleRecommendSongs(value) {
    if(!this) return
    if(!value.tracks) return
    this.setData({recommendSongs:value.tracks.slice(0,6)})
  },
  // 高阶函数，一般都会使用到return
  handleRankingList(key) {
    return (value) => {
      if(!this) return
      this.setData({rankingInfos:{...this.data.rankingInfos,[key]:value},
      hasData:true})
    }
  },
  handleSongDetail({songDetail,isPlay}) {
    if(!this) return
    // this.setData({songDetail,isPlay})
    // console.log(songDetail,isPlay)
    if(songDetail) {
      this.setData({songDetail})
    }
    if(isPlay !== undefined) {
      this.setData({isPlay})
    }
  },

  // ======== offState注册的事件 =====
  onUnload() {
    recommendStore.offState("recommendInfos", this.handleRecommendSongs)
    for(const key in peakSongsInfos) {
      rankingStore.offState(key, this.handleRankingList(key))
    }
    playerStore.offState("songDetail",this.handleSongDetail)
  },


  // ========= 网络请求代码 =========
  // 轮播图数据
  async getBannerImg() {
    const res = await fetchBannerImg()
    this.setData({
      bannerList: res.banners
    })
  },
  // 热门歌单和推荐歌单
  async getSongList() {
    fetchSongList().then(res => {
      this.setData({
        hotSongList:res.playlists
      })
    })
    fetchSongList("华语").then(res => {
      this.setData({
        recommendSongList:res.playlists
      })
    })
  },


// ========= 处理其他问题的代码 =========
  // swiper外框和图片高度不同，导致指示器位置不正确
  async onSwiperImgLoad() {
    const height = await ThrottleGetHeight('.swiper-img')
    this.setData({
      swiperHeight: height
    })
  },

  // 点击推荐歌曲跳转到播放页面
  onSongV1Tap(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playSongList", this.data.recommendSongs)
    playerStore.setState("playSongIndex", index)
  },

  // 点击播放按钮
  onPlayTap() {
    playerStore.dispatch("playTapAction")
  },
  // 点击播放器跳转到播放页面
  onPlayerNavTap() {
    wx.navigateTo({
      url: '/PackagePlayer/pages/player/player',
    })
  }

})