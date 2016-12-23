'use babel';

import { removePackages } from '../utils';

export default class TypeParser {
  constructor(obj){
    this.obj = obj;
  }

  parse(){
    let ret = {
      type: 'type',
      prefix: 'struct',
      desc: this.description(),
      icon: `<span class="icon-letter">t</span>`
    };

    return ret;
  }

  description(){
    var name = this.obj.definition.desc.replace('type ', '');
    var def = this.obj.describe.type.namedef;

    def = this.parseDefinition();
    name = removePackages(name);

    return `${name} ${def}`;
  }

  parseDefinition(){
    let typedef = this.obj.describe.type.namedef;
    // remove head/tail (`struct{` and `}`)
    typedef = typedef.substring(7, typedef.length-1);

    let props = typedef.split(';').map((x)=>{return x.trim(); });
    let names = props.map((x) => { return x.split(' ')[0];});
    let types = props.map((x) => { return removePackages(x.split(' ')[1]);});

    let name_maxlen = names.sort((a,b) => {return b.length - a.length;})[0].length;
    let type_maxlen = types.sort((a,b) => {return b.length - a.length;})[0].length;

    for(let i=0;i<props.length;i++){
      let parts = props[i].split(' ');

      // remove packages from the typedef
      parts[1] = removePackages(parts[1]);

      let delta = name_maxlen - parts[0].length;
      let spacers = delta > 0 ? Array(delta+1).join('&nbsp;') : '';
      let name = `&nbsp;&nbsp;&nbsp;&nbsp;${parts[0]}${spacers}`;
      let type = `<span class="storage type numeric go">${parts[1]}</span>`;
      let tags = '';

      if(parts.length > 2){
        let delta =type_maxlen - parts[1].length;
        let spacers = delta > 0 ? Array(delta+1).join('&nbsp;') : '';

        tags = parts.slice(2).join(' ');

        // swap quotes around to match source
        tags = tags.replace(/\\"/g, "'");
        tags = tags.replace(/"/g, "`");
        tags = tags.replace(/'/g,'"');

        tags = `<span class="string quoted raw go">${spacers}${tags}</span>`;
      }

      props[i] = `${name} ${type} ${tags}`;
    }

    typedef = props.length > 0 ? `struct{\n${props.join('\n')}\n}`  : 'struct{}';

    return typedef;
  }
};
