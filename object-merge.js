Object.merge = function(o, a, b, objOrShallow) {
  var r, k, v, ov, bv, inR,
    isArray = Array.isArray(a),
    hasConflicts, conflicts = {},
    newInA = {}, newInB = {},
    updatedInA = {}, updatedInB = {},
    keyUnion = {},
    deep = true;
  
  if (typeof objOrShallow !== 'object') {
    r = isArray ? [] : {};
    deep = !objOrShallow;
  } else {
    r = objOrShallow;
  }
  
  for (k in b) {
    if (isArray && isNaN((k = parseInt(k)))) continue;
    v = b[k];
    r[k] = v;
    if (!(k in o)) {
      newInB[k] = v;
    } else if (v !== o[k]) {
      updatedInB[k] = v;
    }
  }
  
  for (k in a) {
    if (isArray && isNaN((k = parseInt(k)))) continue;
    v = a[k];
    ov = o[k];
    inR = (k in r);
    if (!inR) {
      r[k] = v;
    } else if (r[k] !== v) {
      bv = b[k];
      if (deep && typeof v === 'object' && typeof bv === 'object') {
        bv = Object.merge((k in o && typeof ov === 'object') ? ov : {}, v, bv);
        r[k] = bv.merged;
        if (bv.conflicts) {
          conflicts[k] = {conflicts:bv.conflicts};
          hasConflicts = true;
        }
      } else {
        // if 
        if (bv === ov) {
          // Pick A as B has not changed from O
          r[k] = v;
        } else if (v !== ov) {
          // A, O and B are different
          if (k in o)
            conflicts[k] = {a:v, o:ov, b:bv};
          else
            conflicts[k] = {a:v, b:bv};
          hasConflicts = true;
        } // else Pick B (already done) as A has not changed from O
      }
    }
    
    if (k in o) {
      if (v !== ov)
        updatedInA[k] = v;
    } else {
      newInA[k] = v;
    }
  }
  
  r = {
    merged:r,
    added: {
      a: newInA,
      b: newInB
    },
    updated: {
      a: updatedInA,
      b: updatedInB
    }
  };
  if (hasConflicts)
    r.conflicts = conflicts;
  return r;
}
