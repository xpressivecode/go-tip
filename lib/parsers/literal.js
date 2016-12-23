'use babel';

export default class LiteralParser {
  constructor(obj){
    this.obj = obj;
  }

  parse(){
    let ret = {
      type: 'literal',
      prefix: 'literal',
      desc: `${this.obj.describe.value.value} ${this.obj.describe.value.type}`,
      icon: `<span class="icon-letter">l</span>`
    };

    return ret;
  }
};
