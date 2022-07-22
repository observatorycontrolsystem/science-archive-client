import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import BootstrapVue from 'bootstrap-vue';
import { OCSComponentLib } from 'ocs-component-lib';
import '@/assets/scss/app.scss';
import $ from 'jquery';

Vue.use(BootstrapVue);
Vue.use(OCSComponentLib);

Vue.config.productionTip = false;

$.ajax({
  method: 'GET',
  url: '/config/urls.json'
}).done(function(data) {
  store.commit('setRuntimeConfig', {
    observationPortalApi: process.env.VUE_APP_OBSERVATION_PORTAL_API_URL || data.observationPortalApiUrl,
    archiveApi: process.env.VUE_APP_ARCHIVE_API_URL || data.archiveApiUrl,
    simbadService: process.env.VUE_APP_SIMBAD_SERVICE_URL || data.simbadServiceUrl,
    thumbnailService: process.env.VUE_APP_THUMBNAIL_SERVICE_URL || data.thumbnailServiceUrl,
    navbarBrandUrl: process.env.VUE_APP_NAVBAR_BRAND_URL || data.navbarBrandUrl,
    brandImageSmall: process.env.VUE_APP_BRAND_IMAGE_SMALL || data.brandImageSmall,
    brandImageLarge: process.env.VUE_APP_BRAND_IMAGE_LARGE || data.brandImageLarge,
    brandImageAltText: process.env.VUE_APP_BRAND_IMAGE_ALT_TEXT || data.brandImageAltText,
    documentationUrl: process.env.VUE_APP_DOCUMENTATION_URL || data.documentationUrl,
    organizationHomepageLink: process.env.VUE_APP_ORGANIZATION_HOMEPAGE_LINK || data.organizationHomepageLink,
    organizationHomepageText: process.env.VUE_APP_ORGANIZATION_HOMEPAGE_TEXT || data.organizationHomepageText,
    copyrightOrganization: process.env.VUE_APP_COPYRIGHT_ORGANIZATION || data.copyrightOrganization,
    termsOfServiceUrl: process.env.VUE_APP_TERMS_OF_SERVICE_URL || data.termsOfServiceUrl,
    feedbackEmail: process.env.VUE_APP_FEEDBACK_EMAIL || data.feedbackEmail,
    privacyPolicyUrl: process.env.VUE_APP_PRIVACY_POLICY_URL || data.privacyPolicyUrl,
    githubApiUrl: process.env.VUE_APP_GITHUB_API_URL || data.githubApiUrl,
    apiDocumentationUrl: process.env.VUE_APP_API_DOCUMENTATION_URL || data.apiDocumentationUrl,
    generalDocumentationUrl: process.env.VUE_APP_GENERAL_DOCUMENTATION_URL || data.generalDocumentationUrl,
    reductionLevelOptions: JSON.parse(process.env.VUE_APP_REDUCTION_LEVEL_OPTIONS) || JSON.parse(data.reductionLevelOptions)
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
