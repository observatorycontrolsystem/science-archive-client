<template>
  <div id="app" class="d-flex flex-column h-100">
    <div>
      <b-navbar toggleable="lg" variant="lco-dark-blue" type="dark">
        <b-navbar-brand href="https://lco.global">
          <b-img
            class="brand-image-small d-inline-block align-top d-lg-none"
            src="https://cdn.lco.global/mainstyle/img/LCO_logo_transparent_with_coords.png"
            alt="Las Cumbres Observatory"
          />
          <b-img
            class="brand-image-large align-top d-none d-lg-inline-block"
            src="https://cdn.lco.global/mainstyle/img/LCO_logo_transparent_with_coords.png"
            alt="Las Cumbres Observatory"
          />
          <div id="lco-name-large" class="lco-name text-left pl-2 align-top d-none d-lg-inline-block">Science<br />Archive</div>
          <div id="lco-name-small" class="lco-name text-left pl-2 align-top d-inline-block d-lg-none">Science<br />Archive</div>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="https://lco.global/documentation/archive-documentation/">Documentation</b-nav-item>
            <b-nav-item :href="scienceArchiveUrl">API</b-nav-item>
            <b-nav-item href="https://lco.global/">LCO Home</b-nav-item>
            <template v-if="userIsAuthenticated">
              <hr class="w-100 d-lg-none border-light" />
              <b-nav-text class="d-lg-none">
                <i class="fas fa-user-alt"></i> <span class="font-weight-bold">{{ profile.username }}</span>
              </b-nav-text>
              <b-nav-item class="d-lg-none" @click="logout">Logout</b-nav-item>
            </template>
            <template v-else>
              <b-nav-item class="d-lg-none" @click="login">Login</b-nav-item>
            </template>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown v-if="userIsAuthenticated" class="d-none d-lg-block" right>
              <template #button-content>
                <i class="fas fa-user-alt"></i>
              </template>
              <b-dropdown-text>
                Logged in as <span class="font-weight-bold">{{ profile.username }}</span>
              </b-dropdown-text>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item @click="logout">Logout</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item v-else class="d-none d-lg-block" @click="login">Login</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <b-container class="flex-shrink-0 p-1">
      <b-row>
        <b-col md="12">
          <b-alert
            v-for="message in messages"
            :key="message.text"
            :variant="message.variant"
            class="m-1"
            dismissible
            show
            @dismissed="deleteMessage(message.text)"
          >
            {{ message.text }}
          </b-alert>
        </b-col>
      </b-row>
      <router-view class="my-3" />
    </b-container>
    <div class="footer text-center mt-auto pt-2">
      Copyright <span class="align-top"><i class="far fa-copyright fa-xs"></i></span> {{ year }} Las Cumbres Observatory. All rights reserved.
      <ul>
        <li><a class="black" title="terms of service" href="https://lco.global/observatory/termsofservice/">Terms of Service</a></li>
        <li><a class="black" title="privacy policy" href="https://lco.global/observatory/privacy-policy/">Privacy Policy</a></li>
        <li><a class="black" title="feedback" href="mailto:science-support@lco.global">Feedback</a></li>
        <li>
          <a class="black" title="github" href="https://github.com/observatorycontrolsystem/science-archive">
            <i class="fab fa-github"></i> View API on Github
          </a>
        </li>
        <li><a class="black" title="API" :href="scienceArchiveUrl">API</a></li>
        <li><a class="black" title="API documentation" href="https://developers.lco.global/#archive">API Documentation</a></li>
        <li>
          <a class="black" title="general documentation" href="https://lco.global/documentation/archive-documentation/">General Documentation</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import moment from 'moment';

export default {
  name: 'App',
  data: function() {
    return {
      year: moment.utc().format('YYYY')
    };
  },
  computed: {
    scienceArchiveUrl: function() {
      // TODO: Get from app configuration
      return 'https://archive-api.lco.global/frames/';
    },
    profile: function() {
      // TODO: Implement
      return { username: 'me' };
    },
    userIsAuthenticated: function() {
      // TODO: Implement
      return true;
    },
    messages: function() {
      return this.$store.state.messages;
    }
  },
  methods: {
    deleteMessage: function(messageText) {
      this.$store.commit('deleteMessage', messageText);
    },
    logout: function() {
      // TODO: Implement
      console.log('logging out');
    },
    login: function() {
      // TODO: Implement
      console.log('logging in');
    }
  }
};
</script>
<style scoped>
.brand-image-large {
  max-height: 50px;
}
.brand-image-small {
  max-height: 45px;
}
.lco-name {
  font-family: 'Heebo', sans-serif;
}
#lco-name-large {
  font-size: 1.2rem;
}
#lco-name-small {
  font-size: 1rem;
}
.basic-small {
  font-size: 0.6rem;
}
</style>
