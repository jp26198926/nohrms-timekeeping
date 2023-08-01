<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md " style="max-width: 400px">
      <div class="text-h4  q-pb-md text-center">Terminal Location</div>
      <q-form
        @submit="saveData"
        class="q-gutter-md"
      >
        <q-select outlined v-model="location" :options="options" label="Select Location" />

        <div class="text-right">
          <q-btn to="/" label="Back to Home" color="primary" flat class="q-ml-sm" />
          <q-btn label="Save" type="submit" color="primary"/>
        </div>

      </q-form>

      </div>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const $q  = useQuasar();
    const api = ref(localStorage.getItem('timekeeper_server_api') || '');
    const location = ref(JSON.parse(localStorage.getItem('timekeeper_location')) || {});
    const options = ref([]);

    async function fetchDropdownData() {
      try {
        const response = await axios.get(api.value + '/api/get_all_locations');
        //const response = await axios.get('/api/get_all_locations');

        if (response.data.status === 'success') {
          options.value = response.data.data;
        }

      } catch (error) {
        showAlert('Error fetching data:', error);
      }
    }

    const saveData = () => {
      if (typeof Storage !== 'undefined') {
        localStorage.setItem('timekeeper_location', JSON.stringify(location.value));
        showAlert('Record saved!');
      } else {
        showAlert('Local storage is not supported!');
      }
    };

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

    onMounted(
      fetchDropdownData
    );

    return {
      location,
      options,
      saveData,
      showAlert
    };
  },
};
</script>
