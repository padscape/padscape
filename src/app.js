let defaultText, theme, textSize, realtime, indentSize, layout, resultShown, split, creator, editor;

let Editor = (() => {
    return {
        init: function() {
            editor = this;

            let content = ` <nav class="navbar navbar-expand-sm fixed-top">
                                <ul class="navbar-nav">
                                    <li class="nav-item">
                                        <button type="button" class="btn btn-primary noGlow" id="run" data-toggle="tooltip" data-placement="bottom" title="Alt+R">Run&nbsp;&nbsp;&nbsp;<i class='fas fa-play'></i></button>
                                    </li>
                                    <li class="nav-item">
                                        <button type="button" class="btn btn-primary noGlow" id="save" data-toggle="tooltip" data-placement="bottom" title="Ctrl+S">Save&nbsp;&nbsp;&nbsp;<i class='fas fa-cloud-upload-alt'></i></button>
                                    </li>
                                    <li class="nav-item">
                                        <button type="button" class="btn btn-primary noGlow" id="settings" data-toggle="tooltip" data-placement="bottom" title="Ctrl+I">Settings&nbsp;&nbsp;&nbsp;<i class='fas fa-cog'></i></button>
                                    </li>
                                </ul>
                            </nav>
                            <div class="row">
                                <div id="codeCol" class="col">
                                    <textarea id="src" data-gramm_editor="false" spellcheck="false" class="noGlow"></textarea>
                                    <pre class="code-output"><code class="language-html"></code></pre>
                                    <button type="button" class="btn btn-circle btn-lg btn-light size-plus-btn shadow-none text-dark">+</button>
                                    <button type="button" class="btn btn-circle btn-lg btn-light size-minus-btn shadow-none text-dark">-</button>
                                </div>
                                <div id="resultCol" class="col">
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
                                                <div class="col-sm-3">
                                                    <select name="indent" class="custom-select" id="indentSize">
                                                        <option val="2spc">2 spaces</option>
                                                        <option val="4spc">4 spaces</option>
                                                        <option val="8spc">8 spaces</option>
                                                    </select>
                                                </div>
                                                <label for="indentSize">Indent Size</label>
                                            </div>
                                            <div class="row">
                                                <div class="col">
                                                    <div class="custom-control custom-checkbox mb-3">
                                                        <input type="checkbox" class="custom-control-input" id="resultShown">
                                                        <label class="custom-control-label" for="resultShown">Show result?</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row vertical-align" style="padding: 0">
                                                <div class="col">
                                                    <button type="button" class="btn btn-primary" id="vertical-split" data-toggle="tooltip" data-placement="bottom" title="Vertical Split"><i class="fa fa-columns"></i></button>
                                                    <button type="button" class="btn btn-primary" id="horizontal-split" data-toggle="tooltip" data-placement="bottom" title="Horizontal Split"><i class="fa fa-columns fa-rotate-270"></i></button>
                                                    <label for="horizontal-split">Layout</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="modal-footer bg-light"></div>
                                        </div>
                                    </div>
                                </div>`;

            $("body").append(content);

            split = Split(["#codeCol", "#resultCol"], {
                elementStyle: (dimension, size, gutterSize) => { 
                    return {'flex-basis': `calc(${size}% - ${gutterSize}px)`}
                },

                sizes: [50, 50],
                gutterSize: 6,
                cursor: 'col-resize'
            });

            theme = (localStorage.padscapeTheme) ? localStorage.padscapeTheme : 'white';
            textSize = (localStorage.padscapeTextSize != 'NaN') ? localStorage.padscapeTextSize : 19;
            realtime = (localStorage.padscapeRealtime != undefined) ? localStorage.padscapeRealtime : 'on';
            layout = (localStorage.layout) ? localStorage.layout : 'vertical';
            indentSize = (localStorage.padscapeIndentSize != 'NaN') ? localStorage.padscapeIndentSize : 4;
            resultShown = (localStorage.resultShown != undefined) ? localStorage.resultShown : true;

            if (location.hash) {
                const getData = async id => {
                    let response = await fetch(`http://100.73.27.89:5520/code/${id}`);
                    return await response.json();
                }

                (async () => {
                    let data = await getData(location.hash.substring(1));
                    let json = (data !== '[]') ? JSON.parse(data.slice(1, -1)) : undefined;

                    if (json) {
                        $('#src').val(json.Code);
                        creator = json.Creator;
                        editor.emptyResponse = false;
                    } else {
                        creator = 'admin';
                        editor.emptyResponse = true;
                    }

                    defaultText = $('#src').val();
                    editor.highlight(defaultText);
                    editor.showResult();
                })();
            } else {
                defaultText = (localStorage.defaultText) ? localStorage.defaultText : '<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<title>App</title>\n\t</head>\n\t<body>\n\t\t<h1>App</h1>\n\t</body>\n</html>';
                $('#src').val(defaultText);
                editor.highlight(defaultText);
                editor.showResult();
            }

            $('src').focus();
            $('#indentSize').val(`${indentSize} spaces`);
            $('[data-toggle="tooltip"]').tooltip();

            editor.listenLanguage('html');
            editor.getInput();
            editor.runCode();
            editor.renderOutput();
            editor.saveText();
            editor.listenerForScroll();
            editor.modal();
            editor.sizeButtons();
        },

        saveText: () => {
            $('#save').click(function() {
                if (location.hash) {
                    const http = new XMLHttpRequest();
                    let type = (editor.emptyResponse) ? "POST" : "PUT";
                    http.open(type, `http://100.73.27.89:5520/code/${location.hash.substring(1)}`, true);
                    http.send(JSON.stringify({"CodeID": location.hash.substring(1), "Code": $("#src").val().replace(/'/g, "\\'"), "Creator": creator}));
                } else {
                    localStorage.defaultText = $("#src").val();
                }
            });
        },
        
        getInput: () => {
            $('#src').on('keydown', function(e) {
                var keyCode = e.keyCode || e.which;

                if (keyCode === 9) {
                    e.preventDefault();
                    var start = this.selectionStart;
                    var end = this.selectionEnd;

                    if (start !== end) {
                        let text = '';
                        let lines = this.value.substring(start, end).split('\n');

                        for (let i = 0; i < lines.length; i++) {
                            line = `\t${lines[i]}`;
                            text += line;
                            if (i < lines.length - 1) text += '\n';
                        }

                        $(this).val(`${this.value.substring(0, start)}${text}${this.value.substring(end)}`);
                    } else {
                        $(this).val(`${$(this).val().substring(0, start)}\t${$(this).val().substring(end)}`);
                    }

                    this.selectionStart = 
                    this.selectionEnd = start + 1;
                } else if (keyCode === 13) {
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
                    editor.showResult();
                }
            });

            $('#run').click(function() {
                editor.showResult();
            });

            $('#realtimeMode').click(function() {
                if ($(this).is(":checked")) {
                    editor.showResult();
                }
            });

            $(document).on("keyup keydown", function(e) {
                if (e.altKey && e.keyCode === 82) {
                    editor.showResult();
                }
            });
        },

        showResult: () => {
            $('#result')[0].srcdoc = $('#src').val();
        },
        
        renderOutput: () => {
            var old_value = "";

            $('#src').on('input keydown', function() {
                var value = this.value;
                if (value == old_value) return;
                var old_value = value;
                editor.highlight(value);
            });
        },

        highlight: val => {
            $('code', '.code-output').html(val.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n");
            Prism.highlightAll();
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

                textSize = current + 2;
                localStorage.padscapeTextSize = textSize;
            });

            $('.size-minus-btn').click(function() {
                var current = Number($(':root').css('--text-size').slice(0, -2));

                if (current > 1) {
                    $(':root').css('--text-size', `${current - 2}px`);
                }

                textSize = current - 2;
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

            let observer = new MutationObserver(function(mutations) {
                mutations.forEach(function() {
                    let position = target.css('flex-basis').slice(5, -1);
                    $('.size-plus-btn').css('left', `calc(${position} - 55px)`);
                    $('.size-minus-btn').css('left', `calc(${position} - 104px)`);
                });    
            });
            
            let target = $('#codeCol');
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
                realtime = ($(this).is(":checked")) ? "on" : "off";
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

                if (!resultShown) {
                    $("#vertical-split, #horizontal-split").addClass('disabled');
                    $("#codeCol, #resultCol").removeClass('col');
                }

                $(':root').css('--indent-size', indentSize);
                $('#indentSize').val(`${indentSize} spaces`);
                $('#resultShown').prop('checked', resultShown);
                $('#realtimeMode').prop('checked', realtime == "on");
            });

            $('#resultShown').click(function() {
                $("#vertical-split, #horizontal-split").toggleClass('disabled');
                resultShown = $('#resultShown').prop('checked');
                (!resultShown) ? $("#codeCol, #resultCol").removeClass('col') : $("#codeCol, #resultCol").addClass('col');
                localStorage.resultShown = resultShown;
            });

            $('#vertical-split').click(function() {
                if (layout != "vertical") {
                    layout = "vertical";

                    console.log('Switch to vertical split');
                }
            });

            $('#horizontal-split').click(function() {
                if (layout != "horizontal") {
                    layout = "horizontal";

                    console.log('Switch to horizontal split');
                }
            });
        },
    }
})();

Editor.init();
