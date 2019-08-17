let defaultText, theme, textSize, realtime, indentSize, layout;

var Editor = (() => {
    return {
        init: function() {
            var content = ` <nav class="navbar navbar-expand-sm fixed-top">
                                <ul class="navbar-nav">
                                    <li class="nav-item">
                                        <button type="button" class="btn btn-primary noGlow" id="run" data-toggle="tooltip" data-placement="bottom" title="Alt+R">Run&nbsp;&nbsp;&nbsp;<i class='fas fa-play'></i></button>
                                    </li>
                                    <li class="nav-item">
                                        <button type="button" class="btn btn-primary noGlow" id="settings" data-toggle="tooltip" data-placement="bottom" title="Ctrl+I">Settings&nbsp;&nbsp;&nbsp;<i class='fas fa-cog'></i></button>
                                    </li>
                                </ul>
                            </nav>
                            <div class="row no-gutters">
                                <div id="codeCol">
                                    <textarea id="src" data-gramm_editor="false" spellcheck="false" class="noGlow"></textarea>
                                    <pre class="code-output"><code class="language-html"></code></pre>
                                    <button type="button" class="btn btn-circle btn-lg btn-light size-plus-btn shadow-none text-dark">+</button>
                                    <button type="button" class="btn btn-circle btn-lg btn-light size-minus-btn shadow-none text-dark">-</button>
                                </div>
                                <div id="resultCol">
                                    <iframe id="result"></iframe></div>
                                </div>
                            </div>
                            <div class="modal fade" id="settingsModal">
                                <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
                                    <div class="modal-content">
                                        <div class="modal-header bg-light text-dark">
                                            <h4 class="modal-title">Settings</h4>
                                            <button type="button" class="close btn-danger shadow-none noGlow" data-dismiss="modal">&times;</button>
                                        </div>
                                        <div class="modal-body">
                                            <div class="custom-control custom-switch">
                                                <input type="checkbox" class="custom-control-input noGlow shadow-none" id="darkMode">
                                                <label class="custom-control-label" for="darkMode">Dark theme</label>
                                            </div>
                                            <div class="custom-control custom-switch">
                                                <input type="checkbox" class="custom-control-input noGlow shadow-none" id="realtimeMode">
                                                <label class="custom-control-label" for="realtimeMode">Automatic Running Enabled</label>
                                            </div>
                                            <div class="row vertical-align">
                                                <div class="col">
                                                    <select name="indent" class="custom-select" id="indentSize">
                                                        <option val="2spc">2 spaces</option>
                                                        <option val="4spc">4 spaces</option>
                                                        <option val="8spc">8 spaces</option>
                                                    </select>
                                                </div>
                                                <div class="col">
                                                    <label for="indentSize">Indent Size</label>
                                                </div>
                                            </div>
                                            <div class="row vertical-align">
                                                <div class="col">
                                                    <button type="button" class="btn btn-primary noGlow" id="vertical-split" data-toggle="tooltip" data-placement="bottom" title="Vertical Split"><i class="fa fa-columns"></i></button>
                                                    <button type="button" class="btn btn-primary noGlow" id="horizontal-split" data-toggle="tooltip" data-placement="bottom" title="Horizontal Split"><i class="fa fa-columns fa-rotate-270"></i></button>
                                                </div>
                                                <div class="col">
                                                    <label for="horizontal-split">Layout</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="modal-footer bg-light"></div>
                                        </div>
                                    </div>
                                </div>`;

            $("body").append(content);

            var splitobj = Split(["#codeCol", "#resultCol"], {
                elementStyle: (dimension, size, gutterSize) => { 
                    $('#src, .code-output').css('width', $("#codeCol").css('flex-basis'));

                    return {
                        'flex-basis': `calc(${size}% - ${gutterSize}px)`
                    }
                },
            
                gutterStyle: (dimension, gutterSize) => {
                    return {
                        'flex-basis': `${gutterSize}px`
                    }
                },
            
                sizes: [50, 50],
                minSize: 290,
                gutterSize: 6,
                cursor: 'col-resize'
            });

            /*var splitobj = Split(["#codeCol", "#resultCol"], {
                elementStyle: (dimension, size, gutterSize) => { 
                    $('#src, .code-output').css('height', $("#codeCol").css('height'));

                    return {
                        'height': `calc(${size}% - ${gutterSize}px)`
                    }
                },
            
                gutterStyle: (dimension, gutterSize) => {
                    return {
                        'height': `${gutterSize}px`
                    }
                },
            
                sizes: [50, 50],
                direction: 'vertical',
                minSize: 290,
                gutterSize: 6,
                cursor: 'row-resize'
            });*/

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

            if (localStorage.padscapeTextSize != 'NaN') {
                textSize = localStorage.padscapeTextSize;
            } else {
                textSize = 19;
            }

            if (localStorage.padscapeIndentSize != 'NaN') {
                indentSize = localStorage.padscapeIndentSize;
            } else {
                indentSize = 4;
            }

            if (localStorage.padscapeRealtime) {
                realtime = localStorage.padscapeRealtime;
            } else {
                realtime = 'on';
            }

            if (localStorage.layout) {
                layout = localStorage.layout;
            } else {
                layout = 'vertical';
            }

            this.language = 'html';

            $('[data-toggle="tooltip"]').tooltip();

            $('#src')[0].value = defaultText;
            $('src').focus();
            
            this.listenLanguage(this.language);
            this.getInput();
            this.runCode();
            this.renderOutput();
            this.listenerForScroll();
            this.modal();
            this.sizeButtons();
        },
        
        getInput: () => {
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
        
        runCode: () => {
            $('#src').on('keyup', function() {
                if (realtime == "on") {
                    $('#result')[0].srcdoc = this.value;
                }
            });

            $('#run').click(function() {
                $('#result')[0].srcdoc = $('#src')[0].value;
            });

            $('#realtimeMode').click(function() {
                if ($(this).is(":checked")) {
                    $('#result')[0].srcdoc = $('#src')[0].value;
                }
            });

            $(document).on("keyup keydown", function(e) {
                if (e.altKey && e.keyCode == 82) {
                    $('#result')[0].srcdoc = $('#src')[0].value;
                }
            });
            
            $(document).ready(function() {
                $('#result')[0].srcdoc = $('#src')[0].value;
            });
        },
        
        renderOutput: () => {
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
        
        listenLanguage: language => {
            $('.code-output').removeClass().addClass(`code-output language-${language}`);
            $('code', '.code-output').removeClass().addClass(`language-${language}`).removeAttr('data-language');
        },
        
        listenerForScroll: () => {
            $('#src').on('scroll', function() {
                $('.code-output')[0].scrollTop = this.scrollTop;
                $('.code-output')[0].scrollLeft = this.scrollLeft;
            });
        },

        sizeButtons: () => {
            $('.size-plus-btn').click(function() {
                var current = Number($(':root').css('--text-size').slice(0, -2));

                if (current < 55) {
                    $(':root').css('--text-size', `${current + 2}px`);
                }

                textSize = current;
                localStorage.padscapeTextSize = textSize;
            });

            $('.size-minus-btn').click(function() {
                var current = Number($(':root').css('--text-size').slice(0, -2));

                if (current > 1) {
                    $(':root').css('--text-size', `${current - 2}px`);
                }

                textSize = current;
                localStorage.padscapeTextSize = textSize;
            });

            $(document).ready(function() {
                $(':root').css('--text-size', `${textSize}px`);
            });

            $('.size-plus-btn, .size-minus-btn').mouseover(function() {
                $('.size-plus-btn, .size-minus-btn').animate({opacity: '1'});
            });

            $('.size-plus-btn, .size-minus-btn').mouseleave(function(e) {
                var plusX = Number($('.size-plus-btn').css('left').slice(0, -2));
                var minusX = Number($('.size-minus-btn').css('left').slice(0, -2));

                var mouseX = e.pageX;

                if (mouseX < minusX || mouseX > plusX) {
                    $('.size-plus-btn, .size-minus-btn').animate({opacity: '0'});
                }
            }); 

            $(document).on('scroll', function() {
                $('.size-plus-btn, .size-minus-btn').css('bottom', `${$(window).scrollTop() + 26}px`);
            });

            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function() {
                    var position = target.css('flex-basis').slice(5, -1);
                    $('.size-plus-btn').css('left', `calc(${position} - 55px)`);
                    $('.size-minus-btn').css('left', `calc(${position} - 104px)`);
                });    
            });
            
            var target = $('#codeCol');
            observer.observe(target[0], {
                attributes: true, attributeFilter: ['style']
            });
        },

        modal: () => {
            $(document).on("keyup keydown", function(e) {
                if (e.ctrlKey && e.keyCode == 73) {
                    e.preventDefault();
                    $("#settingsModal").modal('toggle');
                    $('#src').focus();
                }
            });

            $('#settings').click(function() {
                $("#settingsModal").modal('toggle');
                $('#src').focus();
            });

            $('#darkMode').click(function() {
                if ($(this).is(":checked")) {
                    theme = "dark";
                    $('#dark')[0].rel = 'stylesheet';
                    $('#white')[0].rel = 'stylesheet alternate';
                    $('.navbar').addClass('bg-dark navbar-dark');
                } else {
                    theme = "white";
                    $('#white')[0].rel = 'stylesheet';
                    $('#dark')[0].rel = 'stylesheet alternate';
                    $('.navbar').addClass('bg-light navbar-light');
                }

                localStorage.padscapeTheme = theme;
            });

            $('#realtimeMode').click(function() {
                if ($(this).is(":checked")) {
                    realtime = "on";
                } else {
                    realtime = "off";
                }

                localStorage.padscapeRealtime = realtime;
            });

            $('#indentSize').on('change', function() {
                $('#src').blur();

                var indentSize = Number(this.value.slice(0, -7));

                $(':root').css('--indent-size', indentSize);

                localStorage.padscapeIndentSize = indentSize;

                $('#src').focus();
            });

            $(document).ready(function() {
                if (localStorage.padscapeRealtime == "on") {
                    realtime = "on";
                    $('#realtimeMode').prop('checked', true);
                } else {
                    realtime = "off";
                }

                if (localStorage.padscapeTheme == "dark") {
                    theme = "dark";
                    $('#dark')[0].rel = 'stylesheet';
                    $('#white')[0].rel = 'stylesheet alternate';
                    $('.navbar').addClass('bg-dark navbar-dark');
                    $('#darkMode').prop('checked', true);
                } else {
                    theme = "white";
                    $('#white')[0].rel = 'stylesheet';
                    $('#dark')[0].rel = 'stylesheet alternate';
                    $('.navbar').addClass('bg-light navbar-light');
                }

                $(':root').css('--indent-size', indentSize);
                $('#indentSize').val(`${indentSize} spaces`);
            });

            $('#vertical-split').click(function() {
                if (layout != "vertical") {
                    layout = "vertical";

                    console.log('v');
                }
            });

            $('#horizontal-split').click(function() {
                if (layout != "horizontal") {
                    layout = "horizontal";

                    
                }
            });
        },
    }
})();

Editor.init();
