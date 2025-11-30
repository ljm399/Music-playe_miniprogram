import { c_menuList } from "../../baseData/index.js"
import menuStore from "../../store/menuStore.js"

Page({
  data: {
    avatarUrl: '',
    nickname: '',
    isLoggedIn: false,
    profileBox:[
      {
        name: 'collection',
        text: '我的收藏'
      },
      {
        name:'favor',
        text:'我的喜欢'
      },
      {
        name:'history',
        text:'历史记录'
      }
    ],
    show: false,
    menuName: '',
    menuList: []
  },
  onLoad() {
    if(wx.getStorageSync('avatarUrl').isLoggedIn) {
      this.setData({
        avatarUrl: wx.getStorageSync('avatarUrl').avatarUrl,
        nickname: wx.getStorageSync('nickname'),
        isLoggedIn: true
      })
    }
    menuStore.onState("menuList",this.handleMenuList)
  },
  // ===== store数据接收处理函数 =====
  handleMenuList(value) {
    this.setData({menuList:value})
  },

  onUnload() {
    menuStore.offState("menuList",this.handleMenuList)
  },

  // ===== 登录相关代码 ===========
  async onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({avatarUrl,isLoggedIn: true})
    const res = await wx.cloud.callFunction({
      name: 'getOpenid',
    })
    wx.setStorageSync("openid", res.result.openid)
    wx.setStorageSync("avatarUrl", { avatarUrl, isLoggedIn: true })
    },
  onNicknameTap(e) {
    wx.setStorageSync("nickname", this.data.nickname)
  },

  // ===== 事件如点击 =====
  // 点击喜欢，收藏，历史图标
  onProfileBoxTap(event) {
    const {name,text} = event.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/detail-song/detail-song?type=profile&name=${name}&text=${text}` 
    })
  },

  // 点击创建歌单
  onCreatePlaylistTap() {
    this.setData({show: true})
  },
  onClose() {
    this.setData({show: false})
  },
  async onConfirm() {
    const menuName = this.data.menuName
    const menuList = {
      name: menuName,
      songList:[]
    }
    const res = await c_menuList.add(menuList)
    if(res) {
      menuStore.dispatch("fetchMenuListData")
      wx.showToast({
        title: '歌单创建成功'
      })
    }
    this.setData({show: false, menuName: ''})
  },

  // 删除歌单
  async onDeleteTap(event) {
    const id = event.currentTarget.dataset.id
    const res = await c_menuList.delete(id)
    if(res) {
      wx.showToast({
        title: '删除歌单成功'
      })
      menuStore.dispatch("fetchMenuListData")
    }
  },

  // 点击歌单
  onProfileMenuTap(event) {
    const id = event.currentTarget.dataset.id
    // console.log(event.currentTarget.dataset)
    wx.navigateTo({
      url: `/pages/detail-song/detail-song?type=profileMenu&id=${id}` 
    })
  }
})