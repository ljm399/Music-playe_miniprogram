Component({
  options: {
    multipleSlots: true
  },
  methods: {
    handleLeftTap() {
      this.triggerEvent('lefttap')
    }
  }
})