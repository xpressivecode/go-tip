'use babel';

import path from 'path';
import { CompositeDisposable } from 'atom';
import { getContextFromMouseEvent } from './utils';
import { execDescribe, execDefinition, getGuruTool } from './guru';
import { parseTooltip } from './parser';

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
    }, 50);
  }

  createToolTip(e) {
    if(this.processing)return;
    let self = this;

    let ctx = getContextFromMouseEvent(e);
    if(!ctx){
      self.removeTooltip();
      return;
    }

    self.processing = true;
    self.removeTooltip();

    let env = self.goconfig.environment({file: ctx.file, directory: ctx.dir});

    getGuruTool(self.goconfig, ctx)
    .then(execDescribe)
    .then(execDefinition)
    .then((obj) => {
      let tooltip = parseTooltip(ctx, obj);

      if(!tooltip.type || !tooltip.type.length){
        self.processing = false;
        return;
      }

      self.subs.push(atom.tooltips.add(ctx.element, {
        title: `
        <atom-overlay class="go-tip">
        <ol class="list-group">
        <li>
        <span class="icon-container"><i class="icon ${tooltip.type}">${tooltip.icon}</i></span>
        <span class="left-label">${tooltip.prefix}</span>
        <span class="word-container">
        <span class="word">${tooltip.desc.replace(/\n/g, '<br />')}</span>
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

      self.processing = false;
      console.log('tooltip', tooltip);
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
