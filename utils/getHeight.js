export default function getHeight(element) {
  // 获取图片高度：这种是获取图片的原始高度
  // const height = e.detail.height
  // console.log(height)

  // 获取图片已经展示在页面上的高度，即宽高比已经计算好了
  const query = wx.createSelectorQuery()
  query.select(element).boundingClientRect()
  return new Promise((resolve, reject) => {
    query.exec((res) => {
      const height = res[0].height ? res[0].height : 0
      resolve(height)
    })
  })
}