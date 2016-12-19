'use babel';

import path from 'path';
import { CompositeDisposable } from 'atom';
import { getContextFromMouseEvent } from './utils';
import { execDescribe, execDefinition, getGuruTool } from './guru';
import { parseTooltip } from './parser';
import TipElement from './tip-element';

export default class GoTipView {

  constructor(goconfig) {
    // Create root element
    this.last = {};

    this.element = document.createElement('div');
    this.element.classList.add('go-tip', 'popover-list', 'select-list');
    this.goconfig = goconfig;
    this.subs = [];
    this.handle = null;
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  removeTooltip(){
    if(this.last.deco){
      this.last.deco.destroy();
      this.last.deco = null;
    }

    if(this.last.marker){
      this.last.marker.destroy();
      this.last.marker = null;
    }

    if(this.last.tip){
      this.last.tip.dispose();
      this.last.tip = null;
    }

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

      let editor = atom.workspace.getActiveTextEditor();
      let v = atom.views.getView(editor);
      let pos  = v.component.screenPositionForMouseEvent(e);

      let tip = new TipElement();

      let marker = editor.markBufferRange([pos, pos]);
      let overlay = editor.decorateMarker(marker, {
        type: 'overlay',
        item: tip,
        position: 'tail',
      });

      self.last.deco = overlay;
      self.last.marker = marker;
      self.last.tip = tip;


      console.log('marker', marker);

      tip.innerHTML = `
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
      `;



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
