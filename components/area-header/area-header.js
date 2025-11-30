Component({
  properties:{
    title: {
      type: String,
      value: '默认标题'
    },
    moreText: {
      type: String,
      value: ""
    },
    showMore: {
      type: Boolean,
      value: true
    }
  },
  methods: {
    onMoreTap() {
      this.triggerEvent('moretap')
    },
  }
})
