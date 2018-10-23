<template>
  <v-app :dark="isDarkMode">
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      app
      width="200"
      class="primary"
    >
      <v-list>
        <v-list-tile 
          v-for="(item, i) in items"
          :key="i"
          value="true"
          :href="item.href"
          :class="getNavClass(item.href)"
        >
          <v-list-tile-action>
            <v-icon class="primaryText--text" v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="primaryText--text" v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar class="primary primaryText--text" fixed app :clipped-left="clipped">
      <v-toolbar-side-icon class="primaryText--text" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn 
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon class="primaryText--text" v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      
      <v-toolbar-title> {{ title }} </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="isDarkMode = !isDarkMode" icon>
        <v-icon class="primaryText--text" v-if="!isDarkMode" > invert_colors </v-icon>
        <v-icon class="primaryText--text" v-else > invert_colors </v-icon>
      </v-btn>
    </v-toolbar>

    
    <main>
      <v-content>
        <v-container fluid >
            <v-layout column align-center>
              <v-fade-transition mode="out-in">
              <router-view @alert="alert" ></router-view>
            </v-fade-transition>
            </v-layout>
        </v-container>
      </v-content>
    </main>

    <v-snackbar
    bottom
    :value="alertOpen"
    :color="alertSuccess ? 'success' : 'error'"
     >
     {{ alertString }}
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  data: () => {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: "home",
          title: "Home",
          href: "/#/home",
          router: true
        },
        {
            icon: "assignment",
            title: "Proto Files",
            href: "/#/proto-files",
            router: true
        },
        {
            icon: "repeat",
            title: "gRPC",
            href: "/#/grpc",
            router: true
        },
        {
            icon: "label_important",
            title: "Kafka",
            href: "/#/kafka",
            router: true
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Super Probugr",
      alertOpen: false,
      alertString: '',
      alertSuccess: false,
      isDarkMode: false,
    };
  },

  watch: {
    isDarkMode() {
      if (!this.isDarkMode) { //NOT dark mode
        this.$vuetify.theme = {
            primary: '#7A858D', //Main color
            primaryText: '#241F1C', //Color for text on primary
            secondary: '#66747D', //Color for active nav
            lightText: '#F2F2F5',
            accent: '#87B2CB'
        }
      } else { //Dark mode
        this.$vuetify.theme = {
            primary: '#061218', //Main color
            primaryText: '#8F2AA3', //Color for text on primary
            secondary: '#FF178C', //Color for active nav
            lightText: '#F2A6FA',
            accent: '#28E2BD'
        }
      }
    }
  },

  methods: {
    alert(success, callName, resource) {
      this.alertOpen = false
      this.alertString = callName + ' ' + resource
      if (success) {
        this.alertSuccess = true
        this.alertString += ' was successful.'
      } else {
        this.alertSuccess = false
        this.alertString += ' has failed.'
      }
      this.alertOpen = true
    },

    getNavClass(href) {
      if (this.$route.fullPath == href.substring(2)) {
        return 'secondary primaryText--text'
      } else {
        return 'primary primaryText--text'
      }
    }
  }

  
};
</script>
