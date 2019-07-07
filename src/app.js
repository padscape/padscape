let defaultText, theme, textSize;

var Editor = (function() {
    return {
        init: function() {
            var content = '<div class="row no-gutters"><div class="col" id="codeCol"><textarea id="src" data-gramm_editor="false" spellcheck="false" class="noGlow"></textarea><pre class="code-output"><code class="language-html"></code></pre><button type="button" class="btn btn-circle btn-lg btn-light size-plus-btn shadow-none text-dark">+</button><button type="button" class="btn btn-circle btn-lg btn-light size-minus-btn shadow-none text-dark">-</button></div><div class="col" id="resultCol"><iframe id="result"></iframe></div></div><div class="modal fade" id="settingsModal"><div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg"><div class="modal-content"><div class="modal-header bg-light text-dark"><h4 class="modal-title">Settings</h4><button type="button" class="close btn-danger shadow-none noGlow" data-dismiss="modal">&times;</button></div><div class="modal-body"><div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input noGlow shadow-none" id="darkMode"><label class="custom-control-label" for="darkMode">Dark theme</label></div></div><div class="modal-footer bg-light"></div></div></div></div>';
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

            if (localStorage.defaultText) {
                defaultText = localStorage.defaultText;
            } else {
                defaultText ='<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<title>App</title>\n\t</head>\n\t<body>\n\t\t<h1>App</h1>\n\t</body>\n</html>';
            }
            
            if (localStorage.padscapeTheme) {
                theme = localStorage.padscapeTheme;
            } else {
                theme = 'white';
            }

            if (localStorage.padscapeTextSize) {
                textSize = localStorage.padscapeTextSize;
            } else {
                textSize = 18;
            }

            this.language = 'html';

            $('#src')[0].value = defaultText;
            
            this.listenLanguage(this.language);
            this.getInput();
            this.runCode();
            this.renderOutput();
            this.listenerForScroll();
            this.modal();
            this.sizeButtons();
        },
        
        getInput: function() {
            $('#src').on('keydown', function(e) {
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

                    this.focus();
                    this.setSelectionRange(start + indent.length + 1, start + indent.length + 1);
                }
            });
        },
        
        runCode: function() {
            $('#src').on('keyup', function() {
                $('#result')[0].srcdoc = this.value;
            });
            
            $(document).ready(function() {
                $('#result')[0].srcdoc = $('#src')[0].value;
            });
        },
        
        renderOutput: function(){
            var old_value = "";

            $('#src').on('input keydown', function() {
                var value = this.value;

                if (value == old_value) {
                    return;
                }
                
                var old_value = value;

                localStorage.defaultText = value;

                $('code', '.code-output').html(value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n");
                Prism.highlightAll();
            });
            
            $(document).ready(function() {
                var value = $('#src').val();
                localStorage.defaultText = $('#src')[0].value;
                $('code', '.code-output').html(value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n");
                Prism.highlightAll();
            });
        },
        
        listenLanguage: function(language) {
            $('.code-output').removeClass().addClass(`code-output language-${language}`);
            $('code', '.code-output').removeClass().addClass(`language-${language}`).removeAttr('data-language');
        },
        
        listenerForScroll: function() {
            $('#src').on('scroll', function() {
                $('.code-output')[0].scrollTop = this.scrollTop;
                $('.code-output')[0].scrollLeft = this.scrollLeft;
            });
        },

        sizeButtons: function() {
            $('.size-plus-btn').click(function() {
                var current = $(':root').css('--text-size');
                current = Number(current.substring(0, current.length - 2));

                if (current < 55) {
                    $(':root').css('--text-size', `${current + 2}px`);
                }

                textSize = current;
                localStorage.padscapeTextSize = textSize;
            });

            $('.size-minus-btn').click(function() {
                var current = $(':root').css('--text-size');
                current = Number(current.substring(0, current.length - 2));

                if (current > 1) {
                    $(':root').css('--text-size', `${current - 2}px`);
                }

                textSize = current;
                localStorage.padscapeTextSize = textSize;
            });

            $(document).ready(function() {
                $(':root').css('--text-size', `${localStorage.padscapeTextSize}px`);
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
                mutations.forEach(function() {
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
                    $("#settingsModal").modal('toggle');
                    $('#src').focus();
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
                    $( '#darkMode').prop( "checked", true);
                } else {
                    theme = "white";
                    $('#white')[0].rel = 'stylesheet';
                    $('#dark')[0].rel = 'stylesheet alternate';
                }
            });
        }
    }
})();

Editor.init();
