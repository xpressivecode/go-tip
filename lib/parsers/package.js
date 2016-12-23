'use babel';

export default class PackageParser {
  constructor(obj){
    this.obj = obj;
  }

  parse(){
    let ret = {
      type: 'package',
      prefix: 'package',
      desc: this.obj.definition.desc.replace('package ', ''),
      icon: `<i class="icon-package"></i>`
    };

    return ret;
  }
};
