import { HYEventStore } from "hy-event-store";
import {fetchRecommendList} from "../services/music";
const recommendStore = new HYEventStore({
  state: {
    recommendInfos: {}
  },
  actions: {
    fetchRecommendListData(ctx) {
      fetchRecommendList().then(res => {
        ctx.recommendInfos = res.playlist
      })
    }
  }
})
export default recommendStore