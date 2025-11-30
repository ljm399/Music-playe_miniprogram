export default function parseLyrics(lyrics) {
  // const parselyrice = [
  //   {
  //     time:369,单位s
  //     lyric:'你好'
  //   }
  // ]
  const lyricsArr = lyrics.split('\n')
  const result = []
  for (let item of lyricsArr) {
    const reg = /\[(\d{2}):(\d{2}).(\d{2,3})\]/i
    const regLyric = reg.exec(item)
    if (!regLyric) continue
    const min = regLyric[1] * 60 * 1000
    const sec = regLyric[2] * 1000
    const millisecond = regLyric[3].length === 3 ? regLyric[3] : regLyric[3] * 10
    const time = min + sec + Number(millisecond) 
    const lyric = item.replace(reg, '')
    if(!lyric) continue
    result.push({time,lyric})
  }
  return result
} 
