let defaultText, theme, textSize, realtime, autosave, indentSize, resultShown, split, creator, username, libLink, libs, hasSaved;

let Editor = (() => {
    return {
        init() {
            // Append the HTML code
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
                                                <button type="button" class="btn btn-primary noGlow" id="save" data-toggle="tooltip" data-placement="bottom" title="Ctrl+S">Save&nbsp;&nbsp;&nbsp;<i class='fas fa-cloud-upload-alt'></i></button>
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
                                    <div id="codeCol">
                                        <textarea id="src" data-gramm_editor="false" spellcheck="false" class="noGlow" autofocus></textarea>
                                        <pre class="code-output"><code class="language-html"></code></pre>
                                        <button type="button" class="btn btn-circle btn-lg btn-light size-plus-btn shadow-none text-dark">+</button>
                                        <button type="button" class="btn btn-circle btn-lg btn-light size-minus-btn shadow-none text-dark">-</button>
                                    </div>
                                    <div id="resultCol">
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
                                                <div class="row vertical-align" style="padding: 0">
                                                    <div class="col">
                                                        <button type="button" class="btn btn-primary" id="vertical-split" data-toggle="tooltip" data-placement="bottom" title="Vertical Split"><i class="fa fa-columns fa-rotate-270"></i></button>
                                                        <button type="button" class="btn btn-primary" id="horizontal-split" data-toggle="tooltip" data-placement="bottom" title="Horizontal Split"><i class="fa fa-columns"></i></button>
                                                        <label for="horizontal-split">Layout</label>
                                                    </div>
                                                </div>
                                                <br><br>
                                                <div class="text-center" id="export-delete">
                                                    <button type="button" class="btn btn-primary noGlow" id="export" data-tooltip-text="1">Export&nbsp;&nbsp;&nbsp;<i class='fas fa-file-export'></i></button>
                                                    <button type="button" class="btn btn-primary noGlow" id="import" data-tooltip-text="1">Import&nbsp;&nbsp;&nbsp;<i class='fas fa-file-import'></i></button>
                                                    <input type="file" style="display: none">
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

            // Get personalized settings from localStorage

            isDefined = variable => {
                return typeof variable !== 'undefined' && variable !== 'undefined';
            }

            textSize = (isDefined(localStorage.padscapeTextSize)) ? localStorage.padscapeTextSize : 19;
            indentSize = (isDefined(localStorage.padscapeIndentSize)) ? localStorage.padscapeIndentSize : 4;
            realtime = (isDefined(localStorage.padscapeRealtime)) ? localStorage.padscapeRealtime : 'on';
            autosave = (isDefined(localStorage.padscapeAutosave)) ? localStorage.padscapeAutosave : 'off';
            resultShown = (isDefined(localStorage.padscapeResultShown)) ? localStorage.padscapeResultShown : true;
            theme = (isDefined(localStorage.padscapeTheme)) ? localStorage.padscapeTheme : 'dark';
            split = (isDefined(localStorage.padscapeLayout)) ? localStorage.padscapeLayout : 'horizontal';
            hasSaved = false;

            $(':root').css('--indent-size', indentSize);

            // Get data about the pad

            getUsername = pad => {
                return new Promise((resolve, reject) => {
                    $.getJSON({
                        url: 'https://api.ipify.org/?format=json',
                        success(ip_) {
                            resolve({pad, ip: ip_});
                        },
                        error: reject
                    });
                });
            }

            if (!location.hash) {
                getUsername().then(data => {
                    username = data['ip']['ip'];
                    creator = username;
                    defaultText = (localStorage.defaultText) ? localStorage.defaultText : '<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<title>App</title>\n\t</head>\n\t<body>\n\t\t<h1>App</h1>\n\t</body>\n</html>';
                    libs = (isDefined(localStorage.padscapeLib)) ? JSON.parse(localStorage.padscapeLib) : {};
                    $('#src').val(defaultText);

                    editor.highlight(defaultText);
                    editor.showResult();
                    editor.runAll();
                });
            } else {
                getPadContents(window.location.hash.substring(1)).then(getUsername).then(data => {
                    if (data['pad']) {
                        $('#src').val(data['pad']['Code']);
                        defaultText = data['pad']['Code'];
                        creator = data['pad']['Creator'];
                        libs = JSON.parse(data['pad']['Libraries']);
                        editor.highlight(defaultText);
                        editor.showResult();
                        editor.emptyResponse = false;
                    } else {
                        editor.emptyResponse = true;
                    }

                    username = data['ip']['ip'];
                    if (!location.hash || editor.emptyResponse) { creator = username; }

                    if (creator !== username) { $('#save').html("Fork&nbsp;&nbsp;&nbsp;<i class='fas fa-code-branch'></i>"); }
                    if (creator === username && location.hash) { $('#export-delete').append(`<button type="button" class="btn btn-danger noGlow" id="delete">Delete&nbsp;&nbsp;&nbsp;<i class='fas fa-trash'></i></button>`); }

                    $('#info').html(`A pad by ${(creator === username) ? 'you' : creator}`);
                    $('#src').val(defaultText);
                    editor.highlight($('#src').val());

                    $('#indentSize').val(`${indentSize} spaces`);
                    $('[data-toggle="tooltip"]').tooltip();

                    editor.runAll();
                });
            }
        },

        runAll() {
            // Remove the loading animation
            $('#load').css('visibility', 'hidden');
            $('#page').css({'visibility': 'visible', 'opacity': '1'});

            // Call all the member functions
            editor.splitPanes();
            editor.listenLanguage('html');
            editor.getInput();
            editor.runCode();
            editor.renderOutput();
            editor.saveText();
            editor.listenerForScroll();
            editor.modal();
            editor.sizeButtons();
        },

        splitPanes() {
            makePanes = () => {
                $('.gutter').remove();

                Split(["#codeCol", "#resultCol"], {
                    direction: split,
                    sizes: [50, 50],
                    minSize: [300, 300],
                    gutterSize: 6,
                    cursor: `${(split === 'horizontal') ? 'col' : 'row'}-resize`
                });
            }

            positionPanes = () => {
                // Adjust the width of the textarea

                if (split === 'horizontal') {
                    $('#codeCol, #resultCol').css('height', '100%');
                    $('#src, .code-output').css({'width': `calc(${$('#codeCol').css('width')} - 15px)`, 'height': '100%'});
                } else {
                    $('#codeCol, #resultCol').css('width', '100%');
                    $('#src, .code-output').css({'height': `calc(${$('#codeCol').css('height')} + 52px)`, 'width': '100%'});
                }

                editor.sizeButtons();
                editor.sizeButtons.position();
            }

            updateSplit = direction => {
                if (split === direction) return;

                split = direction;
                localStorage.padscapeLayout = split;

                makePanes();
                positionPanes();
            }

            window.onresize = () => {
                positionPanes();
            };

            let observer = new MutationObserver(mutations => {
                mutations.forEach(() => {
                    // When the container is resized
                    positionPanes();
                });    
            });
            
            observer.observe($('#codeCol')[0], {
                attributes: true, attributeFilter: ['style']
            });

            makePanes();
            positionPanes();

            editor.splitPanes.updateSplit = updateSplit;
        },

        saveText() {
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
        
        getInput() {
            $('#src').on('keydown', function(e) {
                let keyCode = e.keyCode || e.which;

                if (keyCode === 9) {
                    // When tab key is pressed, increase the identation

                    e.preventDefault();
                    let start = this.selectionStart;
                    let end = this.selectionEnd;

                    if (start !== end) {
                        let text = '';
                        let lines = this.value.substring(start, end).split('\n');

                        for (let i = 0; i < lines.length; i++) {
                            line = `\t${lines[i]}`;
                            text += line;
                            if (i < lines.length - 1) { text += '\n'; }
                        }

                        $(this).val(`${this.value.substring(0, start)}${text}${this.value.substring(end)}`);
                    } else {
                        $(this).val(`${$(this).val().substring(0, start)}\t${$(this).val().substring(end)}`);
                    }

                    this.selectionStart = 
                    this.selectionEnd = start + 1;
                } else if (keyCode === 13) {
                    // When enter key is pressed, preserve the identation

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
        
        runCode() {
            $('#src').on('keyup', () => {
                if (realtime === "on") {
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

        showResult() {
            let src = '';

            // Fetch the library imports
            for (let lib in libs) { if (libs.hasOwnProperty(lib)) { src += libs[lib]; } }
            src += $('#src').val();

            // Show the result in the iframe
            $('#result').attr('srcdoc', src);
        },
        
        renderOutput() {
            var old_value = "";

            $('#src').on('input keydown', function() {
                let value = $(this).val();
                if (value === old_value) { return; }
                old_value = value;
                editor.highlight(value);
            });
        },

        highlight(val) {
            // Highlight the code using Prism
            $('code', '.code-output').html(val.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n");
            Prism.highlightAll();
        },
        
        listenLanguage(language) {
            $('.code-output').removeClass().addClass(`code-output language-${language}`);
            $('code', '.code-output').removeClass().addClass(`language-${language}`).removeAttr('data-language');
        },
        
        listenerForScroll() {
            $('#src').on('scroll', function() {
                // Scroll the highlighted text to the position of the textarea
                $('.code-output').scrollTop($(this).scrollTop());
                $('.code-output').scrollLeft($(this).scrollLeft());
                // Scroll the textarea to the position of the highlighted text
                $(this).scrollTop($('.code-output').scrollTop());
                $(this).scrollLeft($('.code-output').scrollLeft());
            });
        },

        sizeButtons() {
            $('.size-plus-btn').click(() => {
                // Increase the font size
                let current = Number($(':root').css('--text-size').slice(0, -2));

                if (current < 55) {
                    $(':root').css('--text-size', `${current + 2}px`);
                }

                textSize = current + 2;
                localStorage.padscapeTextSize = textSize;
            });

            $('.size-minus-btn').click(() => {
                // Decrease the font size
                let current = Number($(':root').css('--text-size').slice(0, -2));

                if (current > 1) {
                    $(':root').css('--text-size', `${current - 2}px`);
                }

                textSize = current - 2;
                localStorage.padscapeTextSize = textSize;
            });

            position = () => {
                // Position the element correctly
                let xPosition = $('#src').css('width');
                let yPosition = Number($('#src').css('height').slice(0, -2));
                $('.size-plus-btn').css({'left': `calc(${xPosition} - 70px)`, 'top': `${Math.min(yPosition, window.innerHeight) - 50}px`});
                $('.size-minus-btn').css({'left': `calc(${xPosition} - 119px)`, 'top': `${Math.min(yPosition, window.innerHeight) - 50}px`});
            }

            $(document).ready(() => {
                position();
                $(':root').css('--text-size', `${textSize}px`);
            });

            // Make position() accessible from the outer scope
            editor.sizeButtons.position = position;
        },

        modal() {
            let selectionS, selectionE;

            $(document).on("keyup keydown", e => {
                if (e.ctrlKey && e.keyCode === 73) {
                    // When Ctrl+I pressed
                    e.preventDefault();
                    $("#settingsModal").modal('toggle');
                }
            });

            $("#settingsModal").on('show.bs.modal', () => {
                selectionS = $('#src').attr('selectionStart');
                selectionE = $('#src').attr('selectionEnd');
            });

            $("#settingsModal").on('hidden.bs.modal', () => {
                // When modal closes, continue where you left off
                $('#src').attr('selectionStart', selectionS);
                $('#src').attr('selectionEnd', selectionE);
                $('#src').focus();
            });

            $('#settings').click(() => {
                $("#settingsModal").modal('toggle');
            });

            $('body').delegate('#delete', 'click', () => {
                deleteCode();
            });

            $('#horizontal-split').click(() => {
                editor.splitPanes();
                editor.splitPanes.updateSplit('horizontal');
            });

            $('#vertical-split').click(() => {
                editor.splitPanes();
                editor.splitPanes.updateSplit('vertical');
            });

            $('#darkMode').click(function() {
                // Change and save the color theme

                if ($(this).is(":checked")) {
                    theme = "dark";
                    $('#dark').attr('rel', 'stylesheet');
                    $('#white').attr('rel', 'stylesheet alternate');
                    $('.navbar').addClass('bg-dark navbar-dark');
                } else {
                    theme = "white";
                    $('#white').attr('rel', 'stylesheet');
                    $('#dark').attr('rel', 'stylesheet alternate');
                    $('.navbar').addClass('bg-light navbar-light');
                }

                localStorage.padscapeTheme = theme;
            });

            $('#realtimeMode').click(function() {
                // Change and save the realtime mode

                realtime = ($(this).is(":checked")) ? "on" : "off";
                localStorage.padscapeRealtime = realtime;
            });

            $('#autosaveMode').click(function() {
                // Change and save the autosave

                autosave = ($(this).is(":checked")) ? "on" : "off";
                localStorage.padscapeAutosave = autosave;
            });

            $('#indentSize').on('change', function() {
                // Change and save the indent size

                let indentSize = Number(this.value.slice(0, -7));
                $(':root').css('--indent-size', indentSize);
                localStorage.padscapeIndentSize = indentSize;
            });

            $('#resultShown').click(() => {
                resultShown = $('#resultShown').prop('checked');
                localStorage.padscapeResultShown = resultShown;

                if (split === 'horizontal') {
                    $('#codeCol').css('width', `${(resultShown) ? 50 : 100}%`);
                } else {
                    $('#codeCol').css('height', `${(resultShown) ? 50 : 100}%`);
                }

                // Position the size buttons
                editor.sizeButtons();
                editor.sizeButtons.position();
            });

            $('.nav-tabs a').click(function() {
                // Make the tabs in the modal functional

                $('.tab-pane').each((index, element) => { 
                    $(element).css('display', 'none');
                });
                
                $(this).tab('show');
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
                    // Search the CDN.js API for library results
                    let response = await fetch(`https://api.cdnjs.com/libraries?search=${value}`);
                    return await response.json();
                };

                (async () => {
                    $('.dropdown-menu')[0].innerHTML = '';

                    let data = await getLibs();
                    let i = 0;

                    data.results.some((res) => {
                        if (i > 30 || i >= data.results.length) { return true; }
                        $('.dropdown-menu').append(`<a class="dropdown-item libsItem" onclick="$('#libName').val($(this)[0].innerHTML); $('.dropdown-menu').removeClass('show'); libLink = '${res.latest}'">${res.name}</a>`);
                        i++;
                    });
                })();
            });

            $('#addLib').on('click', () => {
                let libName = $('#libName').val();

                if (libName !== '') {
                    // Add the library

                    let type = libLink.split('.').pop();
                    let toAdd = `<${(type === 'js') ? 'script src="' : 'link rel="stylesheet" href="'}${(libName.includes('https://')) ? libName : libLink}">${(type === 'js') ? '</script>' : ''}`;
                    $('#libList').append(`<li class="list-group-item d-flex align-items-center">${libName} <div id="deleteLib" class="ml-auto"><div class="deleteLib-content">Remove</div></div></li>`);
                    libs[libName] = toAdd;

                    if (location.hash) {
                        if (creator === username) {
                            saveToDatabase();
                        } else {
                            forkCode();
                        }
                    } else {
                        localStorage.padscapeLib = JSON.stringify(libs);
                    }
                }
            });

            $('body').delegate('#deleteLib', 'click', function() {
                // Remove the library

                let libName = $(this).parent().text().slice(0, -7);
                delete libs[libName];

                if (location.hash) {
                    if (creator === username) {
                        saveToDatabase();
                    } else {
                        forkCode();
                    }
                } else {
                    localStorage.padscapeLib = JSON.stringify(libs);
                }
                
                $(this).parent().addClass('deleteLib');
                setTimeout(() => { $(this).parent().remove(); }, 200);
            });

            $('#import').on('click', () => {
                $(':file').trigger('click');
            });

            $(':file').on('change', () => {
                let fileReader = new FileReader();

                fileReader.onload = () => {
                    defaultText = fileReader.result;
                    $('#src').val(defaultText);
                    editor.highlight(defaultText);
                    editor.showResult();
                };

                fileReader.readAsText($(':file').prop('files')[0]);
            });

            $('#export').tooltip({
                trigger: 'click',
                placement: 'bottom'
            });

            $('#export').on('click', function() {
                // Copy the complete code to the clipbard

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
                if (index === src.length) { lines.push(''); }

                for (let lib in libs) {
                    if ({}.hasOwnProperty.call(libs, lib)) {
                        src.splice(index, 0, `${indent}${(indent) ? '\t' : ''}${libs[lib]}`);
                    }
                }

                let copy = $('<textarea>').val(src.join('\n')).appendTo('body').select();
                document.execCommand('copy');
                copy.remove();

                $(this).tooltip('hide').attr('data-original-title', 'Copied').tooltip('show');
                setTimeout(() => { $(this).tooltip('hide'); }, 1000);
            });

            $(document).ready(() => {
                // Set preferences

                if (localStorage.padscapeTheme === "dark") {
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

                $('#Editor').css('display', 'block');
                $('#Libraries').css('display', 'none');

                $(':root').css('--indent-size', indentSize);
                $('#indentSize').val(`${indentSize} spaces`);
                $('#resultShown').prop('checked', resultShown);
                $('#realtimeMode').prop('checked', realtime === 'on');
                $('#autosaveMode').prop('checked', autosave === 'on');

                for (let lib in libs) {
                    if ({}.hasOwnProperty.call(libs, lib)) {
                        $('#libList').append(`<li class="list-group-item d-flex align-items-center">${lib} <div id="deleteLib" class="ml-auto"><div class="deleteLib-content">Remove</div></div></li>`);
                    }
                }
            });
        }
    };
})();

Editor.init();
