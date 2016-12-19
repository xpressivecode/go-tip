'use babel';

import path from 'path';

let getContextFromMouseEvent = (e) => {
  let editor = getEditorForGoSource();
  if(!editor)return null;

  let element = getElementFromMouseEvent(e);
  if(!element)return null;

  let offset = getOffsetFromMouesEvent(e);
  let file = editor.getPath();
  let dir = path.dirname(file);
  let cwd = path.dirname(editor.getBuffer().getPath());
  let bufferFile = editor.getBuffer().getPath();

  return {
    pos: bufferPositionFromMouseEvent(e),
    file: file,
    dir: dir,
    cwd: cwd,
    offset: offset,
    element: element,
    value: e.path[0].textContent,
    text: editor.getText(),
    bufferFile: bufferFile
  };
};

let getOffsetFromMouesEvent = (e) => {
  let editor = getEditorForGoSource();
  let pos = bufferPositionFromMouseEvent(e);
  let buffer = editor.getBuffer();
  let text = editor.getText();

  let index = buffer.characterIndexForPosition(pos);
  let offset = Buffer.byteLength(text.substring(0, index), 'utf-8');

  return offset;
};

let bufferPositionFromMouseEvent = (e) => {
  let editor = getEditorForGoSource();
  let v = atom.views.getView(editor);
  let screenpos = v.component.screenPositionForMouseEvent(e);
  let pos = editor.bufferPositionForScreenPosition(screenpos);

  return pos;
};

let getEditorForGoSource = () => {
  let editor = atom.workspace.getActiveTextEditor();
  if(!editor)return null;

  if(editor.getGrammar().scopeName !== 'source.go')return null;
  return editor;
};

let getElementFromMouseEvent = (e) => {
  // GET TOP LEVEL `SOURCE GO`
  let elements = e.path.filter(function(x){
    if(!x.className)return false;

    return x.className.indexOf('source go') > -1;
  });

  if(!elements.length)return null;

  // TODO drill in further so that we get more accurate placement
  // or alternatively use the buffer position and create a custom element

  return elements[0];
};

module.exports = {
  getContextFromMouseEvent
};
