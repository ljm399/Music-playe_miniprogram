export const db = wx.cloud.database()
class Database {
  constructor(database) {
    this.hy_collection = db.collection(database)
  }
  //this 指向当前实例,给这个新创建的实例对象（this），添加一个名为 hy_collection 的属性，并将 db.collection(database) 的返回值赋给它。

  add(data) {
    return this.hy_collection.add({
      data
    })
  }
  
  delete(condition, isDoc = true) {
    if(isDoc) {
      return this.hy_collection.doc(condition).remove()
    } else {
      return this.hy_collection.where(condition).remove()
    }
  }

  // update(updateObj,doc,condition) {
  //   if(!condition) {
  //     return this.hy_collection.doc(doc).update({
  //       data: updateObj
  //     })
  //   } else {
  //     return this.hy_collection.where(condition).update({
  //       data: updateObj
  //     })
  //   }
  // }

  update(data,condition,isDoc = true) {
    if(isDoc) {
      return this.hy_collection.doc(condition).update({data})
    } else {
      return this.hy_collection.where(condition).update({data})
    }
  }

  query(condition, offset = 0, size = 10, isDoc = true) {
    if(isDoc) {
      return this.hy_collection.doc(condition).get()
    } else {
      return this.hy_collection.where(condition).skip(offset).limit(size).get()
    }
  }
}

export const c_collection = new Database('c_collection')
export const c_favor = new Database('c_favor')
export const c_history = new Database('c_history')
export const c_menuList = new Database('c_menuList')
