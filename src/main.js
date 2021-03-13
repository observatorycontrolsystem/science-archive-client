import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import BootstrapVue from 'bootstrap-vue';
import '@/assets/scss/app.scss';

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

fetch('/config/urls.json')
  .then(response => response.json())
  .then(data => {
    store.commit('setRuntimeConfig', {
      observationPortalApi: process.env.VUE_APP_OBSERVATION_PORTAL_API_URL || data.observationPortalApiUrl,
      archiveApi: process.env.VUE_APP_ARCHIVE_API_URL || data.archiveApiUrl,
      simbadService: process.env.VUE_APP_SIMBAD_SERVICE_URL || data.simbadServiceUrl,
      thumbnailService: process.env.VUE_APP_THUMBNAILS_SERVICE_URL || data.thumbnailServiceUrl
    });

    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app');
  });
