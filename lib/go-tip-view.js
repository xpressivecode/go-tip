'use babel';

import path from 'path';
import { CompositeDisposable } from 'atom';
import { getContextFromMouseEvent } from './utils';

export default class GoTipView {

  constructor(goconfig) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('go-tip');
    this.goconfig = goconfig;
    this.subs = [];
    this.handle = null;
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  removeTooltip(){
    if(!this.subs || !this.subs.length)return;

    for(var i=0;i<this.subs.length;i++){
      this.subs[i].dispose();
    }
    this.subs = [];
  }

  activate(){
    let self = this;

    console.log('go-tip activated')
    atom.views.getView(atom.workspace).addEventListener('mousemove', (e) => {
      self.onMouseMove(e);
    });
  }

  onMouseMove(e){
    let self = this;

    self.removeTooltip();

    if(this.handle)clearTimeout(this.handle);
    this.handle = setTimeout(() => {
        self.createToolTip(e);
    }, 200);
  }

  createToolTip(e) {
    let self = this;

      let ctx = getContextFromMouseEvent(e);
      if(!ctx){
        self.removeTooltip();
        return;
      }

      self.removeTooltip();

      let env = self.goconfig.environment({file: ctx.file, directory: ctx.dir});

      self.goconfig.locator.findTool('guru', {file: ctx.file, directory: ctx.dir }).then((cmd) =>{
        if(!cmd){
          console.log('failed to find guru');
          return;
        }

        let args = ['-json','describe', ctx.bufferFile + ':#' + ctx.offset];
        self.goconfig.executor.exec(cmd, args, {cwd: ctx.cwd, env: env, input: ctx.text}).then((r) => {
          if(r.stderr && r.stderr.trim() !== ''){
            console.log('guru error', r.stderr);
            return;
          }

          let describe = {};
          let title = '';
          let prefix = '';
          let definition = {};
          let icon = '';

          if(r.stdout && r.stdout.trim() !== ''){
            describe = JSON.parse(r.stdout);
            if(describe.value){
              if(describe.desc === 'basic literal'){
                title = `${describe.value.value} ${describe.value.type}`;
              }else if(describe.desc === 'identifier'){
                title = `${describe.value.type}`;

                if(describe.value.value){
                  title = title + ' = ' + describe.value.value;
                }
              }
            }
          }
          args[1] = 'definition';

          self.goconfig.executor.exec(cmd, args, {cwd: ctx.cwd, env: env, input: ctx.text}).then((r) => {
            if(r.stderr && r.stderr.trim() !==''){
              console.log('guru definition error', r.stderr);
            }

            if(r.stdout && r.stdout.trim() !== ''){
              definition = JSON.parse(r.stdout);

              console.log(describe);
              console.log(definition);
            }

            if(definition.desc){
              if(definition.desc.indexOf('const') === 0){
                prefix = 'const';
              }else if(definition.desc.indexOf('func') === 0){
                icon = "function";
                if(definition.desc.indexOf("(") !== -1){
                    title = "";
                    prefix = definition.desc;
                }else{
                    prefix = definition.desc.substring(5);
                }
              }else if(definition.desc.indexOf('type') === 0){
                prefix = definition.desc;
                title = describe.type.namedef;
              }else{
                prefix = definition.desc;
              }
            }

            self.subs.push(atom.tooltips.add(ctx.element, {
              title: `
              <atom-overlay class="go-tip">
                  <ol class="list-group">
                    <li>
                      <span class="icon-container"><i class="icon package"><i class="icon-package"></i></i></span>
                      <span class="left-label">package</span>
                      <span class="word-container">
                        <span class="word">${prefix} ${title}</span>
                        <span class="right-label"></span>
                      </span>
                    </li>
                  </ol>
              </atom-overlay>
              `,
              trigger: 'manual',
              animation: false,
              html: true,
            }));
          });
        });
      });
  }

  // Tear down any state and detach
  destroy() {
    this.removeTooltip();
    this.element.remove();
  }

  getElement() {
    return this.element;
  }
}
