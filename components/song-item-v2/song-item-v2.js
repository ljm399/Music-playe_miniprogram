Component({
  properties: {
    songData: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onSongItem() {
      // console.log("11",this.properties.songData)
      wx.navigateTo({
        url: `/pages/detail-song/detail-song?type=menu&id=${this.properties.songData.id}`,
      })
    }
  }
})