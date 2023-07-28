<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
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
          Timekeeping Terminal
        </q-toolbar-title>

        <div>Version {{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
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

const linksList = [
  {
    title: 'Home',
    caption: 'Show Main Page',
    icon: 'home',
    link: 'https://quasar.dev'
  },
  {
    title: 'Server',
    caption: 'Select a Server',
    icon: 'public',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Location',
    caption: 'Set Location',
    icon: 'directions',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Clock-In',
    caption: 'Use as Clock In',
    icon: 'login',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Clock-Out',
    caption: 'Use as Clock Out',
    icon: 'logout',
    link: 'https://twitter.quasar.dev'
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
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
