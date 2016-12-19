'use babel';

class TipElement extends HTMLElement {
  createdCallback(){
    this.classList.add('popover-list', 'select-list');
  }

  attachedCallback(){
    this.parentElement.classList.add('go-tip');
  }

  dispose(){
    console.log('removed!!!!');
    if(this.parentNode){
      this.parentNode.removeChild(this);
    }
  }
}

export default TipElement = document.registerElement('go-tip-container', { prototype: TipElement.prototype }); // eslint-disable-line no-class-assign
