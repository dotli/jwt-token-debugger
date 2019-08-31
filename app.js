new Vue({
    el: '#app',
    data: {
        input: '',
        output: {
            header: '',
            playload: '',
            signature: ''
        }
    },
    computed: {
        rows: function () {
            return (Math.round(this.input.length / 50) + 3) || 1
        }
    },
    watch: {
        input: function (v) {
            var header = '', playload = '', signature = '';
            if (v) {
                str = v.split('.', 3);
                if (str[0]) { header = format(decode(str[0])) }
                if (str[1]) { playload = format(decode(str[1])) }
                if (str[2]) { signature = str[2] }
            }
            this.set(header, playload, signature)
        }
    },
    methods: {
        set: function (header, playload, signature) {
            this.output.header = header;
            this.output.playload = playload;
            this.output.signature = signature;
        }
    }
})
