import { hyRequest } from "./request";

export function fetchSongDetail(ids) {
  return hyRequest.get({
    url: '/song/detail',
    data: {
      ids
    }
  })
}

export function fetchLyric(id) {
  return hyRequest.get({
    url: '/lyric',
    data: {
      id
    }
  })
}