<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md " style="max-width: 400px">
      <div class="text-h4  q-pb-md text-center">Terminal Type</div>
      <q-form
        @submit="saveData"
        class="q-gutter-md"
      >
        <q-select outlined v-model="type" :options="options" label="Select Type" />

        <div class="text-right">
          <q-btn to="/" label="Back to Home" color="primary" flat class="q-ml-sm" />
          <q-btn label="Save" type="submit" color="primary"/>
        </div>

      </q-form>

      </div>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

export default {
  setup () {
    const $q = useQuasar()
    const type = ref(JSON.parse(localStorage.getItem('timekeeper_type')) || {})
    const options = [
        {
          label: 'Clock In',
          value: '1'
        },
        {
          label: 'Clock Out',
          value: '0'
        }
    ]

    const saveData = () => {
      if (typeof Storage !== 'undefined') {
        localStorage.setItem('timekeeper_type', JSON.stringify(type.value))
        showAlert('Record saved!')
      }else{
        showAlert('Local storage is not supported!')
      }
    }

    function showAlert (msg) {
      $q.dialog({
        title: 'TK Terminal v2.0',
        message: msg
      }).onOk(() => {
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }


    return {
      type,
      options,
      saveData,
      showAlert

    }
  }
}
</script>
