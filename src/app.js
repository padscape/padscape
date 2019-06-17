let defaultText = '<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<title>App</title>\n\t</head>\n\t<body>\n\t\t<h1>App</h1>\n\t</body>\n</html>';

var Editor = (function() {
    return {
        init: function(input, result, output, language) {
            this.input = input;
            this.result = result;
            this.output = output;
            this.language = language;
            
            this.listenLanguage(this.output, this.language);
            this.addDefaultText(this.input);
            this.getInput(this.input);
            this.runCode(this.input, this.result);
            this.renderOutput(this.output, this.input);
            this.listenerForScroll(this.input, this.output);
        },
        
        getInput: function(input) {
            $(document).delegate(input, 'keyup keydown', function(e) {
                var keyCode = e.keyCode || e.which;

                if (keyCode == 9) {
                    e.preventDefault();
                    var start = this.selectionStart;
                    var end = this.selectionEnd;

                    $(this).val($(this).val().substring(0, start) + "\t" + $(this).val().substring(end));

                    this.selectionStart =
                    this.selectionEnd = start + 1;
                } else if (keyCode == 13) {
                    e.preventDefault();
                    var start = this.selectionStart;
                    var line = this.value.substring(0, this.selectionStart).split("\n").pop();
                    var indent = line.match(/^\s*/)[0];

                    var textBefore = this.value.substring(0, start);
                    var textAfter  = this.value.substring(start, value.length);

                    $(this).val(textBefore + "\n" + indent + textAfter);

                    setCaretPosition(this, start + indent.length + 1);
                }
            });
        },
        
        runCode: function(input, result) {
            $(document).delegate(input, 'keyup keydown', function(e) {
                $(result)[0].srcdoc = $(input)[0].value;
            });
            
            $(document).ready(function() {
                $(result)[0].srcdoc = $(input)[0].value;
            });
        },
        
        renderOutput: function(output, input){
            $(document).delegate(input, 'keyup keydown', function(e) {
                value = $(input)[0].value;
                $('code', output).html(value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n");
                Prism.highlightAll();
            });
            
            $(document).ready(function() {
                value = $(input)[0].value;
                $('code', output).html(value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n");
                Prism.highlightAll();
            });
        },
        
        listenLanguage: function(output, language) {
            $(output).removeClass().addClass('code-output language-' + language);
            $('code', output).removeClass().addClass('language-' + language).removeAttr('data-language');
        },
        
        listenerForScroll: function(input, output) {
            $(input).on('scroll', function() {
                $(output)[0].scrollTop = this.scrollTop;
                $(output)[0].scrollLeft = this.scrollLeft;
            });
        },
        
        addDefaultText: function(input) {
            $(input)[0].value = defaultText;
        }
    }
})();

var splitobj = Split(["#codeCol", "#resultCol"], {
    elementStyle: function (dimension, size, gutterSize) { 
        return {'flex-basis': 'calc(' + size + '% - ' + gutterSize + 'px)'}
    },
    gutterStyle: function (dimension, gutterSize) { return {'flex-basis':  gutterSize + 'px'} },
    sizes: [50, 50],
    minSize: 290,
    gutterSize: 6,
    cursor: 'col-resize'
});

function setCaretPosition(widget, position) {
    if (widget.setSelectionRange) {
        widget.focus();
        widget.setSelectionRange(position, position);
    } else if (widget.createTextRange) {
        var range = widget.createTextRange();
        range.collapse(true);
        range.moveEnd('character', position);
        range.moveStart('character', position);
        range.select();
    }
}

Editor.init('#src', '#result', '.code-output', 'html');
