'use babel';

let parseTooltip = (ctx, obj) => {
    let type = '';
    let prefix = '';
    let desc = '';

    type = getType(obj);
    prefix = getPrefix(type);
    desc = getDescription(type, obj);
    icon = getIcon(type);

    if(type === 'function'){
      prefix = removePackages(getFunctionReturnValues(obj));
    }

    return {
      type: type,
      icon: icon,
      prefix: prefix,
      desc: desc
    };
};

let getIcon = (type) => {
    switch(type){
      case 'literal':
        return `<span class="icon-letter">l</span>`;
      case 'type':
        return `<span class="icon-letter">t</span>`;
      case 'variable':
        return `<span class="icon-letter">v</span>`;
      case 'function':
        return `<span class="icon-letter">f</span>`;
      case 'constant':
        return `<span class="icon-letter">c</span>`;
      case 'package':
        return `<i class="icon-package"></i>`;
        case 'default':
        return `<span class="icon-letter">?</span>`;
    }
};

let parseStruct = (typedef) => {
  console.log('parsing struct', typedef);

  // remove head/tail (`struct{` and `}`)
  typedef = typedef.substring(7, typedef.length-1);

  let props = typedef.split(';').map((x)=>{return x.trim(); });
  let names = props.map((x) => { return x.split(' ')[0];});
  let maxlen = names.sort((a,b) => {return b.length - a.length;})[0].length;

  // remove packages from each property
  for(let i=0;i<props.length;i++){
    let p = removePackages(props[i]);
    let parts = p.split(' ');

    let delta = maxlen - parts[0].length;
    let spacers = delta > 0 ? Array(delta+1).join('&nbsp;') : '';
    let name = `&nbsp;&nbsp;&nbsp;&nbsp;${parts[0]}${spacers}`;
    let type = `<span class="storage type numeric go">${parts[1]}</span>`;
    let tags = '';

    if(parts.length > 2){
      tags = parts.slice(2).join(' ');

      // swap quotes around to match source
      tags = tags.replace(/\\"/g, "'");
      tags = tags.replace(/"/g, "`");
      tags = tags.replace(/'/g,'"');

      tags = `<span class="string quoted raw go"> ${tags}</span>`;
    }

    props[i] = `${name} ${type} ${tags}`;
  }

  typedef = props.length > 0 ? `struct{\n${props.join('\n')}\n}`  : 'struct{}';

  return typedef;
};

// TODO: remove packages from struct definitions
// TODO: should we remove the final package? iotuil.ReadFile etc to ReadFile?
let removePackages = (name) => {
  console.log('removing packages from ', name);

  let inParenthesis = name.indexOf('(') === 0 && name[name.length-1] === ')';
  if(inParenthesis){
    // remove ()
    name = name.substring(1, name.length-1);

    // need to cleanse each return or input type
    let parts = name.split(',');
    for(let i=0;i<parts.length;i++){
      parts[i] = removePackages(parts[i]);
    }

    name = parts.join();

    // add () back
    name = `(${name})`;

    // send it back to the main call to removePackages
    // where it will be further cleansed of the packages
    return name;
  }

  let parts = name.split('/');
  name = parts[parts.length-1];

  return name.trim();
};

let getDescription = (type, obj) => {
    switch(type){
      case 'literal':
        return `${obj.describe.value.value} ${obj.describe.value.type}`;
      case 'type':
        var name = obj.definition.desc.replace('type ', '');
        var def = obj.describe.type.namedef;

        def = parseStruct(def);
        name = removePackages(name);

        console.log('struct', name, def);

        return `${name} ${def}`;
      case 'function':
        var name = obj.definition.desc.replace('func ', '');
        name = removePackages(name);

        var index = obj.describe.value.type.indexOf(')') + 1;
        var def =obj.describe.value.type.substring(0, index);

        def = def.replace('func', '');

        return `${name} ${def}`;
      case 'package':
        return obj.definition.desc.replace('package ', '');
      case 'constant':
        var name = obj.definition.desc.replace('const ', '');
        name = removePackages(name);

        var type = obj.describe.value.type;
        var value = obj.describe.value.value;

        return `${name} ${type} = ${value}`;
      case 'variable':
        var name = obj.definition.desc.replace('var ', '');
        var type = obj.describe.value.type;

        name = removePackages(name);
        type = removePackages(type);

        return `${name} ${type}`;
      default:
        return '';
    }
};

let getFunctionReturnValues = (obj) => {
    if(obj.describe && obj.describe.value && obj.describe.value.type){
      let index = obj.describe.value.type.indexOf(')') + 1;
      return obj.describe.value.type.substring(index).trim();
    }

    return '';
};

let getPrefix = (type) => {
  switch(type){
    case 'literal':
      return 'literal';
    case 'type':
      return 'struct';
    case 'function':
      return 'func';
    case 'package':
      return 'package';
    case 'constant':
      return 'const';
    case 'variable':
      return 'var';
    default:
      return '';
  }
};

let getType = (obj) => {
  if(obj.definition.desc && obj.definition.desc.indexOf('type') === 0)return 'type';
  if(obj.definition.desc && obj.definition.desc.indexOf('package') === 0)return 'package';
  if(obj.definition.desc && obj.definition.desc.indexOf('func') === 0)return 'function';
  if(obj.definition.desc && obj.definition.desc.indexOf('const') === 0)return 'constant';
  if(obj.definition.desc && obj.definition.desc.indexOf('var') === 0)return 'variable';
  if(obj.describe && obj.describe.desc === 'basic literal')return 'literal';

  return '';
};

module.exports = {
  parseTooltip
};
