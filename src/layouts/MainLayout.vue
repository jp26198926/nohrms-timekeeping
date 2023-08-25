<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Barcode Terminal v2
        </q-toolbar-title>

        <div>{{ location.label }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer dense bordered class="bg-white text-primary">
      <q-toolbar dense>
        <q-toolbar-title dense>Offline Data: {{ totalOfflineData }} records</q-toolbar-title>
        <q-toolbar-title dense class="text-center"> {{ currentDate }} </q-toolbar-title>
        <q-toolbar-title desnse class="text-right"> {{ currentDateTime }} </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted} from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useQuasar } from 'quasar'
import axios from 'axios';
import { useIndexedDB } from './../IndexedDBService.js'

const linksList = [
  {
    title: 'Home',
    caption: 'Show Main Page',
    icon: 'home',
    link: '/'
  },
  {
    title: 'Server',
    caption: 'Select a Server',
    icon: 'public',
    link: '/server'
  },
  {
    title: 'Location',
    caption: 'Set Location',
    icon: 'directions',
    link: '/location'
  },
  {
    title: 'Type',
    caption: 'For In or Out',
    icon: 'login',
    link: '/type'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const $q = useQuasar()

    const totalOfflineData = ref(0);
    const api = ref(localStorage.getItem('timekeeper_server_api') || '');
    const location = ref(JSON.parse($q.localStorage.getItem('timekeeper_location')) || {});

    const currentDate = ref(new Date().toLocaleDateString('en-CA'));
    const currentDateTime = ref(getFormattedDateTime());

    const { deleteDataById, getAllData } = useIndexedDB('TimekeeperDB', 1, 'faileddata');

    function getFormattedDateTime() {
      const currentTime = new Date();

      const year = currentTime.getFullYear();
      const month = String(currentTime.getMonth() + 1).padStart(2, '0');
      const day = String(currentTime.getDate()).padStart(2, '0');

      const hour = currentTime.getHours().toString().padStart(2, '0');
      const minute = currentTime.getMinutes().toString().padStart(2, '0');
      const second = currentTime.getSeconds().toString().padStart(2, '0');

      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    async function checkOfflineData() {

      try{
        const allRecords = await getAllData();
        totalOfflineData.value = allRecords.length;

        if (allRecords.length > 0) {
          for (const record of allRecords) {
            try {
              const response = await sendDataToAPI(record);

              if (response.data.status === "success"){
                await deleteDataById(record.id);
              }

            } catch (error) {
              console.error(error.message);
            }
          }
        }
      }catch(error){
        console.error(error.message);
      }

    }

    async function sendDataToAPI(record) {
      const apiUrl = api.value + '/api/timelog';
      return await axios.post(apiUrl, JSON.stringify(record));
    }

    onMounted(() => {
      setInterval(() => {
        checkOfflineData()
      }, 5000);

      setInterval(() => {
        currentDate.value = new Date().toLocaleDateString('en-CA');
        currentDateTime.value = getFormattedDateTime();
      }, 1000);
    });

    return {
      location,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      totalOfflineData,
      currentDate,
      currentDateTime
    }
  }
})
</script>
