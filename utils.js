
function unescape(str) {
    return (str + '==='.slice((str.length + 3) % 4)).replace(/-/g, '+').replace(/_/g, '/')
}

function escape(str) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function encode(str, encoding) {
    try { return escape(btoa(str)) } catch{ return '' }
}

function decode(str, encoding) {
    try { return atob(unescape(str)) } catch{ return '' }
}

function format(json, options) {
    var reg = null,
        formatted = '',
        pad = 0,
        PADDING = '  '; // one can also use '\t' or a different number of spaces
    // optional settings
    options = options || {};
    // remove newline where '{' or '[' follows ':'
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
    // use a space after a colon
    options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;

    // begin formatting...
    // make sure we start with the JSON as a string
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    }
    // parse and stringify in order to remove extra whitespace
    try {
        json = JSON.parse(json);
        json = JSON.stringify(json);
    } catch { return '' }
    // add newline before and after curly braces
    reg = /([\{\}])/g;
    json = json.replace(reg, '\r\n$1\r\n');

    // add newline before and after square brackets
    reg = /([\[\]])/g;
    json = json.replace(reg, '\r\n$1\r\n');

    // add newline after comma
    reg = /(\,)/g;
    json = json.replace(reg, '$1\r\n');

    // remove multiple newlines
    reg = /(\r\n\r\n)/g;
    json = json.replace(reg, '\r\n');

    // remove newlines before commas
    reg = /\r\n\,/g;
    json = json.replace(reg, ',');

    // optional formatting...
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
        reg = /\:\r\n\{/g;
        json = json.replace(reg, ':{');
        reg = /\:\r\n\[/g;
        json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
        reg = /\:/g;
        json = json.replace(reg, ': ');
    }
    var lines = json.split('\r\n');
    var endLine = lines.length - 1;
    lines.forEach(function (node, index) {
        if (!node) { return; }
        var i = 0,
            indent = 0,
            padding = '';

        if (node.match(/\{$/) || node.match(/\[$/)) {
            indent = 1;
        } else if (node.match(/\}/) || node.match(/\]/)) {
            if (pad !== 0) {
                pad -= 1;
            }
        } else {
            indent = 0;
        }

        for (i = 0; i < pad; i++) {
            padding += PADDING;
        }

        pad += indent;
        formatted += padding + node;
        if (index < endLine) {
            formatted += '\r\n';
        }
    });

    return formatted;
}