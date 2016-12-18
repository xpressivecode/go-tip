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
      prefix = getFunctionReturnValues(obj);
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
      case 'type':
        return `<span class="icon-letter">t</span>`;
      case 'variable':
        return `<span class="icon-letter">v</span>`;
      case 'function':
        return `<span class="icon-letter">f</span>`;
      case 'constant':
        return `<span class="icon-letter">c</span>`;
      case 'package':
        return `<i class="icon-package" />`;
        case 'default':
        return `<span class="icon-letter">?</span>`;
    }
};

let cleanName = (name) => {
  return name;

  // TODO implement cleanName 
  // example could be io/ioutils.ReadFile(...)
  // or (*foo).Foobar()
  // or (mx03.io/wrench.IBucket).UpdateObject(...)
  // or (net/http.StatusOK)

  var nameparts = name.split('.');
  var left = nameparts[0];
  var right = nameparts[1];

  var packageparts = left.split('/');

  name = `${packageparts[packageparts.length-1]}.${right}`;

  return name;
};

let getDescription = (type, obj) => {
    switch(type){
      case 'type':
        var name = obj.definition.desc.replace('type ', '');
        var def = obj.describe.type.namedef;

        console.log('struct', name, def);

        return `${name} ${def}`;
      case 'function':
        var name = obj.definition.desc.replace('func ', '');
        name = cleanName(name);

        var index = obj.describe.value.type.indexOf(')') + 1;
        var def =obj.describe.value.type.substring(0, index);

        def = def.replace('func', '');

        return `${name} ${def}`;
      case 'package':
        return obj.definition.desc.replace('package ', '');
      case 'constant':
        var name = obj.definition.desc.replace('const ', '');
        name = cleanName(name);

        var type = obj.describe.value.type;
        var value = obj.describe.value.value;

        return `${name} ${type} = ${value}`;
      case 'variable':
        var name = obj.definition.desc.replace('var ', '');
        var type = obj.describe.value.type;

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

  return '';
};

module.exports = {
  parseTooltip
};
