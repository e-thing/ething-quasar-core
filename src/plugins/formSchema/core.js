import { required } from 'vuelidate/lib/validators'
import { extend } from 'quasar'
import FormSchemaLayout from './FormSchemaLayout'
import Vue from './vue'
//import { required } from './validators'

//const customRequired = (v) => v !== undefined && v !== null


/*
options:
$widget: string
$inline: boolean | 'inherit'
*/


var debug = false

var _definitionsHandlers = []

var _registeredForms = []

var registerForm = function (component, test) {

  _registeredForms.push({
    component,
    test: test || component.rule,
    name: component.name ? formatWidgetName(component.name) : ''
  })

}

var unregisterForm = function (component) {
  const index = _registeredForms.findIndex(item => {
    return item.component === component
  })
  if (index !== -1)
    _registeredForms.splice(index, 1)
}

function clone(obj) {
    if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
        return obj;

    if (obj instanceof Date)
        var temp = new obj.constructor(); //or new Date(obj);
    else
        var temp = obj.constructor();

    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj['isActiveClone'] = null;
            temp[key] = clone(obj[key]);
            delete obj['isActiveClone'];
        }
    }
    return temp;
}

function formatWidgetName(name) {
  return name.replace(/[_\.\-]/, '').toLowerCase().replace(/^formschema/, '')
}

var resolveRef = function (schema) {
  if (typeof schema['$ref'] === 'string') {
    var copySchema = Object.assign({}, schema)
    delete copySchema['$ref']
    var ref = schema['$ref']
    var resolvedSchema = null
    for (var i in _definitionsHandlers) {
      resolvedSchema = _definitionsHandlers[i](ref)
      if (typeof resolvedSchema === 'object' && resolvedSchema!==null) break
    }
    schema = resolve(extend(true, copySchema, resolvedSchema))
  }

  return schema
}

var resolveAllOf = function (schema) {
  if (Array.isArray(schema.allOf)) {
    var mergedSchema = Object.assign({}, schema)
    delete mergedSchema.allOf
    schema.allOf.forEach(s => {
      mergedSchema = extend(true, mergedSchema, resolve(s))
    })
    schema = mergedSchema
  }
  return schema
}

var resolve = function (schema) {
  return resolveAllOf(resolveRef(schema))
}

var makeForm = function (createElement, props, on) {

  var schema = props.schema = resolve(props.schema)

  //console.log('SCHEMA', JSON.stringify(schema, null, 2))
  //console.log('MODEL', JSON.stringify(props.value, null, 2))

  var attributes = {
    props,
    on
  }

  var widgetName = schema['$widget']
  if (widgetName) {
    var formattedWidgetName = formatWidgetName(widgetName)
    // registered components
    for (let i in _registeredForms) {
      let item = _registeredForms[i]
      if (item.name && item.name == formattedWidgetName) {
        return createElement(item.component, attributes)
      }
    }
    // core components
    for (var name in Vue.options.components) {
      if (formattedWidgetName == formatWidgetName(name)) {
        return createElement(name, attributes)
      }
    }
    console.warn('[form] widget not found: ' + widgetName)
  }

  var type = schema.type

  if (Array.isArray(schema.anyOf)) {
    var nullItems = schema.anyOf.filter(item => item.type === 'null')
    if (nullItems.length > 0 && nullItems.length < schema.anyOf.length) {
      return createElement('form-schema-optional', attributes)
    }
    // todo: form-schema-anyof
  }

  for (let i in _registeredForms) {
    let item = _registeredForms[i]
    if (item.test) {
      let result = item.test(schema)
      if (result) {
        return createElement(item.component, attributes)
      }
    }
  }

  if (Array.isArray(schema.enum)) {
    return createElement('form-schema-enum', attributes)
  }

  if (Array.isArray(schema.oneOf)) {
    var pass=true
    schema.oneOf.forEach(s => {
      if (!(s.properties && s.properties.type && s.properties.type.const)) pass=false
    })
    if (pass) return createElement('form-schema-oneof', attributes)
  }

  switch (type) {
    case 'object':
    case 'class':
      return createElement('form-schema-object', attributes)
    case 'array':
      if ((typeof schema.items === 'object' && schema.items!== null) || typeof schema.items === 'undefined') {
        return createElement(schema['$modal'] ? 'form-schema-array-modal' : 'form-schema-array', attributes)
      }
      if (Array.isArray(schema.items)) {
        // todo tupple https://spacetelescope.github.io/understanding-json-schema/reference/array.html
      }
      break
    case 'string':
      var format = schema.format

      if (format === 'date-time' || format === 'date' || format === 'time') {
        return createElement('form-schema-date', attributes)
      }
      else if (format === 'color') {
        return createElement('form-schema-color', attributes)
      }
      else if (format === 'json') {
        return createElement('form-schema-json', attributes)
      }
      else if (/[^\/]+\/[^\/]+/.test(format)) {
        // mime types
        return createElement('form-schema-editor', attributes)
      }

      return createElement('form-schema-string', attributes)
    case 'number':
    case 'integer':
    case 'int':
    case 'long':
    case 'double':
    case 'float':
      if (typeof schema.minimum === 'number' && typeof schema.maximum === 'number' && typeof schema.multipleOf === 'number') {
        return createElement('form-schema-number-slider', attributes)
      }
      return createElement('form-schema-number', attributes)
    case 'boolean':
    case 'bool':
      return createElement('form-schema-boolean', attributes)
    case 'json':
      return createElement('form-schema-json', attributes)
    case 'binary':
      return createElement('form-schema-file', attributes)

  }

  if (typeof type === 'undefined') {
    return createElement('form-schema-multi-type', attributes)
  }

  console.error('unable to render the schema', schema)
}

var FormComponent = {

  components: {
    FormSchemaLayout
  },

  props: {
    inline: {
      default: "inherit"
    },
    value: {},
    schema: {},
    required: {
      type: Boolean,
      default: false
    },
    level: {
      type: Number,
      default: 0
    },
  },

  data () {
    return {
      id: this.schema.id || (this.schema.type + '-' + parseInt(Math.random()*10000)),
    	c_schema: null,
      formSchemaNode: true,
      //formSchemaDirty: 0,
      formSchemaCache: undefined
    }
	},

  watch:{
    schema : {
      handler (value, oldValue) { // deep watch ?
        if (debug) this.log('watch schema', clone(value))
        this.c_schema = extend(true, {}, value) // do not alter the parent schema
      },
      immediate: true,
      deep: true
    },
    value : {
      handler(value, oldValue) {
        if (debug) this.log('watch value')
        if (typeof this.formSchemaCache !== 'undefined') {
          //this.formSchemaDirty--;
          this.formSchemaCache = undefined
          if (debug) this.log('clear cache')
        }
      },
      immediate: true
    },
    c_value : {
      handler(value, oldValue) {
        if (debug) this.log('watch c_value', clone(value), 'prev', clone(oldValue))
        /*if (typeof value === 'undefined' && typeof this.c_schema.default !== 'undefined') {
          this.$nextTick(() => { // delay or some bugs may arrise
            if (debug) this.log('set default from watch', this.c_schema.default)
            this.c_value = this.c_schema.default
          })
        } else {*/
          this.$v.c_value.$touch()
        //}
      },
      immediate: true
    },
    /*'$v.$error' : {
      handler (value, oldValue) {
        if (value !== oldValue)
          this.$emit('error', value)
      },
      immediate: true
    },*/
    error : {
      handler (value, oldValue) {
        if (debug) this.log('watch error', clone(value), 'prev', clone(oldValue))
        this.$emit('error', value)
      },
      immediate: true
    }
  },

  computed: {

    inlined () {
      var v = this.inline
      if (v==='') v = true // prop without value : <... inline />
      if (typeof this.schema['$inline'] !== 'undefined')
        v = typeof this.schema['$inline']
      if (v==='inherit') {
        var parent = this.parent()
        return parent ? parent.inlined : false
      }

      return !!v
    },

    /*c_schema () {
      return extend(true, {}, this.schema)
    },*/

  	c_value: {
    	get(){
        //if (this.formSchemaDirty>0) {
        if (typeof this.formSchemaCache !== 'undefined') {
          if (debug) this.log('c_value.get (cache)', clone(this.formSchemaCache))
          return this.formSchemaCache
        }
        if (debug) this.log('c_value.get', clone(this.value))
        if (typeof this.value !== 'undefined')
          return this.cast(this.value)
        return this.value // undefined
      },
      set(val){
        if (debug) this.log('c_value.set', clone(val))
        //this.formSchemaDirty++;
        this.formSchemaCache = val;
        this.$emit('input', val)
      },
      cache: true
    },
    error () {
      if (debug) this.log('compute error', this.$v.c_value.$error)
      if (!this.$v.c_value.$error) return false

      if (typeof this.$v.c_value.required != 'undefined' && !this.$v.c_value.required) {
        return 'Field is required'
      }
      if (typeof this.$v.c_value.minLength != 'undefined' && !this.$v.c_value.minLength) {
        return 'must have minimum ' + this.$v.c_value.$params.minLength.min + ' characters'
      }
      if (typeof this.$v.c_value.maxLength != 'undefined' && !this.$v.c_value.maxLength) {
        return 'must have maximum ' + this.$v.c_value.$params.maxLength.max + ' characters'
      }
      if (typeof this.$v.c_value.minValue != 'undefined' && !this.$v.c_value.minValue) {
        return 'must be greater than or equal to ' + this.$v.c_value.$params.minValue.min
      }
      if (typeof this.$v.c_value.maxValue != 'undefined' && !this.$v.c_value.maxValue) {
        return 'must be lower than or equal to ' + this.$v.c_value.$params.maxValue.max
      }
      if (typeof this.$v.c_value.between != 'undefined' && !this.$v.c_value.between) {
        return 'must be between ' + this.$v.c_value.$params.between.min + ' and ' + this.$v.c_value.$params.between.max
      }
      if (typeof this.$v.c_value.alpha != 'undefined' && !this.$v.c_value.alpha) {
        return 'Accepts only alphabet characters'
      }
      if (typeof this.$v.c_value.alphaNum != 'undefined' && !this.$v.c_value.alphaNum) {
        return 'Accepts only alphanumerics'
      }
      if (typeof this.$v.c_value.numeric != 'undefined' && !this.$v.c_value.numeric) {
        return 'Accepts only numerics'
      }
      if (typeof this.$v.c_value.email != 'undefined' && !this.$v.c_value.email) {
        return 'Accepts only valid email addresses'
      }
      if (typeof this.$v.c_value.ipAddress != 'undefined' && !this.$v.c_value.ipAddress) {
        return 'Accepts only valid IPv4 addresses in dotted decimal notation like 127.0.0.1'
      }
      if (typeof this.$v.c_value.macAddress != 'undefined' && !this.$v.c_value.macAddress) {
        return 'Accepts only valid MAC addresses like 00:ff:11:22:33:44:55'
      }
      if (typeof this.$v.c_value.url != 'undefined' && !this.$v.c_value.url) {
        return 'Accepts only URLs'
      }
      if (typeof this.$v.c_value.regex != 'undefined' && !this.$v.c_value.regex) {
        return 'Does not match the pattern `' + this.$v.c_value.$params.regex.pattern + '`'
      }

      return 'Invalid value'
    }
  },

  methods: {
  	cast (val) {
    	return val
    },
    getDefault () {},
    log () {
      var args = Array.prototype.slice.call(arguments)
      args.unshift('['+this.id+']')
      console.log.apply(console, args)
    },
    // search
    parent () {
      var p = this.$parent
      while (p && (!p.formSchemaNode)) {
        p = p.$parent
      }
      return p
    },
    root () {
      var root;
      var p = this
      while (p) {
        root = p
        p = p.parent()
      }
      return root
    },
    children () {
      return this._children(this)
    },
    _children (node) {
      var ret = []

      for (var i in node.$children) {
        let c = node.$children[i]
        if (c.formSchemaNode) {
          ret.push(c)
        } else {
          ret = ret.concat(this._children(c))
        }
      }

      return ret
    },
    find (id) {
      // find the closest node with the given id (necessary because multiple schema may have the same id (ie: array items))

      // 1 - find under this node
      var n = this._find_down(this, id)
      if (n) return n

      // 2 - iterate through the parent and the siblings
      return this._find_up(this, id)
    },

    _find_up (node, id) {
      // 1 - the parent ?
      var p = node.parent()
      if (!p) return // no need to go any further
      if (p._is(id)) return p
      // 2 - find amongs the siblings
      var children = p.children()
      for (var i in children) {
        var child = children[i]
        if (child !== node){
          var n = this._find_down(child, id)
          if (n) return n
        }
      }

      // go one level upper
      return this._find_up(p, id)
    },

    _find_down (node, id) {
      if (node._is(id)) {
        return node
      }
      var children = node.children()
      for (let i in children) {
        var n = this._find_down(children[i], id)
        if (n)
          return n
      }
    },
    _is (id) {
      return this.schema.id === id
    }
  },

  validations () {
    if (debug) this.log('validations', this.required)
    return {
      c_value: this.required ? { required: required } : {}
    }
  },

  mounted () {
    if (debug) this.log('mounting component')

    var skipTouch = false

    if (typeof this.c_value === 'undefined') {
      var def = undefined;
      if (typeof this.c_schema.default !== 'undefined') {
        def = this.c_schema.default
      } else {
        def = this.getDefault()
      }
      if (typeof def !== 'undefined') {
        skipTouch = true
        this.$nextTick(() => { // delay or some bugs may arrise
          if (debug) this.log('set default on mounted', def)
          this.c_value = def
          // this.$v.c_value.$touch() will be triggered when setting c_value
        })
      }
    }

    if (!skipTouch) {
      this.$v.c_value.$touch()
    }

    // handle dependencies
    if (this.c_schema.dependencies) {

      for (let id in this.c_schema.dependencies) {
        let callback = this.c_schema.dependencies[id]
        let node = this.find(id)
        if (debug) this.log('find node', id)
        if (node && callback) {
          node.$on('input', val => {
            this.$nextTick(() => { // delay or some bugs may arrise
              callback.call(this, val, this, node)
            })
          })
          callback.call(this, node.c_value, this, node)
        } else {
          if (!node) {
            console.warn('[form-schema] node with id ""' + id + '" not found for ' + this.$options.name)
          }
        }
      }

    }

    /*setTimeout(() => {
    	this.c_schema.description = 'world'
    }, 2000)*/
	}
}


function addDefinitionsHandler (handler) {
  _definitionsHandlers.push(handler)
}


export {
  makeForm,
  FormComponent,
  registerForm,
  unregisterForm,
  addDefinitionsHandler,
  resolve
}
