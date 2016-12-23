'use babel';

import { removePackages } from '../utils';

export default class VariableParser {
  constructor(obj){
    this.obj = obj;
  }

  parse(){
    let ret = {
      type: 'variable',
      prefix: 'var',
      desc: this.description(),
      icon: `<span class="icon-letter">v</span>`
    };

    return ret;
  }

  description(){
    var name = this.obj.definition.desc.replace('var ', '');
    var type = this.obj.describe.value.type;

    name = removePackages(name);
    type = removePackages(type);

    return `${name} ${type}`;
  }
};
