var sys = require('sys'), assert = require('assert');
require('./object-merge');

origin = {name:'rsms', following:['abc', 'd,ef'], modified:12345678, aliases:{'abc':'Abc'}}
local = {age:12, location:'sto', sex:'m', name:'rsms', modified:12345679, following:['abc', 'cat', 'xyz'], aliases:{'abc':'Abc', 'def':'Def'}}
remote = {age:13, name:'rsms', sex:'m', following:['abc', 'ooo'], modified:12345679, aliases:{'abc':'Abc', 'aab':'Aab'}}

merged = Object.merge(origin, local, remote);
sys.puts('-->\n'+sys.inspect(merged, false, 10));
//sys.puts(JSON.stringify(merged))
assert.equal(JSON.stringify(merged),
'{'+
  '"merged":'+
    '{"age":13,"name":"rsms","sex":"m","following":["abc","ooo","xyz"],"modified":12345679,"aliases":{"abc":"Abc","aab":"Aab","def":"Def"},"location":"sto"},'+
  '"added":'+
    '{"a":{"age":12,"location":"sto","sex":"m"},"b":{"age":13,"sex":"m"}},'+
  '"updated":'+
    '{'+
      '"a":{"modified":12345679,"following":["abc","cat","xyz"],"aliases":{"abc":"Abc","def":"Def"}},'+
      '"b":{"following":["abc","ooo"],"modified":12345679,"aliases":{"abc":"Abc","aab":"Aab"}}'+
    '},'+
  '"conflicts":'+
    '{"age":{"a":12,"b":13},"following":{'+
      '"conflicts":'+
        '{"1":{"a":"cat","o":"d,ef","b":"ooo"}}'+
      '}'+
    '}'+
'}');
