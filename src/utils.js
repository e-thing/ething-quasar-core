import { date, format } from 'quasar'
import EThing from 'ething-js'


export function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


export function dateToString (d) {
  if (typeof d === 'string') d = new Date(d)
  if (!d) {
    return '-'
  }
  var ts = d.getTime()
  return date.formatDate(ts, 'YYYY-MM-DD HH:mm')
}

export function sizeToString (s) {
  return format.humanStorageSize(s)
}

/**
return a formatted string describing an object
exemple:
  { "key1": 0, "key2": "value"}
  will output
  "key1:  0, key2: value"
**/
export function describe (obj) {
  var s = []

  const toString = function (v) {
    if (EThing.utils.isId(v)) {
      const r = EThing.arbo.get(v)
      if (r) {
        return r.name()
      }
    }
    if (Array.isArray(v)) {
      return v.map( i => toString(i) ).join(' ')
    }
    if (typeof v === 'object' && v !== null) {
      if (Object.keys(v).length === 0) return ''
      /*if (typeof v.toString === 'function')
        return v.toString()*/
      return '{...}'
    }
    if (v===null) return ''
    return String(v)
  }

  for (var k in obj) {
    let v = obj[k]
    var l = toString(v)

    if (!l || typeof v === 'undefined') continue
    s.push(k + ': ' + l)
  }
  return s.join(', ')
}