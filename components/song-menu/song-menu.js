const app = getApp()
Component({
  data:{
    screenWidth:375
  },
  properties: {
    title:{
      type:String,  
      value:''
    },
    moreText:{
      type:String,
      value:''
    },
    recommendSongList:{
      type:Array,
      value:[]
    }
  },
  lifetimes:{
    attached(){
      this.setData({
        screenWidth:app.globalData.screenWidth
      })
    }
  },
  methods:{
    onMoreTap() {
      wx.navigateTo({
        url: '/pages/detail-menu/detail-menu',
      })
    }
  }
})