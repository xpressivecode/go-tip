'use babel';

import ConstantParser from './constant.js';
import FunctionParser from './function.js';
import LiteralParser from './literal.js';
import PackageParser from './package.js';
import TypeParser from './type.js';
import VariableParser from './variable.js';

let parse = function(obj){
  let parser = getParser(obj);

  return parser.parse();
}

let getParser = (obj) => {
  if(obj.definition.desc && obj.definition.desc.indexOf('type') === 0)return new TypeParser(obj);
  if(obj.definition.desc && obj.definition.desc.indexOf('package') === 0)return new PackageParser(obj);
  if(obj.definition.desc && obj.definition.desc.indexOf('func') === 0)return new FunctionParser(obj);
  if(obj.definition.desc && obj.definition.desc.indexOf('const') === 0)return new ConstantParser(obj);
  if(obj.definition.desc && obj.definition.desc.indexOf('var') === 0)return new VariableParser(obj);
  if(obj.describe && obj.describe.desc === 'basic literal')return new LiteralParser(obj);

  return {
    parse: function(){
      return {};
    }
  };
};

export { ConstantParser, FunctionParser, LiteralParser, PackageParser, TypeParser, VariableParser, parse };
