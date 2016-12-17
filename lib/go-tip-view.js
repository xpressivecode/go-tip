'use babel';

import path from 'path';
import { CompositeDisposable } from 'atom';

export default class GoTipView {

  constructor(goconfig) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('go-tip');
    this.tooltip = null;
    this.last = null;
    this.goconfig = goconfig;
    this.processing = false;
    this.subs = [];

  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  activate() {
    let self = this;

    console.log('go-tip activated')
    atom.views.getView(atom.workspace).addEventListener('mousemove', function(e){


      if(self.processing)return;
      self.processing = true;

      for(var i=0;i<self.subs.length;i++){
        self.subs[i].dispose();
      }
      self.subs = [];

      let editor = atom.workspace.getActiveTextEditor()
      if(!editor){
        self.processing = false;
        return;
      }

      if(editor.getGrammar().scopeName !== 'source.go'){
        self.processing = false;
        return;
      }

      if(e.path[0].className !== 'source go' && e.path[1].className !== 'source go'){
        self.processing = false;
        return;
      }

      let value = e.path[0].textContent;
      let root = e.path[1];
      // TODO add more use cases
      for(let i=0;i< root.childNodes.length;i++){
        let child = root.childNodes[i];

        switch(child.className){
          case 'support function go':
            console.log(self.last == child);
            if(self.last == child)return;

            let v = atom.views.getView(editor);
            let screenpos = v.component.screenPositionForMouseEvent(e);
            let pos = editor.bufferPositionForScreenPosition(screenpos);
            let buffer = editor.getBuffer();
            let text = editor.getText();


            let index = buffer.characterIndexForPosition(pos);

            let offset = Buffer.byteLength(text.substring(0, index), 'utf-8');

            console.log('pos', pos, 'value', value, 'index', index, 'offset', offset);

            let args = ['-f=json', 'autocomplete', buffer.getPath(), offset];

            let lo = {
              file: editor.getPath(),
              directory: path.dirname(editor.getPath())
            };

            self.goconfig.locator.findTool('gocode', lo).then(function(cmd){
              if(!cmd){
                self.processing = false;
                return;
              }

              let cwd = path.dirname(buffer.getPath());
              let env = self.goconfig.environment(lo);

              self.goconfig.executor.exec(cmd, args, {cwd: cwd, env: env, input: text}).then((r) => {
                  if(r.stderr && stderr.trim() !== ''){
                    console.log('autocomplete error: ', r.stderr);
                  }

                  if(r.stdout && r.stdout.trim() !== ''){
                    let results = JSON.parse(r.stdout);
                    console.log('full results', results);

                    console.log('comparing against value *' + value + '*');

                    results = results[1].filter((x) => {
                      return x.class === 'func' && x.name.toLowerCase() === value.trim().toLowerCase();
                    });

                    console.log('final results', results);
                    if(results.length) {

                      let def = results[0];
                      console.log('setting tooltip with', def, child);
                      self.subs.push(atom.tooltips.add(child, {
                        title: value + ': ' + def.type,
                        trigger: 'manual',
                      }));

                    }

                    //self.tooltip = atom.tooltips.add(child, {title: value, trigger: 'manual' });


                  }
              });
            });

            break;
          default:
            console.log('unknown `' + child.className + '` with value ' + value);
            break;
        }
      }

      self.processing = false;
    });
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }
}
