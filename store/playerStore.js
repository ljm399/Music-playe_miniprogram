import {HYEventStore} from "hy-event-store";
import {fetchSongDetail, fetchLyric} from "../services/player"
import parseLyrics from "../utils/parse-lyrics"
import { c_history } from "../baseData/index.js";
export const audioContext = wx.createInnerAudioContext()
const playerStore = new HYEventStore({
  state:{
    playSongList:[],
    playSongIndex:0,

    songDetail:[],

    lyricsArr:[],
    currentLyricIndex:-1,
    lyric:'',
    lyricInfos:[],
    lyricScrollTop:0,

    ids:0,
    isPlay:true,
    isFirstPlay:true,

    duration:0,
    currentTime:0,
    sliderValue:0,
    
    isSlidering:false,

    // 播放模式
    modeIndex:0,
    playModes: ['list-cycle', 'single-loop', 'random'],
    isLoop:false,
    isClickSlider:false
  },
  actions:{
    // ==== 网络请求 ====
    // 获取歌曲详情比如封面、歌名、歌手等
    // 获取和解析歌词
    async setMusicInfoAction(ctx,id) {
      // 判断是否第二次播放同一首歌
      if(ctx.ids === id) return
      // 1.重置状态
      ctx.songDetail = []
      ctx.lyricsArr = []
      ctx.currentLyricIndex = -1
      ctx.lyric = ''
      ctx.duration = 0
      ctx.currentTime = 0
      ctx.sliderValue = 0
      ctx.isPlay = true
      ctx.isFirstPlay = true

      // 2.保存id
      ctx.ids = id
      await fetchSongDetail(id).then(res => {
        ctx.songDetail = res.songs
      })
      await fetchLyric(id).then(res => {
        const lyrics = parseLyrics(res.lrc.lyric)
        ctx.lyricsArr = lyrics
      })
      this.dispatch("songPlayAction")
      c_history.add(ctx.songDetail[0])
    },
    
    // === 音乐播放,受setMusicInfoAction控制 ===
    songPlayAction(ctx) {
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.ids}.mp3`
      audioContext.autoplay = true
      
      if(ctx.isFirstPlay){
        ctx.isFirstPlay = false
        // 2.监听播放的进度
        audioContext.onTimeUpdate(() => {
          this.dispatch("updateProgressAction")
        })
        // 3.监听音频加载中事件。(必须有，辅助slider点击用的，且只用添加一次)
        audioContext.onWaiting(() => {
          audioContext.pause()
        })
        // 4.监听音频进入可以播放状态的事件。（必须有，辅助slider点击用的，且只用添加一次）
        audioContext.onCanplay(() => {
          audioContext.play()
        })
        // 5.监听音频播放结束
        audioContext.onEnded(() => {
          if(ctx.isLoop) {
            audioContext.loop = true
            audioContext.play()
            return
          }
          ctx.isPlay = false
        })
      }
    },

    // 监听进度条和歌词匹配
    updateProgressAction(ctx) {
       // 2.1.只修改一次duration
      if(!ctx.duration) {
        ctx.duration = audioContext.duration * 1000
      } // 这里的duration从音频加载中事件中获取，但这里duration是不完整的，完整的duration从发送获取歌曲详情时一起获取
      // 但这里依旧是使用音频加载中事件中的duration，否则会出错

      if(ctx.isClickSlider) {
        setTimeout(() => {
          ctx.isClickSlider = false 
          // console.log(ctx.isClickSlider)
        }, 600);
      }
      // 2.2.修改播放的时间 和 修改滑动的进度 
      if(!ctx.isSlidering && !ctx.isClickSlider){
        ctx.currentTime = audioContext.currentTime * 1000
        // ctx.sliderValue = audioContext.currentTime / audioContext.duration * 100
      }

      // 2.3. 歌词匹配
      if (!ctx.lyricsArr.length) return
      let index = ctx.lyricsArr.length - 1
      for (let i = 0; i < ctx.lyricsArr.length; i++) {
        if(ctx.lyricsArr[i].time > audioContext.currentTime * 1000){
          index = i - 1
          break
        } 
      }
      // 2.4.歌词匹配产生的问题和解决
      // 2.4.1.这里是多余的，因为i为0时，上面的if判断不会通过，会直接进入i=1的判断
      // if(index < 0) {
      //   index = 0
      //   console.log("wozhixingle")
      // }

      // 2.4.2. 当index和currentLyricIndex一样的时候，不需要继续执行，比如当下一句歌词是9s时，然后其距离上一句有5s间隔，那这五秒内不需要继续执行下面代码
      if(ctx.currentLyricIndex === index ) return

      // index=0和index=lyricsArr.length-1时，歌词不需要滚动，因为这两个设置了padding
      // index=1时，因为每个元素滚动需要的是上一个元素的高度，所以当index=1时，获取到index=0，而其高度太大，所以这里直接放弃第一个元素的高度
      if(index === 0 || index === 1 || index === ctx.lyricsArr.length - 1) {
        ctx.lyric = ctx.lyricsArr[index].lyric
        ctx.currentLyricIndex = index
        return
      }

      if(!ctx.lyricInfos) return
      let scrollTop = 0
      for (let i = 1; i < index; i++) {
        scrollTop += ctx.lyricInfos[i].height
      }
      // 2.5. 设置歌词
      ctx.lyric = ctx.lyricsArr[index].lyric
      ctx.currentLyricIndex = index
      ctx.lyricScrollTop = scrollTop
    },

    // 播放按钮事件
    playTapAction(ctx) {
      if(audioContext.paused) {
        audioContext.play()
        ctx.isPlay = true        
      } else {
        audioContext.pause()
        ctx.isPlay = false
      }
    },
   
    // 切换歌曲
    changeSongAction(ctx,isNext = true) {
      audioContext.stop()
  
      if(!ctx.playSongList.length) return
  
      // --- 切换核心代码 ----
      if(!ctx.playSongList) return
      let length = ctx.playSongList.length
      let index = ctx.playSongIndex
      switch(ctx.modeIndex) {
        case 1:// 单曲循环
          ctx.isLoop = true
        case 0:// 列表循环
          index = isNext ? ctx.playSongIndex + 1 : ctx.playSongIndex - 1
          if(index < 0) index = length - 1
          if(index === length) index = 0
          break;
        case 2:// 随机播放:
          let randomIndex = Math.floor(Math.random() * length)
          index = randomIndex
          break
      }
      
      ctx.playSongIndex = index
      const id = ctx.playSongList[index].id
      // 播放新歌曲
      this.dispatch("setMusicInfoAction", id)
    },

    // 改变播放模式
    changeModeTapAction(ctx) {
      let modeIndex = (ctx.modeIndex + 1) % 3
      ctx.modeIndex = modeIndex
      if(modeIndex === 1) {
        ctx.isLoop = true
      }else {
        ctx.isLoop = false
      }
    },
  }
})
export default playerStore