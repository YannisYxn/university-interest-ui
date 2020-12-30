Component({
  externalClasses: ['i-class'],

  options: {
      multipleSlots: true
  },

  properties: {
      full: {
          type: Boolean,
          value: false
      },
      thumb: {
          type: String,
          value: ''
      },
      title: {
          type: String,
          value: ''
      },
      extra: {
          type: String,
          value: ''
      },
      group: {
          type: Boolean,
          value: false
      },
      background: {
        type: String,
        value: ''
      },
  }
});
