<template>
  <q-page q-pt-md class="bg-blue-1">
    <div class="text-center q-py-md bg-white text-h3 font-bankgothic text-bolder"  >
      {{ formattedDate }}
    </div>
    <div class="row">
      <div class="col-12 col-md-9 bg-blue-1">

        <div class="column" >

          <div class="col">

            <div class="row">
              <div class="col-12 col-md-4">
                <div class="column">
                  <div class="col">
                    <q-input
                      outlined
                      v-model="emp_no"
                      label="Barcode"
                      @keydown="handleKeyPress"
                      class="q-pa-md"
                    />
                  </div>

                  <div class="col q-px-md text-center gt-sm">
                    <q-img
                      :src = "imageSrc"
                      alt = "Employee Photo"
                      style="max-width: 250px; height: 240px;"
                      fit="fill"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-8 flex items-center justify-center">
                <div class="column">
                  <div class="col text-h2 text-center q-pa-md text-weight-bolder text-uppercase text-primary "   >
                    {{ type.label }}
                  </div>
                  <div class="col text-h1 text-center q-pa-1 text-bold font-digital"   >
                    {{ formattedTime }}
                  </div>
                  <div class="col text-h3 text-center q-pt-md text-red font-bankgothic"   >
                    {{ message }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col">
            <div class="text-h3 text-center"   >
              <q-input outlined v-model="employee.fullname" label="Name"   readonly class="q-px-md q-py-sm" />
              <q-input outlined v-model="employee.department" label="Department"  readonly class="q-px-md q-py-sm"  />
              <q-input outlined v-model="employee.division" label="Division"  readonly class="q-px-md q-py-sm"  />
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 gt-sm col-md-3 bg-yellow-3 text-center text-h4 font-bankgothic flex justify-center items-center q-px-sm">
        <pre>{{ location.reminder }}</pre>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed} from 'vue'
import axios from 'axios';
import defaultPhoto from 'src/assets/user.png'

export default defineComponent({
  name: 'IndexPage',

  setup () {
    const message = ref('ID Not Found');
    const api = ref(localStorage.getItem('timekeeper_server_api') || '');
    const location = ref(JSON.parse(localStorage.getItem('timekeeper_location')) || {});
    const type = ref(JSON.parse(localStorage.getItem('timekeeper_type')) || {});
    const currentDate = ref(new Date().toLocaleDateString('en-CA'));
    const currentDateTime = ref(new Date().toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }));

    const employee = ref({});
    const emp_no = ref('');
    const imageSrc = ref(defaultPhoto);

    const formatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };

    const formattedDate = ref(new Intl.DateTimeFormat('en-US', formatOptions).format(new Date()));
    const formattedTime = ref(getFormattedTime());

    function getFormattedTime() {
      const currentTime = new Date();
      const hour = currentTime.getHours().toString().padStart(2, '0');
      const minute = currentTime.getMinutes().toString().padStart(2, '0');
      const second = currentTime.getSeconds().toString().padStart(2, '0');
      return `${hour}:${minute}:${second}`;
      //return currentTime.toLocaleTimeString('en-US');
    }

    // Handle the keypress event
    function handleKeyPress(event) {
      if (event.keyCode == 13) {
        saveTime();
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

    async function saveTime() {
      try {
        const dataToSend = {
          emp_no: emp_no.value,
          location_id: location.value.value,
          dt: currentDate.value,
          emp_time: currentDateTime.value,
          stat: type.value.value
        }

        const response = await axios.post(api.value + '/api/timelog', JSON.stringify(dataToSend));
        //const response = await axios.post('/api/timelog', JSON.stringify(dataToSend));

        if (response.data.status === "success"){
          employee.value = response.data.data;
          message.value = response.data.data.emp_no;
        }else{
          employee.value = {
            fullname:"",
            department:"",
            division:""
          }
          message.value = response.data.message;
        }

        emp_no.value = "";

        if (api.value && employee.value?.photo_filename){
          imageSrc.value = api.value + '/upload/photo_emp/' + employee.value?.photo_filename;
        }else{
          imageSrc.value = defaultPhoto;
        }

      } catch (error) {
        message.value = 'Error fetching data';
        emp_no.value = "";
        imageSrc.value = defaultPhoto;
      }
    }

    onMounted(() => {
      // Update the time every second
      setInterval(() => {
        formattedTime.value = getFormattedTime();
      }, 1000);
    });

    return {
      currentDate,
      currentDateTime,
      formattedDate,
      formattedTime,
      type,
      message,
      emp_no,
      employee,
      handleKeyPress,
      location,
      imageSrc,
      showAlert
    }
  }
})
</script>
