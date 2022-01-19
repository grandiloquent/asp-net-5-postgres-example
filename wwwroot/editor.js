// 

function setCopy(editor, isCut) {
    editor.addEventListener('keydown', async function (e) {
        console.log(e);
        if (e.ctrlKey && (isCut ? e.keyCode === 88 : e.keyCode === 67)) { // tab was pressed
            let start = editor.selectionStart;
            let end = editor.selectionEnd;
            const string = editor.value;
            if (start === end) {
                while (start > 0 && string[start - 1] !== '\n') {
                    start--;
                }
                while (end < string.length) {
                    end++;
                    if (string[end] === '\n') break;

                }
                const value = string.substring(start, end);
                if (!value.trim()) return;
                await navigator.clipboard.writeText(value);
                e.preventDefault();
                if (isCut) {
                    const position = findWhitespaceLine(editor);
                    start = position[0];
                    end = position[1];
                    editor.setRangeText('', start + 1, end);
                }
            }
        }
    }, false);
}
function findWhitespaceLine(editor) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    let string = editor.value;
    let offsetStart = start;
    while (offsetStart > 0) {
        if (string[offsetStart - 1] !== '\n')
            offsetStart--;
        else {
            while (offsetStart > 0) {
                if (/\s/.test(string[offsetStart - 1]))
                    offsetStart--;
                else break;
            }
            break;
        }
    }
    let offsetEnd = end;
    while (offsetEnd < string.length) {
        if (string[offsetEnd + 1] !== '\n')
            offsetEnd++;
        else {
            while (offsetEnd < string.length) {
                if (/\s/.test(string[offsetEnd + 1]))
                    offsetEnd++;
                else break;
            }
            break;
        }
    }
    return [offsetStart, offsetEnd];
}


function setIndentation(editor) {
    editor.addEventListener('keydown', function (e) {
        if (e.keyCode === 9) { // tab was pressed
            // get caret position/selection
            const start = this.selectionStart;
            const end = this.selectionEnd;
            const target = e.target;
            const value = target.value;
            // set textarea value to: text before caret + tab + text after caret
            target.value = value.substring(0, start) +
                "\t" +
                value.substring(end);
            // put caret at right position again (add one for the tab)
            this.selectionStart = this.selectionEnd = start + 1;
            // prevent the focus lose
            e.preventDefault();
        }
    }, false);
}


const editor = document.querySelector('[name=content]');
setIndentation(editor);
setCopy(editor);
setCopy(editor, true);

