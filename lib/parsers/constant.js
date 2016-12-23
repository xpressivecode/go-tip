'use babel';

import { removePackages } from '../utils';

export default class ConstantParser {
  constructor(obj){
    this.obj = obj;
  }

  parse(){
    let ret = {
      type: 'constant',
      prefix: 'const',
      desc: this.description(),
      icon: `<span class="icon-letter">c</span>`
    };

    return ret;
  }

  description(){
    let name = this.obj.definition.desc.replace('const', '');
    name = removePackages(name);

    let type = this.obj.describe.value.type;
    let value = this.obj.describe.value.value;

    return `${name} ${type} = ${value}`;
  }
};
