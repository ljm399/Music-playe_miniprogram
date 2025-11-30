import { methods } from "underscore";

Component({
  properties: {
    songInfo: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: 0
    }
  },
  methods:{
    onSongItemTap() {
      wx.navigateTo({
        url: `/PackagePlayer/pages/player/player?id=${this.properties.songInfo.id}`,
      })
      
    }
  }

})