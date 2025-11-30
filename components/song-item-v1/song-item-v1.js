Component({
  properties:{
    songData:{
      type:Object,
      value:{},
    }
  },
  methods:{
    onRecommendItemTap() {
      wx.navigateTo({
        url: `/PackagePlayer/pages/player/player?id=${this.properties.songData.id}`
      })
    }
  }
})