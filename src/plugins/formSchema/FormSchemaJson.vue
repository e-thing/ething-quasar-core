<template>
  <form-schema-layout class="form-schema-json">
    <codemirror ref='cm' v-bind:value="formattedModel" :options="cmOption" v-on:input="formattedModel = $event"></codemirror>
  </form-schema-layout>
</template>

<script>

import { FormComponent } from './core'

import { codemirror, CodeMirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'

import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/edit/closebrackets.js'

import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold.js'

import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/lint.css'

import jsonlint from 'jsonlint-mod'

CodeMirror.registerHelper("lint", "json", function(text) {
  var found = [];
  var _jsonlint = jsonlint.parser;
  _jsonlint.parseError = function(str, hash) {
    var loc = hash.loc;
    found.push({from: CodeMirror.Pos(loc.first_line - 1, loc.first_column),
                to: CodeMirror.Pos(loc.last_line - 1, loc.last_column),
                message: str});
  };
  try { _jsonlint.parse(text); }
  catch(e) {}
  return found;
});

export default {
  name: 'FormSchemaJson',

  mixins: [FormComponent],

  components: {
    codemirror
  },

  computed: {

    formattedModel: {
      get () {
        return this.c_schema.type === 'string' ? this.c_value : JSON.stringify(this.c_value, null, 4)
      },
      set (val) {
        if (this.c_schema.type !== 'string') {
          try {
            val = JSON.parse(val)
          } catch (e) {
            val = undefined
          }
        }

        this.c_value = val
      }
    }
  },

  data () {
    return {
      cmOption: {
        mode: 'application/json',
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: false,
        foldGutter: true,
        styleSelectedText: true,
        lint: true,
				gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
				matchBrackets: true,
				autoCloseBrackets: true,
				foldGutter: true,
        showCursorWhenSelecting: true,
        extraKeys: {
          "Ctrl": "autocomplete",
        },
        hintOptions:{
          completeSingle: false
        },
        viewportMargin: Infinity
      },
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
