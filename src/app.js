let defaultText, theme, textSize, realtime, autosave, indentSize, resultShown, split, creator, username, libLink, libs, hasSaved, editor;

let Editor = (() => {
    return {
        init: function() {
            editor = this;

            let content = ` <div id="load">
                                <img src="https://avatars2.githubusercontent.com/u/51507573?s=400&u=7b0c73685f03e22579236e0ef69ac1c84ef2c530&v=4" width="260px" height="260px"></img>
                                <div id="loader"></div>
                            </div>
                            <div id="page">
                                <nav class="navbar navbar-expand-sm fixed-top vertical-align">
                                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                                        <span class="navbar-toggler-icon"></span>
                                    </button>
                                    <div class="collapse navbar-collapse" id="collapsibleNavbar">
                                        <ul class="navbar-nav">
                                            <li class="nav-item">
                                                <button type="button" class="btn btn-primary noGlow" id="run" data-toggle="tooltip" data-placement="bottom" title="Alt+R">Run&nbsp;&nbsp;&nbsp;<i class='fas fa-play'></i></button>
                                            </li>
                                            <li class="nav-item">
                                                <button type="button" class="btn btn-primary noGlow" id="save" data-toggle="tooltip" data-placement="bottom" title="Ctrl+S"></button>
                                            </li>
                                            <li class="nav-item">
                                                <button type="button" class="btn btn-primary noGlow" id="settings" data-toggle="tooltip" data-placement="bottom" title="Ctrl+I">Settings&nbsp;&nbsp;&nbsp;<i class='fas fa-cog'></i></button>
                                            </li>
                                        </ul>
                                        <ul class="navbar-nav ml-auto">
                                            <li class="nav-item">
                                                <p class="navbar-text my-auto" style="color: white" id="info"></p>
                                            </li>
                                        </ul>
                                    </div>
                                </nav>
                                <div class="row">
                                    <div id="codeCol" class="col">
                                        <textarea id="src" data-gramm_editor="false" spellcheck="false" class="noGlow" autofocus></textarea>
                                        <pre class="code-output"><code class="language-html"></code></pre>
                                        <button type="button" class="btn btn-circle btn-lg btn-light size-plus-btn shadow-none text-dark">+</button>
                                        <button type="button" class="btn btn-circle btn-lg btn-light size-minus-btn shadow-none text-dark">-</button>
                                    </div>
                                    <div id="resultCol" class="col">
                                        <iframe id="result"></iframe></div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal fade" id="settingsModal">
                                <div class="modal-dialog modal-dialog-centered modal-lg modal-settings">
                                    <div class="modal-content text-dark">
                                        <div class="modal-header bg-light">
                                            <h4 class="modal-title">Settings</h4>
                                            <button type="button" class="close btn-danger shadow-none noGlow" data-dismiss="modal">&times;</button>
                                        </div>
                                        <div class="modal-body">
                                            <ul class="nav nav-tabs">
                                                <li class="nav-item">
                                                    <a class="nav-link active">Editor</a>
                                                </li>
                                                <li class="nav-item">
                                                    <a class="nav-link">Libraries</a>
                                                </li>
                                            </ul>
                                            <br>
                                            <div class="container tab-pane" id="Editor">
                                                <div class="custom-control custom-switch">
                                                    <input type="checkbox" class="custom-control-input noGlow shadow-none" id="darkMode">
                                                    <label class="custom-control-label" for="darkMode">Dark theme</label>
                                                </div>
                                                <div class="custom-control custom-switch">
                                                    <input type="checkbox" class="custom-control-input noGlow shadow-none" id="realtimeMode">
                                                    <label class="custom-control-label" for="realtimeMode">Automatic Running Enabled</label>
                                                </div>
                                                <div class="custom-control custom-switch">
                                                    <input type="checkbox" class="custom-control-input noGlow shadow-none" id="autosaveMode">
                                                    <label class="custom-control-label" for="autosaveMode">Autosave Enabled</label>
                                                </div>
                                                <div class="row vertical-align" style="padding-top: 4px;">
                                                    <div class="col-6">
                                                        <select name="indent" class="custom-select" id="indentSize">
                                                            <option val="2spc">2 spaces</option>
                                                            <option val="4spc">4 spaces</option>
                                                            <option val="8spc">8 spaces</option>
                                                        </select>
                                                    </div>
                                                    <label for="indentSize">Indent Size</label>
                                                </div>
                                                <div class="row" style="padding-top: 4px;">
                                                    <div class="col">
                                                        <div class="custom-control custom-checkbox">
                                                            <input type="checkbox" class="custom-control-input" id="resultShown">
                                                            <label class="custom-control-label" for="resultShown">Show result?</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br><br>
                                                <div class="text-center" id="export-delete">
                                                    <button type="button" class="btn btn-primary noGlow" id="export" data-tooltip-text="1">Export&nbsp;&nbsp;&nbsp;<i class='fas fa-file-export'></i></button>
                                                </div>
                                            </div>
                                            <div class="container tab-pane" id="Libraries">
                                                <div class="row" style="padding-top: 0;">
                                                    <div class="col-8">
                                                        <div class="dropdown">
                                                            <input type="text" class="form-control lib-dropdown" placeholder="Search libraries by name or paste URL" id="libName">
                                                            <div class="dropdown-menu scrollable-menu">
                                                            </div>
                                                        </div>
                                                        <ul id="libList" class="list-group list-group-flush"></ul>
                                                    </div>
                                                    <div class="col-4" style="padding-left: 0;">
                                                        <div id="addLib">
                                                            <div class="addLib-content">Add</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br>
                                                <span class="font-weight-bold">Note: </span><span>JavaScript and CSS libraries will automatically be placed at the bottom of the <code>head</code>, <code>body</code> or <code>html</code> tag precedently. If none of these exist, it will be added to the end of the document.</span>
                                            </div>
                                        </div>
                                        <div class="modal-footer bg-light">
                                        </div>
                                    </div>
                                </div>`;

            $("body").append(content);

            isDefined = variable => {
                return variable != undefined && variable != "undefined";
            }

            textSize = (isDefined(localStorage.padscapeTextSize)) ? localStorage.padscapeTextSize : 19;
            indentSize = (isDefined(localStorage.padscapeIndentSize)) ? localStorage.padscapeIndentSize : 4;
            realtime = (isDefined(localStorage.padscapeRealtime)) ? localStorage.padscapeRealtime : 'on';
            autosave = (isDefined(localStorage.padscapeAutosave)) ? localStorage.padscapeAutosave : 'off';
            resultShown = (isDefined(localStorage.padscapeResultShown)) ? localStorage.padscapeResultShown : true;
            libs = (isDefined(localStorage.padscapeLib)) ? JSON.parse(localStorage.padscapeLib) : {};
            theme = (isDefined(localStorage.padscapeTheme)) ? localStorage.padscapeTheme : 'dark';
            hasSaved = false;

            $(':root').css('--indent-size', indentSize);

            Split(["#codeCol", "#resultCol"], {
                elementStyle: (dimension, size, gutterSize) => { 
                    return {'flex-basis': `calc(${size}% - ${gutterSize}px)`}
                },

                sizes: [50, 50],
                gutterSize: 6,
                cursor: 'col-resize'
            });

            const getUsername = async () => {
                let response = await fetch('https://api.ipify.org/?format=json');
                return await response.json();
            }

            (async () => {
                getPadContents();
                let data = await getUsername();

                $('#src').val(defaultText);
                editor.highlight(defaultText);
                username = data['ip'];
                if (!location.hash || editor.emptyResponse) creator = username;

                $('#save').append(`${(creator === username) ? "Save&nbsp;&nbsp;&nbsp;<i class='fas fa-cloud-upload-alt'></i>" : "Fork&nbsp;&nbsp;&nbsp;<i class='fas fa-code-branch'></i>"}`);
                $('#info')[0].innerHTML = `A pad by ${(creator === username) ? 'you' : creator}`;

                if (creator === username && location.hash) $('#export-delete').append(`<button type="button" class="btn btn-danger noGlow" id="delete">Delete&nbsp;&nbsp;&nbsp;<i class='fas fa-trash'></i></button>`);
            })();

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

            window.onload = () => {
                $('#load').css('visibility', 'hidden');
                $('#page').css({'visibility': 'visible', 'opacity': '1'});
            };
        },

        saveText: () => {
            $('#save').click(() => {
                hasSaved = true;

                if (creator === username) {
                    saveToDatabase();
                } else {
                    forkCode();
                }
            });

            $('#src').on('keyup keydown', () => {
                if (autosave) {
                    hasSaved = true;

                    if (!location.hash) {
                        localStorage.defaultText = $('#src').val();
                    } else if (creator === username) {
                        saveToDatabase();
                    }
                }
            });

            $(document).on('keydown', e => {
                if (e.ctrlKey && e.keyCode === 83) {
                    e.preventDefault();

                    if (!location.hash) {
                        localStorage.defaultText = $('#src').val();
                    } else if (creator === username) {
                        saveToDatabase();
                    }
                }
            });
        },
        
        getInput: () => {
            $('#src').on('keydown', function(e) {
                let keyCode = e.keyCode || e.which;

                if (keyCode === 9) {
                    e.preventDefault();
                    let start = this.selectionStart;
                    let end = this.selectionEnd;

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
                    let start = this.selectionStart;
                    let line = this.value.substring(0, this.selectionStart).split('\n').pop();
                    let indent = line.match(/^\s*/)[0];

                    let textBefore = this.value.substring(0, start);
                    let textAfter  = this.value.substring(start, this.value.length);

                    $(this).val(textBefore + "\n" + indent + textAfter);

                    this.focus();
                    this.setSelectionRange(start + indent.length + 1, start + indent.length + 1);
                }
            });
        },
        
        runCode: () => {
            $('#src').on('keyup', () => {
                if (realtime == "on") {
                    editor.showResult();
                }
            });

            $('#run').click(() => {
                editor.showResult();
            });

            $('#realtimeMode').click(() => {
                if ($(this).is(":checked")) {
                    editor.showResult();
                }
            });

            $(document).on("keyup keydown", e => {
                if (e.altKey && e.keyCode === 82) {
                    editor.showResult();
                }
            });
        },

        showResult: () => {
            let src = '';

            for (let lib in libs) if (libs.hasOwnProperty(lib)) src += libs[lib];
            src += $('#src').val();

            $('#result')[0].srcdoc = src;
        },
        
        renderOutput: () => {
            var old_value = "";

            $('#src').on('input keydown', function() {
                let value = $(this).val();
                if (value == old_value) return;
                old_value = value;
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
            $('#src').on('scroll', () => {
                $('.code-output')[0].scrollTop = this.scrollTop;
                $('.code-output')[0].scrollLeft = this.scrollLeft;
            });
        },

        sizeButtons: () => {
            $('.size-plus-btn').click(() => {
                var current = Number($(':root').css('--text-size').slice(0, -2));

                if (current < 55) {
                    $(':root').css('--text-size', `${current + 2}px`);
                }

                textSize = current + 2;
                localStorage.padscapeTextSize = textSize;
            });

            $('.size-minus-btn').click(() => {
                var current = Number($(':root').css('--text-size').slice(0, -2));

                if (current > 1) {
                    $(':root').css('--text-size', `${current - 2}px`);
                }

                textSize = current - 2;
                localStorage.padscapeTextSize = textSize;
            });

            $(document).ready(() => {
                $(':root').css('--text-size', `${textSize}px`);
            });

            $('.size-plus-btn, .size-minus-btn').mouseover(() => {
                $('.size-plus-btn, .size-minus-btn').animate({opacity: '1'});
            });

            $('.size-plus-btn, .size-minus-btn').mouseleave(e => {
                var plusX = Number($('.size-plus-btn').css('left').slice(0, -2));
                var minusX = Number($('.size-minus-btn').css('left').slice(0, -2));

                var mouseX = e.pageX;

                if (mouseX < minusX || mouseX > plusX) {
                    $('.size-plus-btn, .size-minus-btn').animate({opacity: '0'});
                }
            }); 

            $(document).on('scroll', () => {
                $('.size-plus-btn, .size-minus-btn').css('bottom', `${$(window).scrollTop() + 26}px`);
            });

            let observer = new MutationObserver(mutations => {
                mutations.forEach(() => {
                    let position = $('#codeCol').css('flex-basis').slice(5, -1);
                    $('.size-plus-btn').css('left', `calc(${position} - 55px)`);
                    $('.size-minus-btn').css('left', `calc(${position} - 104px)`);
                });    
            });
            
            observer.observe($('#codeCol')[0], {
                attributes: true, attributeFilter: ['style']
            });
        },

        modal: () => {
            let selectionS, selectionE;

            $(document).on("keyup keydown", e => {
                if (e.ctrlKey && e.keyCode === 73) {
                    e.preventDefault();
                    $("#settingsModal").modal('toggle');
                }
            });

            $("#settingsModal").on('show.bs.modal', function () {
                selectionS = $('#src')[0].selectionStart;
                selectionE = $('#src')[0].selectionEnd;
            });

            $("#settingsModal").on('hidden.bs.modal', () => {
                $('#src')[0].selectionStart = selectionS;
                $('#src')[0].selectionEnd = selectionE;
                $('#src').focus();
            });

            $('#settings').click(() => {
                $("#settingsModal").modal('toggle');
            });

            $('body').delegate('#delete', 'click', () => {
                deleteCode();
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

            $('#autosaveMode').click(function() {
                autosave = ($(this).is(":checked")) ? "on" : "off";
                localStorage.padscapeAutosave = autosave;
            });

            $('#indentSize').on('change', function() {
                var indentSize = Number(this.value.slice(0, -7));
                $(':root').css('--indent-size', indentSize);
                localStorage.padscapeIndentSize = indentSize;
            });

            $(document).ready(() => {
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
                    $("#codeCol, #resultCol").removeClass('col');
                    $("#src, .code-output").css("padding-top", "4.5rem");
                }

                $('#Editor').css('display', 'block')
                $('#Libraries').css('display', 'none')

                $(':root').css('--indent-size', indentSize);
                $('#indentSize').val(`${indentSize} spaces`);
                $('#resultShown').prop('checked', resultShown);
                $('#realtimeMode').prop('checked', realtime == 'on');
                $('#autosaveMode').prop('checked', autosave == 'on');

                for (let lib in libs) {
                    if (libs.hasOwnProperty(lib)) $('#libList')[0].innerHTML += `<li class="list-group-item d-flex align-items-center">${lib} <div id="deleteLib" class="ml-auto"><div class="deleteLib-content">Remove</div></div></li>`;
                }
            });

            $('#resultShown').click(() => {
                resultShown = $('#resultShown').prop('checked');
                $('#resultCol').css('display', (resultShown) ? 'block' : 'none');
                localStorage.padscapeResultShown = resultShown;
            });

            $('.nav-tabs a').click(function() {
                $(this).tab('show');

                let tabs = $('.tab-pane');

                for (let i = 0; i <= tabs.length - 1; i++) {
                    $(tabs[i]).css('display', 'none');
                }

                $(`#${this.innerHTML}`).css('display', 'block');
            });

            $('#libName').on('input keyup', function() {
                let value = this.value;

                $(this).dropdown('toggle');

                if (value.includes('https:') || value.includes('http:') || value === '' || value === ' ') {
                    $('.dropdown-menu').removeClass('show');
                    $('.libsItem').remove();
                    return;
                }

                const getLibs = async () => {
                    let response = await fetch(`https://api.cdnjs.com/libraries?search=${value}`);
                    return await response.json();
                }

                (async () => {
                    $('.dropdown-menu')[0].innerHTML = '';

                    let data = await getLibs();
                    let i = 0;

                    data.results.some((res) => {
                        if (i > 30 || i >= data.results.length) return true;
                        $('.dropdown-menu')[0].innerHTML += `<a class="dropdown-item libsItem" onclick="$('#libName').val($(this)[0].innerHTML); $('.dropdown-menu').removeClass('show'); libLink = '${res.latest}'">${res.name}</a>`;
                        i++;
                    });
                })();
            });

            $('#addLib').on('click', () => {
                let libName = $('#libName').val();

                if (libName !== '') {
                    let type = libLink.split('.').pop();
                    let toAdd = `<${(type === 'js') ? 'script src="' : 'link rel="stylesheet" href="'}${(libName.includes('https://')) ? libName : libLink}">${(type === 'js') ? '</script>' : ''}`;
                    $('#libList').append(`<li class="list-group-item d-flex align-items-center">${libName} <div id="deleteLib" class="ml-auto"><div class="deleteLib-content">Remove</div></div></li>`);
                    libs[libName] = toAdd;
                    localStorage.padscapeLib = JSON.stringify(libs);
                }
            });

            $('body').delegate('#deleteLib', 'click', function() {
                let libName = $(this).parent().text().slice(0, -7);
                delete libs[libName];
                localStorage.padscapeLib = JSON.stringify(libs);
                $(this).parent().addClass('deleteLib');
                setTimeout(() => { $(this).parent().remove(); }, 200);
            });

            $('#export').tooltip({
                trigger: 'click',
                placement: 'bottom'
            });

            $('#export').on('click', function() {
                let index;
                let src = $('#src').val().split('\n');

                index = src.length;
                    
                src.some((line, indx) => {
                    if (line.includes('</head>')) {
                        index = indx;
                        return true;
                    } else if (line.includes('</body>') || line.includes('</html>')) {
                        index = indx;
                    }
                });

                let targetLine = src[index];
                let indent = targetLine.match(/^\s*/)[0];
                if (index === src.length) lines.push('');

                for (let lib in libs) {
                    if (libs.hasOwnProperty(lib)) src.splice(index, 0, `${indent}${(indent) ? '\t' : ''}${libs[lib]}`);
                }

                let copy = $('<textarea>').val(src.join('\n')).appendTo('body').select();
                document.execCommand('copy');
                copy.remove();

                $(this).tooltip('hide').attr('data-original-title', 'Copied').tooltip('show');
                setTimeout(() => { $(this).tooltip('hide'); }, 1000);
            });
        }
    }
})();

Editor.init();
