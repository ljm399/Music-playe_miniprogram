import { HYEventStore } from "hy-event-store";
import { db } from "../baseData/index.js";
const menuStore = new HYEventStore({
  state: {
    menuList: []
  },
  actions: {
    async fetchMenuListData(ctx) {
      const res = await db.collection("c_menuList").get()
      ctx.menuList = res.data
    }
  }
})
menuStore.dispatch("fetchMenuListData")
export default menuStore