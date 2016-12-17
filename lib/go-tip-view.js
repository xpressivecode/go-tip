'use babel';

export default class GoTipView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('go-tip');
    this.tooltip = null;
    this.last = null;

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The GoTip package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  activate() {
    console.log('activate')
    atom.views.getView(atom.workspace).addEventListener('mousemove', function(e){
      if(e.path[1].className !== 'source go')return;

      console.log(e.path[0].textContent, e.path[1]);

      let value = e.path[0].textContent;
      let root = e.path[1];
      // TODO add more use cases
      for(let i=0;i< root.childNodes.length;i++){
        let child = root.childNodes[i];

        switch(child.className){
          case 'support function go':
            if(this.last == child)return;

            console.log('you are looking at the function: ' + value);
            if(this.tooltip)this.tooltip.dispose();

            this.tooltip = atom.tooltips.add(child, {title: value, trigger: 'manual' });
            break;
          default:
            console.log('unknown with value ' + value);
            break;
        }
      }
    });

    let cursor = atom.workspace.getActiveTextEditor().getLastCursor()

    this.cursorSubscription = cursor.onDidChangePosition(function(c){
      console.log(c)
      console.log('cursor moved')

      let scope = cursor.getScopeDescriptor()
      console.log(scope)

      let editor = atom.workspace.getActiveTextEditor()

      console.log('checking for editor')

      if(editor){
        console.log('checking for grammar', editor.getGrammar().name)
        if(editor.getGrammar().name != 'Go'){
          return
        }

        console.log('getting element')
        let v = atom.views.getView(editor)
        let pos = v.pixelPositionForBufferPosition(cursor.getBufferPosition())

        console.log('position', pos)
        let el = v.shadowRoot.elementFromPoint(pos.left, pos.top)

        console.log(el)
      }
    });




  }

  // Tear down any state and detach
  destroy() {
    if(this.cursorSubscription){
      this.cursorSubscription.dispose()
    }
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
