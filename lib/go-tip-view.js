'use babel';

import path from 'path';
import { CompositeDisposable, Range } from 'atom';

export default class GoTipView {

  constructor(goconfig) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('go-tip');
    this.tooltip = null;
    this.last_message = null;
    this.last_point = null;
    this.goconfig = goconfig;
    this.processing = false;
    this.subs = [];
    this.handle = null;
    this.whitelist = [
      "source go",
      "support function go"
    ]
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  removeTooltip(){
    if(this.handle)clearTimeout(this.handle);

    this.last_message = '';
    if(!this.subs || !this.subs.length)return;

    for(var i=0;i<this.subs.length;i++){
      this.subs[i].dispose();
    }
    this.subs = [];
  }

  activate() {
    let self = this;

    console.log('go-tip activated')
    atom.views.getView(atom.workspace).addEventListener('mousemove', function(e){
      if(self.processing)return;
      self.processing = true;

      let editor = atom.workspace.getActiveTextEditor()
      if(!editor){
        self.removeTooltip();
        self.processing = false;
        return;
      }

      if(editor.getGrammar().scopeName !== 'source.go'){
        self.removeTooltip();
        self.processing = false;
        return;
      }

      let value = e.path[0].textContent;

      // haven't moved off the line?
      if(self.last_message == value){
        self.processing = false;
        return;
      }

      // GET TOP LEVEL `SOURCE GO`
      let elements = e.path.filter(function(x){
        if(!x.className)return false;

        return x.className.indexOf('source go') > -1;
      });

      if(!elements.length){
        self.removeTooltip();
        self.processing = false;
        return;
      }

      let root = elements[0];
      let children = [];

      for(let i=0;i<root.childNodes.length;i++){
        let cname = root.childNodes[i].className;
        if(!cname)continue;

        let xx = self.whitelist.filter((z) => {
          return cname.indexOf(z) > -1;
        });

        if(xx.length > 0){
          children.push(root.childNodes[i]);
        }
      }

      if(!children.length){
        self.removeTooltip();
        self.processing = false;
        return;
      }

      let child = children[0];

      let v = atom.views.getView(editor);
      let screenpos = v.component.screenPositionForMouseEvent(e);
      let pos = editor.bufferPositionForScreenPosition(screenpos);
      let buffer = editor.getBuffer();
      let text = editor.getText();

      self.removeTooltip();

      self.last_message = value;
      self.last_point = Range.fromObject(pos);

      let index = buffer.characterIndexForPosition(pos);
      let offset = Buffer.byteLength(text.substring(0, index), 'utf-8');

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
              console.log('value being compared', value, 'full results', results);

              results = results[1]
              if(results.length) {

                let def = results[0];
                let title = "";

                switch(def.class){
                  case 'func':
                    title = def.name + ' ' + def.type;
                    break;
                  case 'const':
                    // TODO how can we get the const value?
                    title = def.class + ' ' + def.name;
                    break;
                  default:
                    title = 'SETUP: ' + JSON.stringify(def);
                    break;
                }

                self.handle = setTimeout(function(){
                  self.subs.push(atom.tooltips.add(child, {
                    title: title,
                    trigger: 'manual'
                  }));
                }, 500);

                self.processing = false;
                return;
              }

            }
        });
      });

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
