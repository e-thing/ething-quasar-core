/*
<form-schema :schema="schema" v-model="model" @error="error = $event"/>
*/

import * as core from './core'
import FormSchema from './FormSchema.vue'

// builtins
import FormSchemaObject from './FormSchemaObject.vue'
//import FormSchemaArray from './FormSchemaArray.vue'
import FormSchemaArray from './FormSchemaArrayModal.vue'
import FormSchemaString from './FormSchemaString.vue'
import FormSchemaNumber from './FormSchemaNumber.vue'
import FormSchemaBoolean from './FormSchemaBoolean.vue'
import FormSchemaEnum from './FormSchemaEnum.vue'
import FormSchemaDate from './FormSchemaDate.vue'
import FormSchemaColor from './FormSchemaColor.vue'
import FormSchemaJson from './FormSchemaJson.vue'
import FormSchemaEditor from './FormSchemaEditor.vue'
import FormSchemaOptional from './FormSchemaOptional.vue'
import FormSchemaMultiType from './FormSchemaMultiType.vue'
import FormSchemaNumberSlider from './FormSchemaNumberSlider.vue'
import FormSchemaFile from './FormSchemaFile.vue'

// extras
import FormSchemaBluetoothInterface from './FormSchemaBluetoothInterface'
import FormSchemaCron from './FormSchemaCron'
import FormSchemaEthingResource from './FormSchemaEthingResource'
import FormSchemaHost from './FormSchemaHost'
import FormSchemaScope from './FormSchemaScope'
import FormSchemaSerialPort from './FormSchemaSerialPort'
import FormSchemaWeekCalendar from './FormSchemaWeekCalendar'
import FormSchemaScheduler from './FormSchemaScheduler'

export default {
  install ({ EThingUI, Vue }) {

    EThingUI.form = core

    Vue.component('FormSchema', FormSchema)

    Vue.component('FormSchemaObject', FormSchemaObject)
    Vue.component('FormSchemaArray', FormSchemaArray)
    Vue.component('FormSchemaString', FormSchemaString)
    Vue.component('FormSchemaNumber', FormSchemaNumber)
    Vue.component('FormSchemaBoolean', FormSchemaBoolean)
    Vue.component('FormSchemaEnum', FormSchemaEnum)
    Vue.component('FormSchemaDate', FormSchemaDate)
    Vue.component('FormSchemaColor', FormSchemaColor)
    Vue.component('FormSchemaJson', FormSchemaJson)
    Vue.component('FormSchemaEditor', FormSchemaEditor)
    Vue.component('FormSchemaOptional', FormSchemaOptional)
    Vue.component('FormSchemaMultiType', FormSchemaMultiType)
    Vue.component('FormSchemaNumberSlider', FormSchemaNumberSlider)
    Vue.component('FormSchemaFile', FormSchemaFile)

    Vue.config.optionMergeStrategies.validations = Vue.config.optionMergeStrategies.data

  }
}
