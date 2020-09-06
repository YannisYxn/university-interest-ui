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
        post: {
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
        postTitle: {
            type: String,
            value: ''
        },
        extra: {
            type: String,
            value: ''
        },
        time: {
            type: String,
            value: ''
        },
        university: {
            type: String,
            value: ''
        }
    }
});
