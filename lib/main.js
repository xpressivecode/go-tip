'use babel';

import GoTipView from './go-tip-view';
import { CompositeDisposable } from 'atom';

export default {

  goTipView: null,
  subscriptions: null,
  goconfig: null,

  activate() {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
  },

  consumeGoConfig(service){
    this.goconfig = service;

    this.goTipView = new GoTipView(this.goconfig);
    this.goTipView.activate();
  },

  deactivate() {
    this.goconfig = null;
    this.subscriptions.dispose();
    this.goTipView.destroy();
  },

  serialize(){
    return {
      goTipViewState: !this.goTipView ? null: this.goTipView.serialize()
    };
  }
};
