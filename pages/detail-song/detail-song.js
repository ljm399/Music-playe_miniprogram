import recommendStore from "../../store/recommendStore"
import rankingStore from "../../store/rankingStore"
import {fetchRecommendList} from "../../services/music"
import playerStore from "../../store/playerStore"
import { c_collection,c_favor,c_menuList,db } from "../../baseData/index.js"
import menuStore from "../../store/menuStore.js"

// const db = wx.cloud.database()
// const collection = db.collection("c_collection")
// const favor = db.collection("c_favor")

Page({
  data: {
    name:"",
    songInfos:{},
    menuList:[]
  },
  onLoad(options) {
    // console.log(options) // {type: "rankingList", name: "newSongsInfo"}
    if(options.type === "rankingList") {
      const name = options.name
      this.data.name = name
      rankingStore.onState(name, this.handleRanking)
    } else if(options.type === "recommend") {
      this.data.name = options.name
      recommendStore.onState("recommendInfos",this.handleRanking)
    } else if(options.type === "menu") {
      const id = options.id
      this.setData({name:options.type})
      fetchRecommendList(id).then(res => {
        this.setData({ songInfos: res.playlist })
      })
    } else if(options.type === "profile") {
      this.handleProfileEvent(options)
    } else if(options.type === "profileMenu") {
      this.handleProfileEvent(options)
    }

    menuStore.onState("menuList",this.handleMenuList)
  },

  // ===== 处理profile页面跳转过来携带的数据函数 ======
  async handleProfileEvent(options) {
    if(options.type === "profile") {
      const {name,text} = options
      const collection = db.collection(`c_${name}`)
      const res = await collection.get()
      const songInfos = {
        name:text,
        tracks:res.data
      }
      this.setData({songInfos})
    } else if( options.type === "profileMenu") {
      const id = options.id
      const res = await c_menuList.query(id)
      // console.log(res)
      const songInfos = {
        name:res.data.name,
        tracks:res.data.songList
      }
      this.setData({songInfos})
    }
    
  },

  onUnload() {
    if(this.data.name === "recommendInfos") {
      recommendStore.offState("recommendInfos", this.handleRanking)
    } else if(this.data.name === "rankingList") {
      rankingStore.offState(this.data.name,this.handleRanking)
    }
  },

  // ======== store数据接收处理函数 ========
  // 接和收recommendStore数据
  handleRanking(value) {
    if(this.data.name === "recommendInfos") {
      value.name = "推荐榜"
    }
    if (!this) return
    this.setData({ songInfos: value })
    wx.setNavigationBarTitle({
      title: value.name
    })
  },

  // 接和收playStore数据
  onDetailSongTap(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playSongList", this.data.songInfos.tracks)
    playerStore.setState("playSongIndex", index)
  },

  // 接和收menuStore数据
  handleMenuList(value) {
    this.setData({menuList:value})
  },

  // ======== 其他事件处理函数 ========  
  // 点击更多
  onMoreTap(event) {
    const item = event.currentTarget.dataset.item
    wx.showActionSheet({
      itemList: ['我的收藏', '我的喜欢',"其他歌单"],
      success: (res) => {
        const index = res.tapIndex
        this.AddToCorrespondingBox(index,item)
      }
    })
  },
  // 添加歌曲到对应的歌单（收藏，喜欢，其他歌单）
  async AddToCorrespondingBox(index,item) {
    let res = null
    let menuNames = this.data.menuList.map(item => item.name)
    switch(index) {
      case 0:
        res = await c_collection.add(item)
        break;
      case 1:
        res = await c_favor.add(item)
        break;
      case 2:
        wx.showActionSheet({
          itemList: menuNames,
          success: (res) => {
            const index = res.tapIndex
            this.AddToCorrespondingMenu(index,menuNames[index],item)
          }
      })
        break;
    }
    if(res) {
      const title = index === 0 ? '我的收藏' : '我的喜欢'
      wx.showToast({
        title: `添加到${title}成功`,
      })
    }
  },
  // 添加歌曲到对应的歌单（其他歌单）
  async AddToCorrespondingMenu(index,menuName,item) {
    const cmd = db.command
    // console.log(index,menuName,item)
    // console.log(this.data.menuList[index]._id)
    // const res = await db.collection("c_menuList").doc(this.data.menuList[index]._id).update({
    //   data:{
    //     songList: cmd.push(item)
    //   }
    // })
    const res = await c_menuList.update({songList: cmd.push(item)},this.data.menuList[index]._id)
    if(res) {
      wx.showToast({
        title: `添加成功到${menuName}`,
      })
    }
  }


})