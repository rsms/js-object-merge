# Object.merge(o, a, b) -> c

3-way JavaScript Object merging.

Takes 3 versions of the same object -- where version 2 and 3 are both derived from version 1 -- and generates a 4th version, effectively merging version 2 and 3 together. When a conflict is detected (changes made in both version 2 and 3) changes from version 3 are used and information about the conflict is added to the `conflicts` structure.

I wrote this for using together with [node-couchdb-min](http://github.com/rsms/node-couchdb-min) to provide conflict resolution for CouchDB documents.

## Prototype

    Object.merge(Object origin, Object versionA, Object versionB,
      Bool shallow | Object base) -> Object

- `origin`: Ancestor version from which both `versionA` and `versionB` is derived.

- `versionA`: Version A of `origin`

- `versionB`: Version B of `origin`

- `shallow`: (*Advanced property*) If true, only resolve values at the first level. By setting this to true, many conflicts which could be merged automatically will not be merged. However, if you only want to test if there's a possibility of conflicts, setting this to true will yield better performance. In most cases this should be false or not set. 

- `base`: (*Advanced property*) A base object on which to build the final, merged version. To be entirely sure about how to use this and what it implies, you should probably walk through the source code.


**Return value:**

`Object.merge` returns a structure which looks like this:

    { merged: 
       { key1: 123
       , key2: 'john doe'
       , key3: [ 'abc', 'ooo', 'xyz' ]
       }
    , added: 
       { a: { key1: 789 }
       , b: { key1: 123, key2: 'john doe' }
       }
    , updated: 
       { a: { key3: [ 'abc', 'd,ef', 'xyz' ] }
       , b: {}
       }
    , conflicts: { key1: { a: 789, o: 4, b: 123 } }
    }

- The `merged` key contains "version 4" and is the merged result.

- The `added` key contains information about what parts where added (was not 
  present in the origin/version 1).

- The `updated` key contains information about what parts where updated (was 
  present in origin/version 1).

- If the `conflicts` key is present, there are conflicts and they are described
  by a structure `key: {a: value, o: value, b: value}` where each `value` is the
  value in each of the three versions. If the key was not present in the origin,
  `o` is not present. 

Unless `Object.merge` is called with a fourth argument with the constant `true`, conflict resolution is recursive for deep conflicts. In this case complex values (array, object) in the conflict structure will -- instead of the different values, be yet another `conflicts` structure. It might look like this:

    conflicts: {
      // Simple conflict:
      age: { 
        a: 12,  b: 13
      },
      // Conflict originates deep into a complex value:
      following: {
        conflicts: {
          // Member 'threeLetters' of the "conflicts" object is the source:
          'threeLetters': {
            a: 'xyz',  o: 'def',  b: 'ooo'
          }
        }
      }
    }


## Example:

    // The original version which both A and B are derived from.
    origin = {
      name:'rsms', 
      following:['abc', 'd,ef'],
      modified:12345678,
      aliases:{'abc':'Abc'}
    }
    // Version A
    A = {
      age:12, 
      location:'sto', 
      sex:'m', 
      name:'rsms', 
      modified:12345679,
      following:['abc', 'cat', 'xyz'],
      aliases:{'abc':'Abc', 'def':'Def'}
    }
    // Version B
    B = {
      age:13, 
      name:'rsms', 
      sex:'m', 
      following:['abc', 'ooo'], 
      modified:12345679, 
      aliases:{'abc':'Abc', 'aab':'Aab'}
    }

    result = Object.merge(origin, A, B);
    sys.puts('-->\n'+sys.inspect(result, false, 10));

    -->
    { merged: 
       { age: 13
       , name: 'rsms'
       , sex: 'm'
       , following: [ 'abc', 'ooo', 'xyz' ]
       , modified: 12345679
       , aliases: { abc: 'Abc', aab: 'Aab', def: 'Def' }
       , location: 'sto'
       }
    , added: 
       { a: { age: 12, location: 'sto', sex: 'm' }
       , b: { age: 13, sex: 'm' }
       }
    , updated: 
       { a: 
          { modified: 12345679
          , following: [ 'abc', 'cat', 'xyz' ]
          , aliases: { abc: 'Abc', def: 'Def' }
          }
       , b: 
          { following: [ 'abc', 'ooo' ]
          , modified: 12345679
          , aliases: { abc: 'Abc', aab: 'Aab' }
          }
       }
    , conflicts: 
       { age: { a: 12, b: 13 }
       , following: { conflicts: { '1': { a: 'cat', o: 'd,ef', b: 'ooo' } } }
       }
    }

## Requirements

- `Array.isArray(object) -> Boolean` to be implemented (which it is already in modern JavaScript environments).

## MIT license

Copyright (c) 2010 Rasmus Andersson <http://hunch.se/>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
