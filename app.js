// app.js
App({
  globalData:{
    screenWidth:0,
    screenHeight:0,
    statusBarHeight:0,
    contentHeight:0,
  },

  onLaunch() {
    // 获取屏幕宽度
    wx.getSystemInfo({
      success: res => {
        this.globalData.screenWidth = res.screenWidth
        this.globalData.screenHeight = res.screenHeight
        this.globalData.statusBarHeight = res.statusBarHeight
        this.globalData.contentHeight = res.screenHeight - res.statusBarHeight - 44
      }
    }),
    // 云开发能力初始化
    wx.cloud.init({
      env: 'cloud1-5g8f2khsc6705020',
    })
  },
  globalData: {
    userInfo: null
  },
})
