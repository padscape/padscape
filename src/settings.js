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
    updateSplit('horizontal');
});

$('#vertical-split').click(() => {
    updateSplit('vertical');
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

    indentSize = parseInt(this.value.slice(0, -7));
    $(':root').css('--indent-size', indentSize);
    localStorage.padscapeIndentSize = indentSize;
});

$('#lang').on('change', function() {
    // Change and save the language

    let old_lang = lang;
    lang = this.value;

    if (old_lang === lang) {
        return;
    }

    editor.listenLanguage(lang);
    $('#src').val(editor.getText(true));
    editor.highlight($('#src').val());
    editor.showResult();
    localStorage.padscapeLanguage = lang;
});

$('body').delegate('#resultShown', 'click', () => {
    resultShown = $('#resultShown').prop('checked');
    localStorage.padscapeResultShown = resultShown;

    if (split === 'horizontal') {
        $('#codeCol').css('width', `calc(${(resultShown) ? 50 : 100}% - 3px)`);
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

    const getLibs = async() => {
        // Search the CDN.js API for library results
        let response = await fetch(`https://api.cdnjs.com/libraries?search=${value}`);
        return await response.json();
    };

    (async() => {
        $('.dropdown-menu')[0].innerHTML = '';

        let data = await getLibs();
        let i = 0;

        data.results.some((res) => {
            if (i > 30 || i >= data.results.length) {
                return true;
            }
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
    setTimeout(() => {
        $(this).parent().remove();
    }, 200);
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
    if (index === src.length) {
        lines.push('');
    }

    for (let lib in libs) {
        if ({}.hasOwnProperty.call(libs, lib)) {
            src.splice(index, 0, `${indent}${(indent) ? '\t' : ''}${libs[lib]}`);
        }
    }

    let copy = $('<textarea>').val(src.join('\n')).appendTo('body').select();
    document.execCommand('copy');
    copy.remove();

    $(this).tooltip('hide').attr('data-original-title', 'Copied').tooltip('show');
    setTimeout(() => {
        $(this).tooltip('hide');
    }, 1000);
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
        if (split === 'horizontal') {
            $('#codeCol').css('width', 'calc(100% - 3px)');
        } else {
            $('#codeCol').css('height', '100%');
        }
    }

    $('#Editor').css('display', 'block');
    $('#Libraries').css('display', 'none');

    $(':root').css('--indent-size', indentSize);
    $('#indentSize').val(`${indentSize} spaces`);
    $('#lang').val(lang);
    $('#resultShown').prop('checked', resultShown);
    $('#realtimeMode').prop('checked', realtime === 'on');
    $('#autosaveMode').prop('checked', autosave === 'on');

    for (let lib in libs) {
        if ({}.hasOwnProperty.call(libs, lib)) {
            $('#libList').append(`<li class="list-group-item d-flex align-items-center">${lib} <div id="deleteLib" class="ml-auto"><div class="deleteLib-content">Remove</div></div></li>`);
        }
    }
});
