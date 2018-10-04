/*
this module is responsible of downloading metadata from the ething server.
*/
import EThing from 'ething-js'
import localDefinitions from '../definitions'
import * as formSchemaCore from './formSchema/core'
import { extend } from 'quasar'


function getFromPath (obj, path, delimiter, createIfNotFound) {

  var parts = path.split(delimiter || '/')
  var p = obj

  for (var i in parts) {
    var key = parts[i]
    if (typeof p === 'object' && p !== null) {

      if (typeof p[key] === 'undefined' && createIfNotFound) {
        p[key] = {}
      }

      p = p[key]
    } else {
      return
    }
  }

  return p
}

function walkThrough (obj, ref, fn, path) {
  if (typeof fn === 'undefined' && typeof ref === 'function') {
    path = fn
    fn = ref
    ref = null
  }

  path = path || []
  ref = ref || {}

  var stop_ = false
  var stop = () => {
    stop_ = true
  }

  obj = fn (obj, ref, stop, path.join('/'))

  if (!stop_ && typeof obj === 'object' && obj !== null) {
    for (var k in obj) {
      var value = obj[k]

      if (typeof value === 'object' && value !== null) {
        var pathCopy = path.slice(0) // shallow copy
        pathCopy.push(k)
        obj[k] = walkThrough (value, ref[k], fn, pathCopy)
      }
    }
  }

  return obj
}

function resolve(node, definitions) {
  if (typeof node['$ref'] === 'string') {
    var ref = node['$ref']

    if (/^#\//.test(ref)) {
      ref = ref.substr(2)

      return resolve(getFromPath(definitions, ref), definitions)

    } else {
      console.warn('[meta] invalid JSON reference: ' + ref)
      return {}
    }
  }
  else if (typeof node['allOf'] !== 'undefined') {
    var allOf = node['allOf']

    var resolvedNode = {}

    for (let i in allOf) {
      let dep = allOf[i]
      let name = null

      if (typeof dep['$ref'] === 'string') {
        name = dep['$ref'].substr(2)
      }

      dep = resolve(dep, definitions)

      if (dep['type'] !== 'class') {
        return node // do not resolve something else than class !
      }

      var resolvedInheritances = []
      resolvedInheritances = resolvedInheritances.concat(resolvedNode.inheritances || [])
      if (name !== null) {
        resolvedInheritances.push(name)
      }
      resolvedInheritances = resolvedInheritances.concat(dep.inheritances || [])

      mergeClass(resolvedNode, dep)

      // do not inherit the folowing attributes
      resolvedNode.inheritances = resolvedInheritances
      resolvedNode.virtual = false

    }

    var node = extend(true, {}, node)
    delete node.allOf
    node.type = 'class'

    mergeClass(resolvedNode, node)

    return resolvedNode

  } else {
    return node
  }
}

function mergeFunction (a, b) {
  // concat the data function into an array
  var aDataFn = a
  var bDataFn = b
  var mergedDataFn = []
  if (aDataFn) {
    if (Array.isArray(aDataFn)) {
      mergedDataFn = mergedDataFn.concat(aDataFn)
    } else {
      mergedDataFn.push(aDataFn)
    }
  }
  if (bDataFn) {
    if (Array.isArray(bDataFn)) {
      mergedDataFn = mergedDataFn.concat(bDataFn)
    } else {
      mergedDataFn.push(bDataFn)
    }
  }
  return mergedDataFn
}

function mergeClass(a, b) {

  if (!b) return a

  // empty Object
  if (Object.keys(b).length === 0 && b.constructor === Object) return a

  var aPropKeys = Object.keys(a.properties || {})
  var bPropKeys = Object.keys(b.properties || {})
  var mergedPropKeys = bPropKeys
  aPropKeys.forEach(k => {
    if (mergedPropKeys.indexOf(k) === -1) {
      mergedPropKeys.push(k)
    }
  })

  // append required of b in a
  var mergedRequired = [].concat(a.required || []);
  (b.required || []).forEach(p => {
    if (mergedRequired.indexOf(p) === -1) {
      mergedRequired.push(p)
    }
  })

  // append signals of b in a
  var mergedSignals = [].concat(a.signals || []);
  (b.signals || []).forEach(p => {
    if (mergedSignals.indexOf(p) === -1) {
      mergedSignals.push(p)
    }
  })

  var mergedDataFn = mergeFunction(a.data, b.data)
  var mergedDynamicFn = mergeFunction(a.dynamic, b.dynamic)

  var merged = extend(true, a, b)

  // reorder properties and remove any invalid anyOf :
  var orderedProperties = {}
  mergedPropKeys.forEach(k => {
    if(k in merged.properties) {
      var prop = merged.properties[k]
      if (prop.anyOf && prop.type) {
        delete prop['anyOf']
      }
      orderedProperties[k] = prop
    }
  })
  merged.properties = orderedProperties

  merged.required = mergedRequired

  merged.signals = mergedSignals

  merged.data = mergedDataFn

  merged.dynamic = mergedDynamicFn

  return merged
}

function normalize (obj) {

  if (obj['type'] === 'class') {

    obj = extend(true, {
      color: 'grey',
      icon: 'mdi-help',
      description: '',
      required: [],
      properties: {},
      methods: {},
      signals: [],
      virtual: false,
      widgets: {},
      inheritances: [],
      disableCreation: false,
      dynamic: null,
      data: null,
      open: null
    }, obj)

    for (let k in obj.properties) {
      let p = obj.properties[k]
      if (!p.get) {
        p.get = r => r[k] ? r[k]() : r.attr(k)
      }
      if (!p.getFormatted) {
        p.getFormatted = p.get
      }
    }

    var rawData = obj.data
    obj.data = function (resource) {
      var compiled = {}
      if (rawData) {
        var arrayFn = typeof rawData === 'function' ? [rawData] : rawData
        rawData.forEach(dataFn => {
          var res = dataFn.call(this, resource)
          if (res) Object.assign(compiled, res)
        })
      }
      return compiled
    }

    if (typeof obj.open !== 'function') {
      var originalOpen = obj.open
      obj.open = function () {
        return originalOpen
      }
    }

    delete obj.dynamic

  }

  return obj
}

function bind (m, resource) {
  /*
  bind a metadata object to a resource
  */
  var originalDataFn = m.data
  m.data = function () {
    return originalDataFn.call(this, resource)
  }

  var originalOpenFn = m.open
  m.open = function (more) {
    return originalOpenFn.call(this, resource, more)
  }

  return m
}

var cached_meta_types = {}

function get (definitions, type) {
  var resource = null

  if (type instanceof EThing.Resource) {
    resource = type
    type = type.type()
  }

  // check in cache first
  if (resource) {
    var id = resource.id()
    if (id in cached_meta_types) {
      return cached_meta_types[id]
    }
  } else {
    if (type in cached_meta_types) {
      return cached_meta_types[type]
    }
  }

  // generate schema
  var m = getFromPath(definitions, type) || {}

  // dynamic
  if (resource) {
    if (m.dynamic) {
      m = extend(true, {}, m); // deep copy first !
      (Array.isArray(m.dynamic) ? m.dynamic : [m.dynamic]).forEach(dynamicFn => {
        var dyn_m = dynamicFn.call(m, resource)
        if (dyn_m) {
          mergeClass(m, dyn_m)
        }
      })
    }
  }

  // normalize
  m = normalize(m)
  if (resource) {
    m = bind(m, resource)
  }

  // store it in cache
  if (resource) {
    cached_meta_types[resource.id()] = m
  } else {
    cached_meta_types[type] = m
  }

  return m
}


function getScript(source, callback) {
    var script = document.createElement('script');
    var prior = document.getElementsByTagName('script')[0];
    script.async = 1;

    script.onload = script.onreadystatechange = function( _, isAbort ) {
        if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
            script.onload = script.onreadystatechange = null;
            script = undefined;

            if(!isAbort) { if(callback) callback(); }
        }
    };

    script.src = source;
    prior.parentNode.insertBefore(script, prior);
}

function importMeta (self, meta, done) {

  self.scopes = meta.scopes || {}
  self.info = meta.info || {}
  self.config = meta.config || {}

  // load plugins index.js file
  var plugins = meta.plugins || {}

  var pluginPromises = []
  for (let name in plugins) {
    let plugin = plugins[name]
    if (plugin.js_index) {
      pluginPromises.push(new Promise(function(resolve, reject) {
        getScript(EThing.config.serverUrl + '/api/plugin/' + name + '/index.js', () => {
          console.log('[meta] plugin ' + name + ' loaded')
          resolve()
        })
      }))
    }
  }

  self.plugins = plugins

  Promise.all(pluginPromises).then(() => {

    var serverDefinitions = meta.definitions

    // merge with locals
    walkThrough(serverDefinitions, self.definitions, (node, local, stop, path) => {
      if (typeof node['type'] !== 'undefined' || typeof node['allOf'] !== 'undefined') {
        node = mergeClass(node, local)
        stop()
      }
      return node
    })

    // resolve references
    walkThrough(serverDefinitions, (node, _, stop, path) => {
      if (typeof node['type'] !== 'undefined' || typeof node['allOf'] !== 'undefined') {
        node = resolve(node, serverDefinitions)
        stop()
      }
      return node
    })

    self.definitions = serverDefinitions

    extend(formSchemaCore.definitions, self.definitions)

    if (done)
      done(self)

  })

}

export default {
  install ({ EThingUI }) {
    Object.assign(EThingUI, {

      // contains some information about the server
      info: {},

      mergeClass,

      definitions: localDefinitions,

      // returns metadata of any type or resource
      get: function (type, raw) {
        return get (this.definitions, type, raw)
      },

      // extend the metadata of a given type
      extend: function (type, definition) {
        var obj = type
        if (typeof type === 'string') {
          obj = getFromPath(this.definitions, type, /[\.\/]/, true)
        }
        mergeClass(obj, definition)
      },

      // store informations about loaded plugins
      plugins: {},

      // list the available scopes (used in api key)
      scopes: {},

      loadMeta (done) {
        var self = this
        return new Promise(function(resolve, reject) {
          EThing.request({
            url: 'utils/definitions',
            dataType: 'json',
          }).then( (meta) => {
            console.log('[meta] ething meta loaded !')
            importMeta(self, meta, () => {
              if (done) {
                done()
              }

              resolve()
            })
          }).catch(err => {
            reject(err)
          })
        })
      },

    })
  }
}
