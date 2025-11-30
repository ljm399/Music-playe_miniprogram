import {fetchAllSongList, fetchSongList} from '../../services/music'
Page({
  data:{
    tagsList:[],
    tagSongList:[],
    
  },
  async onLoad() {
    // 使用await是因为下面的代码需要这里加载后的数据
    const res = await fetchAllSongList()
    this.setData({
      tagsList:res.tags
    })

    const promises = []
    for (let i of this.data.tagsList) {
      const tag = i.name
      promises.push(fetchSongList(tag))
    }
    Promise.all(promises).then(res => {
      this.setData({
        tagSongList: res
      })
    })
  }
})