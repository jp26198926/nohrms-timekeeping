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

    <q-footer bordered class="bg-white text-primary">
      <q-toolbar>
        <q-toolbar-title>Offline Data: {{ totalOfflineData }} records</q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted} from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useQuasar } from 'quasar'
import { openDB } from 'idb'
import axios from 'axios';

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

    async function checkOfflineData() {
      const db = await openDB('TimekeeperDB', 1);
      const transaction = db.transaction('failed-data', 'readwrite');
      const dataStore = transaction.objectStore('failed-data');

      const allRecords = await dataStore.getAll();
      totalOfflineData.value = allRecords.length;

      if (allRecords.length > 0) {
        for (const record of allRecords) {
          try {
            await sendDataToAPI(record);
            await deleteRecordFromIndexedDB(db, 'failed-data', record.id);
          } catch (error) {
            console.error('Error sending data:', error);
          }
        }
      }
    }

    async function sendDataToAPI(record) {
      const apiUrl = api.value + '/api/timelog';
      await axios.post(apiUrl, JSON.stringify(record));
    }

    async function deleteRecordFromIndexedDB(db, storeName, recordId) {
      const transaction = db.transaction(storeName, 'readwrite');
      const dataStore = transaction.objectStore(storeName);

      dataStore.delete(recordId);

      return await new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(new Error('Error deleting record from IndexedDB'));
      });
    }



    onMounted(() => {
      setInterval(() => {
        checkOfflineData()
      }, 2000);
    });

    return {
      location,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      totalOfflineData
    }
  }
})
</script>
