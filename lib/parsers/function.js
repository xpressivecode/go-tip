'use babel';

import { removePackages } from '../utils';

export default class FunctionParser {
  constructor(obj){
    this.obj = obj;
  }

  parse(){
    let ret = {
      type: 'function',
      prefix: this.prefix(),
      desc: this.description(),
      icon: `<span class="icon-letter">f</span>`
    };

    return ret;
  }

  prefix(){
    let ret = '';

    if(this.obj.describe && this.obj.describe.value && this.obj.describe.value.type){
      let index = this.obj.describe.value.type.indexOf(')') + 1;
      ret = this.obj.describe.value.type.substring(index).trim();
    }

    return removePackages(ret);
  }

  description(){
    var name = this.obj.definition.desc.replace('func ', '').split(' ')[0];

    var lastIndex = name.lastIndexOf('.');

    // split the package and function up
    if(lastIndex > -1){
      // 0 = package, 1 = name
      var nameparts = [name.substring(0, lastIndex), name.substring(lastIndex)];

      var pkg = removePackages(nameparts[0]);

      // strip the paranthesis as we'll pull it from the guru describe call instead
      // as it's pretty consistent, vs the definition call changes
      // based on where the function came from (stdlibs don't include the args for instance)
      if(nameparts[1].indexOf('(') > -1){
        nameparts[1] = nameparts[1].substring(0, nameparts[1].indexOf('('));
      }

      name = `${pkg}${nameparts[1]}`;
    }

    var index = this.obj.describe.value.type.indexOf(')') + 1;
    var def = this.obj.describe.value.type.substring(0, index);

    def = def.replace('func', '');

    return `${name}${def}`;
  }
};
