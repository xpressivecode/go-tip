'use babel';

import path from 'path';

export default class GoTipView {

  constructor(goconfig) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('go-tip');
    this.tooltip = null;
    this.last = null;
    this.goconfig = goconfig;
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  activate() {
    let self = this;

    console.log('go-tip activated')
    atom.views.getView(atom.workspace).addEventListener('mousemove', function(e){
      let editor = atom.workspace.getActiveTextEditor()
      if(!editor)return;

      if(editor.getGrammar().name != 'Go')return;
      if(e.path[1].className !== 'source go')return;

      let value = e.path[0].textContent;
      let root = e.path[1];
      // TODO add more use cases
      for(let i=0;i< root.childNodes.length;i++){
        let child = root.childNodes[i];

        console.log('processing', child.className, value);

        switch(child.className){
          case 'support function go':
            if(self.last == child)return;

            console.log('you are looking at the function: ' + value);
            if(self.tooltip)self.tooltip.dispose();

            let cursor = editor.getLastCursor();
            let buffer = editor.getBuffer();
            let text = editor.getText();
            let index = buffer.characterIndexForPosition(cursor.getBufferPosition());

            let offset = Buffer.byteLength(text.substring(0, index), 'utf-8');
            let args = ['-f=json', 'autocomplete', buffer.getPath(), offset];

            let lo = {
              file: editor.getPath(),
              directory: path.dirname(editor.getPath())
            };

            self.goconfig.locator.findTool('gocode', lo).then(function(cmd){
              if(!cmd){
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
                      return x.class === 'func' && x.name === value.trim().toLowerCase();
                    });

                    if(results.length) {
                      let def = results[0];
                      self.tooltip = atom.tooltips.add(child, {
                        title: value + ': ' + def.type
                      });
                    }

                    //self.tooltip = atom.tooltips.add(child, {title: value, trigger: 'manual' });


                  }
              });
            });

            break;
          default:
            console.log('unknown `' + '` with value ' + value);
            break;
        }
      }
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
