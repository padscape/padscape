let defaultText = '<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<title>App</title>\n\t</head>\n\t<body>\n\t\t<h1>App</h1>\n\t</body>\n</html>';
let theme = 'white';

if (localStorage.defaultText) {
    defaultText = localStorage.defaultText;
}

if (localStorage.padscapeTheme) {
    theme = localStorage.padscapeTheme;
}

var Editor = (function() {
    return {
        init: function(input, result, output, language) {
            var content = '<div class="row no-gutters"><div class="col" id="codeCol"><textarea id="src" data-gramm_editor="false" spellcheck="false"></textarea><pre class="code-output"><code class="language-html"></code></pre><button type="button" class="btn btn-circle btn-lg btn-light size-plus-btn shadow-none text-dark">+</button><button type="button" class="btn btn-circle btn-lg btn-light size-minus-btn shadow-none text-dark">-</button></div><div class="col" id="resultCol"><iframe id="result"></iframe></div></div><div class="modal fade" id="settingsModal"><div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">Settings</h4><button type="button" class="close" data-dismiss="modal">&times;</button></div><div class="modal-body"><div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input" id="darkMode"><label class="custom-control-label" for="darkMode">Dark theme</label></div></div><div class="modal-footer"></div></div></div></div>';
            $("body").append(content);

            var splitobj = Split(["#codeCol", "#resultCol"], {
                elementStyle: function (dimension, size, gutterSize) { 
                    return {
                        'flex-basis': `calc(${size}% - ${gutterSize}px)`
                    }
                },
            
                gutterStyle: function (dimension, gutterSize) {
                    return {
                        'flex-basis': `${gutterSize}px`
                    }
                },
            
                sizes: [50, 50],
                minSize: 290,
                gutterSize: 6,
                cursor: 'col-resize'
            });

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
            this.modal();
            this.buttons();
        },
        
        getInput: function(input) {
            $(input).on('keydown', function(e) {
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
                    var textAfter  = this.value.substring(start, this.value.length);

                    $(this).val(textBefore + "\n" + indent + textAfter);

                    setCaretPosition(this, start + indent.length + 1);
                }
            });
        },
        
        runCode: function(input, result) {
            $(input).on('keyup', function() {
                $(result)[0].srcdoc = this.value;
            });
            
            $(document).ready(function() {
                $(result)[0].srcdoc = $(input)[0].value;
            });
        },
        
        renderOutput: function(output, input){
            var old_value = "";

            $(input).on('input keydown', function() {
                var value = this.value;

                if(value == old_value) {
                    return;
                }
                
                var old_value = value;

                localStorage.defaultText = value;

                $('code', output).html(value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n");
                Prism.highlightAll();
            });
            
            $(document).ready(function() {
                var value = $(input).val();
                localStorage.defaultText = $(input)[0].value;
                $('code', output).html(value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n");
                Prism.highlightAll();
            });
        },
        
        listenLanguage: function(output, language) {
            $(output).removeClass().addClass(`code-output language-${language}`);
            $('code', output).removeClass().addClass(`language-${language}`).removeAttr('data-language');
        },
        
        listenerForScroll: function(input, output) {
            $(input).on('scroll', function() {
                $(output)[0].scrollTop = this.scrollTop;
                $(output)[0].scrollLeft = this.scrollLeft;
            });
        },
        
        addDefaultText: function(input) {
            $(input)[0].value = defaultText;
        },

        buttons: function() {
            $('.size-plus-btn').click(function() {
                var current = $(':root').css('--text-size');
                current = Number(current.substring(0, current.length - 2));

                if (current < 55) {
                    $(':root').css('--text-size', `${current + 2}px`);
                }
            });

            $('.size-minus-btn').click(function() {
                var current = $(':root').css('--text-size');
                current = Number(current.substring(0, current.length - 2));

                if (current > 1) {
                    $(':root').css('--text-size', `${current - 2}px`);
                }
            });

            $('.size-plus-btn, .size-minus-btn').mouseover(function() {
                $('.size-plus-btn, .size-minus-btn').animate({opacity: '1'});
            });

            $('.size-plus-btn, .size-minus-btn').mouseout(function() {
                var plusX = $('.size-plus-btn').css('left');
                plusX = Number(plusX.substring(0, plusX.length - 2));

                var minusX = $('.size-minus-btn').css('left');
                minusX = Number(minusX.substring(0, minusX.length - 2));

                var mouseX = event.clientX;

                if (mouseX < minusX || mouseX > plusX) {
                    $('.size-plus-btn, .size-minus-btn').animate({opacity: '0'});
                }
            }); 

            $(document).on('scroll', function() {
                $('.size-plus-btn, .size-minus-btn').css('bottom', `${$(window).scrollTop() + 26}px`);
            });

            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutationRecord) {
                    var position = target.css('flex-basis');
                    position = position.substring(5, position.length - 1);
                    $('.size-plus-btn').css('left', `calc(${position} - 55px)`);
                    $('.size-minus-btn').css('left', `calc(${position} - 104px)`);
                });    
            });
            
            var target = $('#codeCol');
            observer.observe(target[0], {
                attributes: true, attributeFilter: ['style']
            });
        },

        modal: function() {
            $(document).on("keyup keydown", function(e) {
                if(e.ctrlKey && e.keyCode == 73) {
                    e.preventDefault();
                    $("#settingsModal").modal();
                }
            });

            $('#darkMode').click(function() {
                if ($(this).is(":checked")) {
                    theme = "dark";
                    $('#dark')[0].rel = 'stylesheet';
                    $('#white')[0].rel = 'stylesheet alternate';
                } else {
                    theme = "white";
                    $('#white')[0].rel = 'stylesheet';
                    $('#dark')[0].rel = 'stylesheet alternate';
                }

                localStorage.padscapeTheme = theme;
            });

            $(document).ready(function() {
                if (localStorage.padscapeTheme == "dark") {
                    theme = "dark";
                    $('#dark')[0].rel = 'stylesheet';
                    $('#white')[0].rel = 'stylesheet alternate';
                } else {
                    theme = "white";
                    $('#white')[0].rel = 'stylesheet';
                    $('#dark')[0].rel = 'stylesheet alternate';
                }
            });
        }
    }
})();

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
