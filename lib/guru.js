'use babel';

let getGuruTool = (goconfig, ctx) => {
  let p = new Promise((resolve, reject) => {
    let env = goconfig.environment({ file: ctx.file, directory: ctx.dir });

    goconfig.locator.findTool('guru', { file: ctx.file, directory: ctx.dir }).then((cmd) => {
      if(!cmd){
        return resolve(null);
      }

      return resolve({
        goconfig: goconfig,
        guru: cmd,
        env: env,
        ctx: ctx
      });
    });
  });

  return p;
};

// TODO a lot of repeat code to abstract
let execDefinition = (obj) => {
    let p = new Promise((resolve, reject) => {
      let args = ['-json', 'definition', `${obj.ctx.bufferFile}:#${obj.ctx.offset}`];

      obj.goconfig.executor.exec(obj.guru, args, {
        cwd: obj.ctx.cwd,
        env: obj.env,
        input: obj.ctx.text
      }).then((r) => {
        if(r.stderr && r.stderr.trim() !== ''){
          console.log('guru definition err: ', r.stderr);
          obj.definition = {};
        }else if(r.stdout && r.stdout.trim() !== ''){
          obj.definition = JSON.parse(r.stdout);
        }
        
        resolve(obj);
      });
    });

    return p;
};

let execDescribe = (obj) => {
  let p = new Promise((resolve, reject) => {
    let args = ['-json', 'describe', `${obj.ctx.bufferFile}:#${obj.ctx.offset}`];

    obj.goconfig.executor.exec(obj.guru, args, {
      cwd: obj.ctx.cwd,
      env: obj.env,
      input: obj.ctx.text
    }).then((r) => {
      if(r.stderr && r.stderr.trim() !== ''){
        console.log('guru describe err: ', r.stderr);
        obj.describe = {};
      }else if(r.stdout && r.stdout.trim() !== ''){
        obj.describe = JSON.parse(r.stdout);
      }

      resolve(obj);
    });
  });

  return p;
};

module.exports = {
  getGuruTool,
  execDescribe,
  execDefinition
};
