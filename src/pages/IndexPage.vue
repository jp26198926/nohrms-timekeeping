<template>
  <q-page q-pt-md class="bg-blue-1">
    <div
      class="text-center q-py-md bg-white text-h3 font-bankgothic text-bolder"
    >
      {{ formattedDate }}
    </div>
    <div class="row">
      <div class="col-12 col-md-9 bg-blue-1">
        <div class="column">
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
                      autofocus
                      ref="myBarcode"
                      :disable="isBarcodeDisabled"
                    />
                  </div>

                  <div class="col q-px-md text-center gt-sm">
                    <q-img
                      :src="imageSrc"
                      alt="Employee Photo"
                      style="max-width: 250px; height: 240px"
                      fit="fill"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-8 flex items-center justify-center">
                <div class="column">
                  <q-btn
                    align="center"
                    class="btn-fixed-width"
                    color="warning"
                    label="Switch"
                    icon="format_size"
                    @click="switching()"
                  />
                  <div
                    class="col text-h2 text-center q-pa-md text-weight-bolder text-uppercase text-primary"
                  >
                    {{ type.label }}
                  </div>
                  <div
                    class="col text-h1 text-center q-pa-1 text-bold font-digital"
                  >
                    {{ formattedTime }}
                  </div>
                  <div
                    class="col text-h3 text-center q-pt-md text-red font-bankgothic"
                  >
                    {{ message }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col">
            <div class="text-h3 text-center">
              <q-input
                outlined
                v-model="employee.fullname"
                label="Name"
                readonly
                class="q-px-md q-py-sm"
              />
              <q-input
                outlined
                v-model="employee.department"
                label="Department"
                readonly
                class="q-px-md q-py-sm"
              />
              <q-input
                outlined
                v-model="employee.division"
                label="Division"
                readonly
                class="q-px-md q-py-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        class="col-12 gt-sm col-md-3 bg-yellow-3 text-center text-h4 font-bankgothic flex justify-center items-center q-px-sm"
      >
        <pre>{{ location.reminder }}</pre>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useQuasar, QSpinnerGears } from "quasar";
import { defineComponent, ref, onMounted, computed } from "vue";
import axios from "axios";
import defaultPhoto from "src/assets/user.png";
import { useIndexedDB } from "./../IndexedDBService.js";
import {
  speakText,
  playBeep,
  isStatusTriggered,
  isLocationTriggered,
} from "../composables/useSound.js";

export default defineComponent({
  name: "IndexPage",

  setup() {
    const $q = useQuasar();
    const message = ref("ID Not Found");
    const api = ref(localStorage.getItem("timekeeper_server_api") || "");
    const location = ref(
      JSON.parse(localStorage.getItem("timekeeper_location")) || {}
    );
    const type = ref(JSON.parse(localStorage.getItem("timekeeper_type")) || {});
    const currentDate = ref(new Date().toLocaleDateString("en-CA"));
    const currentDateTime = ref(getFormattedDateTime());

    const { saveData } = useIndexedDB("TimekeeperDB", 1, "faileddata");

    const employee = ref({});
    const emp_no = ref("");
    const imageSrc = ref(defaultPhoto);

    const soundStatuses = ref(
      JSON.parse(localStorage.getItem("timekeeper_triggered_statuses")) || []
    );
    const soundLocations = ref(
      JSON.parse(localStorage.getItem("timekeeper_triggered_locations")) || []
    );

    const formatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    const formattedDate = ref(
      new Intl.DateTimeFormat("en-US", formatOptions).format(new Date())
    );
    const formattedTime = ref(getFormattedTime());

    const setFocusOnInput = () => {
      myBarcode.value?.focus(); // Focus on the input field
    };

    const myBarcode = ref(null);
    const isBarcodeDisabled = ref(false);

    function getFormattedTime() {
      const currentTime = new Date();
      const hour = currentTime.getHours().toString().padStart(2, "0");
      const minute = currentTime.getMinutes().toString().padStart(2, "0");
      const second = currentTime.getSeconds().toString().padStart(2, "0");
      return `${hour}:${minute}:${second}`;
      //return currentTime.toLocaleTimeString('en-US');
    }

    // this will be sent to the server
    function getFormattedDateTime() {
      const currentTime = new Date();

      const year = currentTime.getFullYear();
      const month = String(currentTime.getMonth() + 1).padStart(2, "0");
      const day = String(currentTime.getDate()).padStart(2, "0");

      const hour = currentTime.getHours().toString().padStart(2, "0");
      const minute = currentTime.getMinutes().toString().padStart(2, "0");
      const second = currentTime.getSeconds().toString().padStart(2, "0");

      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    // Handle the keypress event
    function handleKeyPress(event) {
      if (event.keyCode == 13) {
        saveTime();
      }
    }

    // Handle Switching Time Type (In or Out)
    function switching() {
      if (type.value.value == 1) {
        type.value = { label: "Clock Out", value: 0 };
      } else {
        type.value = { label: "Clock In", value: 1 };
      }

      localStorage.setItem("timekeeper_type", JSON.stringify(type.value));
    }

    function showAlert(msg) {
      $q.dialog({
        title: `TK Terminal v${$version}`,
        message: msg,
      })
        .onOk(() => {
          // console.log('OK')
        })
        .onCancel(() => {
          // console.log('Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }

    async function saveTime() {
      const dataToSend = {
        emp_no: emp_no.value,
        location_id: location.value.value,
        dt: currentDate.value,
        emp_time: currentDateTime.value.replace(",", ""),
        stat: type.value.value,
      };

      isBarcodeDisabled.value = true;

      $q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: "white",
        messageColor: "white                           ",
        backgroundColor: "black",
        message: "Please wait...",
      });

      try {
        const response = await axios.post(
          api.value + "/api/timelog",
          JSON.stringify(dataToSend),
          { timeout: 500 }
        );

        if (response.data.status === "success") {
          employee.value = response.data.data;
          message.value = response.data.data.emp_no;

          await saveToFileSuccess(dataToSend);
        } else {
          employee.value = {
            fullname: "",
            department: "",
            division: "",
          };
          message.value = response.data.message;

          //check audio
          if (
            parseInt(response.data.data.emp_id) <= 0 ||
            isLocationTriggered(
              response.data.data.location_id,
              soundLocations.value
            ) ||
            isStatusTriggered(response.data.data.status_id, soundStatuses.value)
          ) {
            await playBeep(5);
            speakText(message.value);
          }

          //will record the error
          dataToSend.location_id = response.data.message;
          await saveToFileRejected(dataToSend);
        }

        emp_no.value = "";

        if (api.value && employee.value?.photo_filename) {
          imageSrc.value =
            api.value + "/upload/photo_emp/" + employee.value?.photo_filename;
        } else {
          imageSrc.value = defaultPhoto;
        }
      } catch (error) {
        console.log(error);
        message.value = emp_no.value + " Accepted";
        emp_no.value = "";
        employee.value = {
          fullname: "",
          department: "",
          division: "",
        };
        imageSrc.value = defaultPhoto;

        await saveToFileFailed(dataToSend);
        await saveToIndexedDB(dataToSend);
      }

      isBarcodeDisabled.value = false;

      $q.loading.hide();
    }

    const saveToIndexedDB = async (data) => {
      await saveData(data);
    };

    const saveToFileFailed = async (data) => {
      if (window.ipcRenderer) {
        const content = `${data.dt};${data.emp_time};${data.location_id};${data.stat};${data.emp_no}`;
        window.ipcRenderer?.send("saveToFileFailed", content);
      } else {
        console.warn("Not running in Electron mode, save to file skipped!");
      }
    };

    const saveToFileSuccess = async (data) => {
      if (window.ipcRenderer) {
        const content = `${data.dt};${data.emp_time};${data.location_id};${data.stat};${data.emp_no}`;
        window.ipcRenderer.send("saveToFileSuccess", content);
      } else {
        console.warn("Not running in Electron mode, save to file skipped!se");
      }
    };

    const saveToFileNotFound = async (data) => {
      if (window.ipcRenderer) {
        const content = `${data.dt};${data.emp_time};${data.location_id};${data.stat};${data.emp_no}`;
        window.ipcRenderer.send("saveToFileNotFound", content);
      } else {
        console.warn("Not running in Electron mode, save to file skipped!");
      }
    };

    const saveToFileRejected = async (data) => {
      if (window.ipcRenderer) {
        const content = `${data.dt};${data.emp_time};${data.location_id};${data.stat};${data.emp_no}`;
        window.ipcRenderer.send("saveToFileRejected", content);
      } else {
        console.warn("Not running in Electron mode, save to file skipped!");
      }
    };

    onMounted(() => {
      // Update the time every second

      setInterval(() => {
        currentDate.value = new Date().toLocaleDateString("en-CA");
        currentDateTime.value = getFormattedDateTime();
        formattedTime.value = getFormattedTime();
        formattedDate.value = new Intl.DateTimeFormat(
          "en-US",
          formatOptions
        ).format(new Date());
        setFocusOnInput();
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
      showAlert,
      myBarcode,
      switching,

      isBarcodeDisabled,
    };
  },
});
</script>
