<template>
  <q-page class="q-pa-md">
    <q-layout>
      <q-page-container>
        <q-page class="row q-col-gutter-md">
          <!-- Column 1 -->
          <div class="col-12 col-md-6">
            <q-card class="q-pa-md">
              <q-card-section>
                <div class="text-h6">Sound on Status</div>
                <p>Play sound if the status match on the table</p>
              </q-card-section>

              <q-card-section>
                <div>
                  <!-- Dropdown -->
                  <q-select
                    v-model="selectedItem"
                    :options="options"
                    label="Select a status"
                    outlined
                  />

                  <!-- Save Button -->
                  <div class="text-right">
                    <q-btn
                      to="/"
                      label="Back to Home"
                      color="primary"
                      flat
                      class="q-mt-md"
                    />
                    <q-btn
                      label="Save"
                      color="primary"
                      @click="addTriggeredStatus"
                      class="q-mt-md"
                    />
                  </div>

                  <!-- Table to display saved items -->
                  <q-table
                    v-if="triggeredStatuses.length > 0"
                    :rows="triggeredStatuses"
                    :columns="columns"
                    row-key="id"
                    class="q-mt-lg"
                  >
                    <template v-slot:body-cell-actions="props">
                      <q-td>
                        <q-btn
                          color="red"
                          icon="delete"
                          @click="removeTriggeredStatus(props.row.id)"
                        />
                      </q-td>
                    </template>
                  </q-table>

                  <!-- Fallback when no items are added -->
                  <div v-else class="q-mt-md text-grey">No items saved.</div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Column 2 -->
          <div class="col-12 col-md-6">
            <q-card class="q-pa-md">
              <q-card-section>
                <div class="text-h6">Sound on Location</div>
                <p>Play sound if the location match on the table</p>
              </q-card-section>

              <q-card-section>
                <div>
                  <!-- Dropdown -->
                  <q-select
                    v-model="locationSelectedItem"
                    :options="locationOptions"
                    label="Select a location"
                    outlined
                  />

                  <!-- Save Button -->
                  <div class="text-right">
                    <q-btn
                      to="/"
                      label="Back to Home"
                      color="primary"
                      flat
                      class="q-mt-md"
                    />
                    <q-btn
                      label="Save"
                      color="primary"
                      @click="addTriggeredLocation"
                      class="q-mt-md"
                    />
                  </div>

                  <!-- Table to display saved items -->
                  <q-table
                    v-if="locationTriggered.length > 0"
                    :rows="locationTriggered"
                    :columns="locationColumns"
                    row-key="id"
                    class="q-mt-lg"
                  >
                    <template v-slot:body-cell-actions="props">
                      <q-td>
                        <q-btn
                          color="red"
                          icon="delete"
                          @click="removeTriggeredLocation(props.row.id)"
                        />
                      </q-td>
                    </template>
                  </q-table>

                  <!-- Fallback when no items are added -->
                  <div v-else class="q-mt-md text-grey">No items saved.</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const $q = useQuasar();
    const api = ref(localStorage.getItem("timekeeper_server_api") || "");
    const options = ref([]);
    const columns = ref([
      { name: "item", label: "Status", align: "left", field: "item" },
      { name: "actions", label: "Actions", align: "right" },
    ]);
    const selectedItem = ref(null);
    const triggeredStatuses = ref(
      JSON.parse(localStorage.getItem("timekeeper_triggered_statuses")) || []
    );

    const locationOptions = ref([]);
    const locationColumns = ref([
      { name: "item", label: "Location", align: "left", field: "item" },
      { name: "actions", label: "Actions", align: "right" },
    ]);
    const locationSelectedItem = ref(null);
    const locationTriggered = ref(
      JSON.parse(localStorage.getItem("timekeeper_triggered_locations")) || []
    );

    //start of status
    function updateLocalStorage() {
      const convertTriggeredStatuses = JSON.stringify(triggeredStatuses.value);

      localStorage.setItem(
        "timekeeper_triggered_statuses",
        convertTriggeredStatuses
      );
    }

    async function fetchDropdownData() {
      try {
        const response = await axios.get(
          api.value + "/api/get_employee_statuses"
        );

        if (response.data.status === "success") {
          options.value = response.data.data;
        }
      } catch (error) {
        showAlert("Error fetching data:", error);
      }
    }

    function showAlert(msg) {
      $q.dialog({
        title: "TK Terminal v2.0",
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

    function addTriggeredStatus() {
      if (selectedItem.value) {
        //check if already exist
        const isExist = triggeredStatuses.value.find(
          (status) => status.id == selectedItem.value.value
        );

        if (isExist) {
          showAlert("Selected status already exist!");
          return;
        }

        //else add to the list
        const newItem = {
          id: selectedItem.value.value,
          item: selectedItem.value.label,
        };

        triggeredStatuses.value.push(newItem);

        updateLocalStorage();
      } else {
        showAlert("Please select a status!");
      }
    }

    function removeTriggeredStatus(id) {
      triggeredStatuses.value = triggeredStatuses.value.filter(
        (status) => status.id !== id
      );

      updateLocalStorage();
    }
    //end of status

    //start of locations
    function updateLocalStorageLocation() {
      const convertLocationTriggered = JSON.stringify(locationTriggered.value);

      localStorage.setItem(
        "timekeeper_triggered_locations",
        convertLocationTriggered
      );
    }

    async function fetchDropdownLocation() {
      try {
        const response = await axios.get(
          api.value + "/api/get_every_locations"
        );

        if (response.data.status === "success") {
          locationOptions.value = response.data.data;
        }
      } catch (error) {
        showAlert("Error fetching data:", error);
      }
    }

    function addTriggeredLocation() {
      if (locationSelectedItem.value) {
        //check if already exist
        const isExist = locationTriggered.value.find(
          (location) => location.id == locationSelectedItem.value.value
        );

        if (isExist) {
          showAlert("Selected location already exist!");
          return;
        }

        //else add to the list
        const newItem = {
          id: locationSelectedItem.value.value,
          item: locationSelectedItem.value.label,
        };

        locationTriggered.value.push(newItem);

        updateLocalStorageLocation();
      } else {
        showAlert("Please select a location!");
      }
    }

    function removeTriggeredLocation(id) {
      locationTriggered.value = locationTriggered.value.filter(
        (location) => location.id !== id
      );

      updateLocalStorageLocation();
    }

    //end of locations

    onMounted(() => {
      fetchDropdownData(), fetchDropdownLocation();
    });

    return {
      options,
      columns,
      triggeredStatuses,
      selectedItem,
      addTriggeredStatus,
      removeTriggeredStatus,
      showAlert,

      locationOptions,
      locationColumns,
      locationTriggered,
      locationSelectedItem,
      addTriggeredLocation,
      removeTriggeredLocation,
    };
  },
  // data() {
  //   return {
  //     selectedItem: null,
  //     options: [
  //       { label: "Option 1", value: "Option 1" },
  //       { label: "Option 2", value: "Option 2" },
  //       { label: "Option 3", value: "Option 3" },
  //     ],
  //     savedItems: [],
  //     columns: [
  //       { name: "item", label: "Item", align: "left", field: "item" },
  //       { name: "actions", label: "Actions", align: "right" },
  //     ],
  //   };
  // },
  // methods: {
  //   addItem() {
  //     if (this.selectedItem) {
  //       const newItem = {
  //         id: Date.now(), // Unique ID for each item
  //         item: this.selectedItem.label,
  //       };
  //       console.log(newItem);
  //       this.savedItems.push(newItem);
  //       this.selectedItem = null; // Reset dropdown
  //     }
  //   },
  //   removeItem(id) {
  //     this.savedItems = this.savedItems.filter((item) => item.id !== id);
  //   },
  // },
};
</script>

<style scoped>
/* Add any styles you need here */
</style>
