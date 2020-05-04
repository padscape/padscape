let defaultText, lang, theme, textSize, realtime, autosave, indentSize, resultShown, split, creator, username, libLink, libs, hasSaved;

let languageDefaults = {
    'HTML': '<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<title>App</title>\n\t</head>\n\t<body>\n\t\t<h1>Hello, World!</h1>\n\t</body>\n</html>',
    'C++': '#include <iostream>\n\nint main() {\n\tstd::cout << "Hello, World!";\n\treturn 0;\n}',
    'Python': 'print("Hello, World!")',
    'Rust': 'fn main() {\n\tprintln!("Hello, World!");\n}',
    'C': '#include <stdio.h>\n\nint main() {\n\tprintf("Hello, World!");\n\treturn 0;\n}',
    'Go': 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, World!")\n}',
    'Java': 'class App {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, World!");\n\t}\n}',
    'Scala': 'object App {\n\tdef main(args: Array[String]) = {\n\t\tprintln("Hello, World!")\n\t}\n}'
};

init = () => {
    // Append the HTML code
    editor = this;

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
    lang = (isDefined(localStorage.padscapeLanguage)) ? localStorage.padscapeLanguage : 'html';
    hasSaved = false;

    $(':root').css({'--text-size': textSize, '--indent-size': indentSize});
    listenLanguage(lang);

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
            
            libs = (isDefined(localStorage.padscapeLib)) ? JSON.parse(localStorage.padscapeLib) : {};
            $('#src').val(getText(false));

            highlight(defaultText);
            showResult();
            runAll();
        });
    } else {
        getPadContents(window.location.hash.substring(1)).then(getUsername).then(data => {
            if (data['pad']) {
                $('#src').val(data['pad']['Code']);
                defaultText = data['pad']['Code'];
                creator = data['pad']['Creator'];
                libs = JSON.parse(data['pad']['Libraries']);
                highlight(defaultText);
                showResult();
                emptyResponse = false;
            } else {
                emptyResponse = true;
            }

            username = data['ip']['ip'];
            if (!location.hash || emptyResponse) { creator = username; }

            if (creator !== username) { $('#save').html("Fork&nbsp;&nbsp;&nbsp;<i class='fas fa-code-branch'></i>"); }
            if (creator === username && location.hash) { $('#export-delete').append(`<button type="button" class="btn btn-danger noGlow" id="delete">Delete&nbsp;&nbsp;&nbsp;<i class='fas fa-trash'></i></button>`); }

            $('#info').html(`A pad by ${(creator === username) ? 'you' : creator}`);
            $('#src').val(defaultText);
            highlight($('#src').val());

            $('#indentSize').val(`${indentSize} spaces`);
            $('[data-toggle="tooltip"]').tooltip();

            runAll();
        });
    }
}

getText = force => {
    defaultText = (function() {
        if (isDefined(localStorage.defaultText) && localStorage.defaultText != '' && !force) {
            return localStorage.defaultText;
        } else {
            return languageDefaults[lang];
        }
    }());

    return defaultText;
}

getInput = () => {
    $('#src').on('keydown', function(e) {
        let keyCode = e.keyCode || e.which;

        if (keyCode === 9) {
            // When tab key is pressed, increase the identation

            e.preventDefault();
            let start = this.selectionStart;
            let end = this.selectionEnd;

            if (start !== end) {
                let text = '';
                let lines = $('#src').val().substring(start, end).split('\n');

                for (let i = 0; i < lines.length; i++) {
                    line = `\t${lines[i]}`;
                    text += line;
                    if (i < lines.length - 1) { text += '\n'; }
                }

                $('#src').val(`${$('#src').val().substring(0, start)}${text}${$('#src').val().substring(end)}`);
            } else {
                $('#src').val(`${$('#src').val().substring(0, start)}\t${$('#src').val().substring(end)}`);
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
};

runCode = () => {
    let oldValue;

    $('#src').on('keyup', () => {
        let value = $('#src').val();
        
        if (value === oldValue || realtime !== "on") {
            return;
        }

        oldValue = value;
        showResult();
    });

    $('#run').click(() => {
        showResult();
    });

    $('#realtimeMode').click(() => {
        if ($(this).is(":checked")) {
            showResult();
        }
    });

    $(document).on("keyup keydown", e => {
        if (e.altKey && e.keyCode === 82) {
            showResult();
        }
    });
};

showResult = () => {
    let src = '';

    if (lang === 'HTML') {
        // Fetch the library imports
        for (let lib in libs) {
            if (libs.hasOwnProperty(lib)) {
                src += libs[lib];
            }
        }

        src += $('#src').val();
    } else if (lang === 'Python') {
        src = ` <head>
                    <script src="https://cdn.jsdelivr.net/npm/brython@3.8.8/brython.min.js"></script>
                </head>
                <body>
                    <script type="text/python">${$('#src').val()}</script>

                    <script>
                    const log = console.log.bind(console);
                    
                    console.log = (...args) => {
                        document.body.innerHTML = args;
                    }

                    brython();
                    </script>
                </body>`;
    }

    // Show the result in the iframe
    $('#result').attr('srcdoc', src);
};

renderOutput = () => {
    let oldValue = "";

    $('#src').on('input keydown', function() {
        let value = $(this).val();

        if (value === oldValue) {
            return;
        }

        oldValue = value;
        highlight(value);
    });
};

highlight = val => {
    // Highlight the code using Prism
    $('code', '.code-output').html(val.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n");
    Prism.highlightAll();
};

listenLanguage = language => {
    if (language === 'HTML' || language === 'Python') {
        $('.resultShownRow .col, .splits, .nav-tabs .nav-item:nth-child(2)').css('display', 'block');
        
        if (split === 'horizontal') {
            $('#codeCol').css('width', 'calc(50% - 3px)');
        } else {
            $('#codeCol').css('height', '50%');
        }

        resultShown = true;
        $('#resultShown').prop('checked', resultShown);
    } else {
        $('.resultShownRow .col, .splits, .nav-tabs .nav-item:nth-child(2)').css('display', 'none');

        if (split === 'horizontal') {
            $('#codeCol').css('width', 'calc(100% - 3px)');
        } else {
            $('#codeCol').css('height', '100%');
        }

        resultShown = false;
    }

    $('.code-output').removeClass().addClass(`code-output language-${language}`);
    $('code', '.code-output').removeClass().addClass(`language-${language}`).removeAttr('data-language');
};

listenerForScroll = () => {
    $('#src').on('scroll', function() {
        // Scroll the highlighted text to the position of the textarea
        $('.code-output').scrollTop($(this).scrollTop());
        $('.code-output').scrollLeft($(this).scrollLeft());

        // Scroll the textarea to the position of the highlighted text
        $(this).scrollTop($('.code-output').scrollTop());
        $(this).scrollLeft($('.code-output').scrollLeft());
    });
};

runAll = () => {
    // Remove the loading animation
    $('#load').css('visibility', 'hidden');
    $('#page').css({'visibility': 'visible', 'opacity': '1'});

    // Call all the member functions
    getInput();
    runCode();
    listenLanguage(lang);
    renderOutput();
    listenerForScroll();
};

(function() {
    if (!window.Prism || !document.querySelectorAll) {
        return;
    }

    $$ = (expr, con) => {
        return Array.prototype.slice.call((con || document).querySelectorAll(expr));
    };
        
    numberLines = () => {
        let lineHeight = parseInt(textSize) * 1.5;

        for (let i = 1; i < $('pre code').html().split('\n').length; i++) {          
            $('pre code').append(`<span class="line-number" data-start="${i}" style="top: calc(${lineHeight * (i - 1)}px + 3.2rem)"></span>`);
        }

        $('#src, .code-output').css('padding-left', `${textSize / 16 + 2}rem`);
    };

    Prism.hooks.add('after-highlight', env => {
        let pre = env.element.parentNode;
        
        if (!pre || !/pre/i.test(pre.nodeName)) {
            return;
        }

        $$('.line-number', pre).forEach(line => {
            console.log(line);
            line.parentNode.removeChild(line);
        });
        
        numberLines();
    });
}());

init();
