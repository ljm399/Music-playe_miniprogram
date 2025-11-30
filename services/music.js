import { hyRequest,hyRequest2 } from './request'
export function fetchBannerImg(type=2) {
  return hyRequest.get({
    url: '/banner',
    data: {
      type
    }
  })
}

export function fetchRecommendList(id=3778678) {
  return hyRequest.get({
    url: '/playlist/detail',
    data: {
      id
    }
  })
}

export function fetchSongList(cat = '全部',limit = 10,offset = 0) {
  return hyRequest.get({
    url: '/top/playlist',
    data: {
      cat,
      limit,
      offset
    }
  })
}

export function fetchAllSongList() {
  return hyRequest.get({
    url: '/playlist/hot',
  })
}

export function fetchPeakList(id) {
  return hyRequest.get({
    url: '/playlist/detail',
    data: {
      id
    }
  })
}
