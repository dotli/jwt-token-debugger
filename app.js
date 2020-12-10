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
            const dateReplacer = function (name, value, desc) {
                const d = new Date(Number.parseInt(value) * 1000).toString()
                return `<span title="${desc}">${name}</span>: <span title="${d}">${value}</span>`
            }
            playload = playload
                .replace(/("nbf"): (\d+)/, function (_, $1, $2) { return dateReplacer($1, $2, 'Not valid before (seconds since Unix epoch)') })
                .replace(/("iat"): (\d+)/, function (_, $1, $2) { return dateReplacer($1, $2, 'Issued at (seconds since Unix epoch)') })
                .replace(/("exp"): (\d+)/, function (_, $1, $2) { return dateReplacer($1, $2, 'Expiration time (seconds since Unix epoch)') })
                .replace(/("auth_time"): (\d+)/, function (_, $1, $2) { return dateReplacer($1, $2, 'Time when authentication occurred') })
            this.output.header = header;
            this.output.playload = playload;
            this.output.signature = signature;
        }
    }
})
