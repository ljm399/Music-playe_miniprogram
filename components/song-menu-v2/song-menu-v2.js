Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onDeleteTap() {
      this.triggerEvent('delete')
    }
  }
})