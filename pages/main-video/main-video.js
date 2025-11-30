import {getTopMV} from '../../services/video'
Page({
  data: {
    videoList: [],
    offset: 0,
    hasMore: true//作用：减少重复请求
  },
  onLoad() {
    this.getMVList()
  },

  // ========= 发送请求获取数据 =========
  async getMVList() {
    // const res = await getTopMV(10,this.data.videoList.length)
    // 使用offset记录当前请求的页数
    const res = await getTopMV(10,this.data.offset)
    this.setData({
      videoList: [...this.data.videoList,...res.data],
      hasMore: res.data.length >= 10,
      offset: this.data.offset + 10
    })
  },

  // ========= 加载更多 和 下拉刷新 =========
  async refreshMVList() {
    // const res = await getTopMV(10,0)
    this.setData({
      // videoList: res.data,
      videoList: [],
      hasMore: false,
      offset: 0
    })
    await this.getMVList()
    wx.stopPullDownRefresh()
  },
  // 到达底部加载更多
  onReachBottom() {
    this.getMVList()
  },
  // 下拉更新
  onPullDownRefresh() {
    if (!this.data.hasMore) return //减少重复请求
    this.refreshMVList()
  },

  // ========= 跳转详情页 =========
  onVideoItemTap(event) {
    const item = event.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/detail-video/detail-video?id=${item.id}`,
    })
  }
})