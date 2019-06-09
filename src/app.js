let defaultText = '<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<title>App</title>\n\t</head>\n\t<body>\n\t\t<h1>App</h1>\n\t</body>\n</html>';

var Editor = (function() {
	return {
		init: function(input, result, output, language) {
			this.input = input;
			this.result = result;
			this.output = output;
			this.language = language;
			
			this.focusInput(this.input);
			this.addDefaultText(this.input);
			this.getInput(this.input);
			this.runCode(this.input, this.result);
			this.renderOutput(this.output, this.input);
		},
		
		getInput: function(input) {
			$(document).delegate(input, 'keydown', function(e) {
				var keyCode = e.keyCode || e.which;

				if (keyCode == 9) {
					e.preventDefault();
					var start = this.selectionStart;
					var end = this.selectionEnd;

					$(this).val($(this).val().substring(0, start) + "\t" + $(this).val().substring(end));

					this.selectionStart =
					this.selectionEnd = start + 1;
				}
			});
		},
		
		runCode: function(input, result) {
			$(document).delegate(input, 'keyup', function(e) {
				this.code = $(input)[0].value;
				$(result)[0].srcdoc = this.code;
			});
			
			$(document).ready(function() {
				this.code = $(input)[0].value;
				$(result)[0].srcdoc = this.code;
			});
		},
		
		renderOutput: function(output, input){
			$(document).delegate(input, 'keyup', function(e) {
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
		
		focusInput: function(input){
			var input = $(input);
			
			input.focus();
			
			input[0].selectionStart = input[0].value.length;
			input[0].selectionEnd = input[0].value.length;
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
    minSize: 250,
    gutterSize: 6,
    cursor: 'col-resize'
});

Editor.init('#src', '#result', '.code-output', 'html');
