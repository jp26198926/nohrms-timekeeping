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
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const location = ref(JSON.parse(localStorage.getItem('timekeeper_location')) || {});

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

    return {
      location,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
