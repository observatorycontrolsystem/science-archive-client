import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import BootstrapVue from 'bootstrap-vue';
import '@/assets/scss/app.scss';
import $ from 'jquery';

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

$.ajax({
  method: 'GET',
  url: '/config/urls.json'
}).done(function(data) {
  store.commit('setRuntimeConfig', {
    observationPortalApi: process.env.VUE_APP_OBSERVATION_PORTAL_API_URL || data.observationPortalApiUrl,
    archiveApi: process.env.VUE_APP_ARCHIVE_API_URL || data.archiveApiUrl,
    simbadService: process.env.VUE_APP_SIMBAD_SERVICE_URL || data.simbadServiceUrl,
    thumbnailService: process.env.VUE_APP_THUMBNAILS_SERVICE_URL || data.thumbnailServiceUrl
  });

  // Add the archive token to a request being sent to the archive api or the thumbservice
  $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    if (
      (options.url.startsWith(store.state.urls.archiveApi) || options.url.startsWith(store.state.urls.thumbnailService)) &&
      store.state.archiveToken
    ) {
      jqXHR.setRequestHeader('Authorization', 'Token ' + store.state.archiveToken);
    }
  });

  // Initialize archive token if it is available in local storage already
  store.commit('initializeArchiveToken');

  store
    .dispatch('getProfileData')
    .then(() => {
      new Vue({
        router,
        store,
        render: h => h(App)
      }).$mount('#app');
    })
    .catch(() => {
      // TODO: Display error page
      console.log('Error getting profile data');
    });
});
