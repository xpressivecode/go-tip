'use babel';

import * as parsers from '../lib/parsers';

describe('parsers', () => {
  it('should successfully parse literals', () => {
    let guru = {
      describe: {
        value: {
          value: "foo",
          type: "string"
        }
      }
    };

    let p = new parsers.LiteralParser(guru);
    let tip = p.parse();

    expect(tip.type).toBe('literal');
    expect(tip.prefix).toBe('literal');
    expect(tip.icon).toBe('<span class="icon-letter">l</span>');
    expect(tip.desc).toBe(`${guru.describe.value.value} ${guru.describe.value.type}`);
  });

  it('should successfully parse constants', () => {
      let guru = {
        definition: {
          desc: 'const net/http.StatusOK'
        },
        describe: {
          value: {
            value: '200',
            type: 'untyped int'
          }
        }
      };

      let p = new parsers.ConstantParser(guru);
      let tip = p.parse();

      expect(tip.type).toBe('constant');
      expect(tip.prefix).toBe('const');
      expect(tip.icon).toBe('<span class="icon-letter">c</span>');
      expect(tip.desc).toBe(`http.StatusOK untyped int = 200`);
  });
});
