import { methods } from "underscore";

Component({
  properties:{
    itemData:{
      type:Object,
      value:{},
    },
    rankName:{
      type:String,
      value:"",
    }
  },
  
  methods:{
    onRankingItemTap() {
      wx.navigateTo({
        url: `/pages/detail-song/detail-song?type=rankingList&name=${this.properties.rankName}`,
      })
    }
  }
})