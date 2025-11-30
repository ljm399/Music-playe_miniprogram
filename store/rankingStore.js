import { HYEventStore } from "hy-event-store";
import { fetchPeakList } from "../services/music";

export const peakSongsInfos = {
  "newSongsInfo":3779629,
  "originSongsInfo":2884035,
  "soarSongsInfo":19723756,
  "hotSongsInfo":3778678,
}
const rankingStore = new HYEventStore({
  state:{
    newSongsInfo:{},
    originSongsInfo:{},
    soarSongsInfo:{},
    hotSongsInfo:{},
  },
  actions:{
    fetchPeakListData(ctx) {
      for(const key in peakSongsInfos) {
        const id = peakSongsInfos[key]
        fetchPeakList(id).then(res => {
          ctx[key] = res.playlist
        })
      }
    }
  }
})
export default rankingStore