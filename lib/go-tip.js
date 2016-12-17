'use babel';

import GoTipView from './go-tip-view';
import { CompositeDisposable } from 'atom';

export default {

  goTipView: null,
  subscriptions: null,

  activate(state) {
    console.log('go-tip.js activate')
    this.goTipView = new GoTipView(state.goTipViewState);
    this.goTipView.activate()

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
  },

  deactivate() {
    this.subscriptions.dispose();
    this.goTipView.destroy();
  },

  serialize() {
    return {
      goTipViewState: this.goTipView.serialize()
    };
  }

};
