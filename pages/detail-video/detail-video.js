import { getMVUrl, getMVTitle, getRelated } from '../../services/video'
Page({
  data: {
    id: null,
    mvUrl:null,
    mvTitle:'默认标题',
    relatedData:'默认相关',
    danmuList:[
      {"text":'好看',"color":"#ff0000","time":1},
      {"text":'不好看',"color":"#00ff00","time":2},
      {"text":'真香',"color":"#0000ff","time":3},
      {"text":'真丑',"color":"#ffff00","time":4},
    ]
  },
  onLoad(options) {
    this.setData({
      id: options.id
    })
    if(this.data.id) {
      this.getMVUrl()
      this.getMVTitle()
      this.getRelated()
    }
  },
  async getMVUrl() {
    const res = await getMVUrl(this.data.id)
    this.setData({
      mvUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    })
  },
  async getMVTitle() {
    const res = await getMVTitle()
    this.setData({
      mvTitle: res.title
    })
  },
  async getRelated() {
    const res = await getRelated()
    this.setData({
      relatedData: res.list
    })
  }
})