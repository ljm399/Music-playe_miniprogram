import playerStore,{audioContext} from "../../../store/playerStore"
import { throttle } from "underscore"

const app = getApp()
Page({
  data: {
    ids: 0,
    songDetail:[],
    statusBarHeight:0,
    tabsArr:["歌曲", "歌词"],
    activeIndex:0,
    contentHeight:0,

    // 音乐播放的数据
    sliderValue:0,
    currentTime:0,
    duration:0,

    // 图片动态展示需要
    isPlay:true,

    lyric:"",
    lyricsArr:[],
    currentLyricIndex:-1,
    lyricScrollTop:0,
    lyricInfos: [],

    //store里面的数据
    playSongList:[],
    playSongIndex:0,

    isFirstPlay:true,
    isSlidering:false,

    // 播放模式
    modeIndex:0,
    playModes: [],
    isLoop:false,

    // states数组
    statesArr: ['playSongList', 'playSongIndex', 'songDetail', "lyricsArr", "currentLyricIndex", "lyric", "lyricScrollTop", 'ids',"isPlay", "isFirstPlay", "duration", "currentTime", "sliderValue", "isSlidering", "modeIndex", "playModes", "isLoop"],
  },
  async onLoad(options) {
    // 先重置样式
    await this.resetStyle()

    const id = options.id
    this.setData({
      ids:id,
      statusBarHeight: app.globalData.statusBarHeight,
      contentHeight: app.globalData.contentHeight
    })

    // ===== 音乐播放 ======
    if(id) {
      playerStore.dispatch("setMusicInfoAction", id)
    }

    // ===== 监听store数据变化 ======
    playerStore.onStates(this.data.statesArr, this.monitorMusicInfo)
  },


  // ======= store数据变化事件 =======
  monitorMusicInfo({playSongList, playSongIndex, songDetail, lyricsArr, currentLyricIndex, lyric, lyricScrollTop, ids,isPlay, isFirstPlay, duration, currentTime, sliderValue, isSlidering, modeIndex, playModes, isLoop}) {
    // 不是playSongList.length，因为第一次监听value里面是空的，它会触发两次，第二次才有
    if(playSongList) {
      this.setData({
        playSongList:playSongList,
      })
    }
    if(playSongIndex !== undefined) {
      this.setData({
        playSongIndex:playSongIndex
      })
    }
    if(songDetail) {
      this.setData({
        songDetail:songDetail,
      })
    }
    if(lyricsArr) {
      this.setData({
        lyricsArr:lyricsArr,
      })
      // 在获取到歌词数据并渲染后，再获取歌词高度
      this.getLyricHeight()
    }
    if(currentLyricIndex !== undefined){
      this.setData({
        currentLyricIndex:currentLyricIndex
      })
    }
    if(lyric) {
      this.setData({
        lyric:lyric,
      })
    }
    if(lyricScrollTop !== undefined){
      this.setData({
        lyricScrollTop:lyricScrollTop
      })
    }
    if(ids !== undefined) {
      this.setData({
        ids:ids,
      })
    }
    if(isPlay !== undefined) {
      this.setData({
        isPlay:isPlay,
      })
    }
    if(isFirstPlay !== undefined) {
      this.setData({
        isFirstPlay:isFirstPlay,
      })
    }
    if(duration !== undefined) {
      this.setData({
        duration:duration,
      })
    }
    if(currentTime) {
      this.setData({
        currentTime:currentTime,
      })
      this.updataprocess(currentTime)
    }
    // if(sliderValue !== undefined) {
    //   this.setData({
    //     sliderValue:sliderValue,
    //   })
    // }
    if(isSlidering !== undefined) {
      this.setData({
        isSlidering:isSlidering,
      })
    }
    if(modeIndex !== undefined) {
      this.setData({
        modeIndex:modeIndex,
      })
    }
    if(playModes) {
      this.setData({
        playModes:playModes,
      })
    }
    if(isLoop !== undefined) {
      this.setData({
        isLoop:isLoop,
      })
    }
  },

  // 卸载store相关的数据事件
  onUnload() {
    playerStore.offStates(this.data.statesArr, this.monitorMusicInfo)
  },

  // 解决onTimeUpdate内部bug问题
  updataprocess: throttle(function(currentTime) {
    if (this.data.isSlidering) return
    const sliderValue = currentTime / this.data.duration * 100
    this.setData({
      sliderValue
    })
  }, 600, {
    leading: false,
    trailing: false
  }),
  
// 获取歌词高度的方法
  getLyricHeight() {
    // 获取歌词高度
    wx.createSelectorQuery().selectAll('.lyrics-item').boundingClientRect().exec(res => {
      if (!res[0]) return;
      // console.log(res)// 里面的数组是歌词的高度
      const lyricInfos = []
      for (const rect of res[0]) {
        const height = rect.height + 10
        lyricInfos.push({ height})
      }
      playerStore.setState("lyricInfos",lyricInfos)
    });
  },


  //  ==== 音乐播放相关事件 =========

  // 点击slider事件(由于比较频繁，所以不用再dispatch)
  handleSliderChange(event) {
    this.data.isSlidering = false
    // 1.获取点击后滑动的进度
    const value = event.detail.value

    // 2.计算要播放的时间
    const currentTime = value / 100 * this.data.duration
    // 3.播放音乐
    // 播放前先停止
    
    audioContext.seek(currentTime/1000)
    playerStore.setState('isClickSlider',true)

    this.setData({
      currentTime,
      sliderValue: value,
      isPlay: true,
    })
    playerStore.setState("isPlay", true)
  },

  // 滑动slidering事件(由于比较频繁，所以不用再dispatch)
  handleSliderChanging: throttle(function(event) {
    // 1.获取点击后滑动的进度
    const value = event.detail.value
    this.data.isSlidering = true

    // // 2.计算要播放的时间
    const currentTime = value / 100 * this.data.duration
    
    this.setData({
      currentTime
    })
  }, 100),


  // 播放按钮事件
  handlePlayTap() {
    playerStore.dispatch("playTapAction")
  },

  // 上一首，下一首
  onPrevTap() {
    // 先重置样式
    this.resetStyle()
    playerStore.dispatch("changeSongAction", false)
  },
  onNextTap() {
    // 先重置样式
    this.resetStyle()
    playerStore.dispatch("changeSongAction", true)
  },  

  // 改变播放模式
  onChangeModeTap() {
    playerStore.dispatch("changeModeTapAction")
  },

  // 重置样式
  resetStyle() {
    this.setData({
      lyricsArr: [],
      currentLyricIndex: -1,
      lyric: '',
      lyricScrollTop: 0,
      isPlay: true,
      isFirstPlay: true,
      duration: 0,
      currentTime: 0,
      sliderValue: 0,
      isSlidering: false,
      modeIndex: 0,
      isLoop: false
    })
  },


  // ==== tabs中left图片返回事件 ====
  handleLeftTap() {
    wx.navigateBack()
  },

  // ==== 轮播图触发事件 和 navbar上的tab点击事件 ====
  // 这里不用，因为外部几乎不可能用到这里的数据
  handleSwiperChange(event) {
    // console.log(event)
    this.setData({
      activeIndex: event.detail.current
    })
  },
  handleTabClick(event) {
    // console.log(event)
    this.setData({
      activeIndex: event.currentTarget.dataset.index
    })
  },
  
})