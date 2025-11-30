import { hyRequest,hyRequest2 } from './request'
export function getTopMV(limit=10,offset=0) {
  return hyRequest.get({
    url: '/top/mv',
    data: {
      limit,
      offset
    }
  })
}

export function getMVUrl(id) {
  return hyRequest.get({
    url:'/mv/url',
    data:{
      id
    }
  })
}

export function getMVTitle() {
  return hyRequest2.get({
    url:'/home/goodprice'
  })
}

export function getRelated() {
  return hyRequest2.get({
    url:'/home/highscore'
  })
}
