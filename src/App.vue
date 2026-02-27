<template>
  <div id="app" class="d-flex flex-column h-100">
    <div>
      <b-navbar toggleable="lg" variant="dark-blue" type="dark">
        <b-navbar-brand :href="this.$store.state.urls.navbarBrandUrl">
          <b-img class="brand-image-small d-inline-block align-top d-lg-none"
            :src="this.$store.state.urls.brandImageSmall"
            :alt="this.$store.state.urls.brandImageAltText" />
          <b-img class="brand-image-large align-top d-none d-lg-inline-block"
            :src="this.$store.state.urls.brandImageLarge"
            :alt="this.$store.state.urls.brandImageAltText" />
          <div id="name-large" class="name text-left pl-2 align-top d-none d-lg-inline-block">Science<br />Archive</div>
          <div id="name-small" class="name text-left pl-2 align-top d-inline-block d-lg-none">Science<br />Archive</div>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item :href="this.$store.state.urls.documentationUrl">Documentation</b-nav-item>
            <b-nav-item :href="this.$store.state.urls.archiveApiUrl">API</b-nav-item>
            <b-nav-item :href="this.$store.state.urls.organizationHomepageUrl">{{ this.$store.state.urls.organizationHomepageText }}</b-nav-item>
            <template v-if="userIsAuthenticated">
              <hr class="w-100 d-lg-none border-light" />
              <b-nav-text class="d-lg-none">
                <i class="fas fa-user-alt"></i> <span class="font-weight-bold">{{ profile.username }}</span>
              </b-nav-text>
              <b-nav-item class="d-lg-none" @click="logout">Logout</b-nav-item>
            </template>
            <template v-else>
              <b-nav-item class="d-lg-none" :to="{ name: 'Login' }">Login</b-nav-item>
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
            <b-nav-item v-else class="d-none d-lg-block" :to="{ name: 'Login' }">Login</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <b-container class="flex-shrink-0 p-1">
      <b-alert v-if="userIsAuthenticatedAndNotMemberOfProposals" variant="info" show dismissible>
        <div>You are not a member of any proposals. Only public data will be shown.</div>
      </b-alert>
      <b-alert v-if="profileError" show variant="danger" dismissible @dismissed="profileError = ''">
        <p>{{ profileError }}</p>
      </b-alert>
      <router-view class="my-3" v-if="!loading"/>
    </b-container>
    <ArchiveFooter
      :copyright-organization="this.$store.state.urls.copyrightOrganization"
      :terms-of-service-url="this.$store.state.urls.termsOfServiceUrl"
      :privacy-policy-url="this.$store.state.urls.privacyPolicyUrl"
      :feedback-email="this.$store.state.urls.feedbackEmail"
      :github-api-url="this.$store.state.urls.githubApiUrl"
      :science-archive-api-url="this.$store.state.urls.archiveApiUrl"
      :api-documentation-url="this.$store.state.urls.apiDocumentationUrl"
      :general-documentation-url="this.$store.state.urls.generalDocumentationUrl" />
  </div>
</template>
<script>
import ArchiveFooter from '@/components/ArchiveFooter.vue';

export default {
  name: 'App',
  components: {
    ArchiveFooter
  },
  data: function() {
    return {
      profileError: '',
      loading: true
    };
  },
  computed: {
    profile: function() {
      return this.$store.state.profile;
    },
    userIsAuthenticated: function() {
      return this.$store.state.userIsAuthenticated;
    },
    userIsAuthenticatedAndNotMemberOfProposals: function() {
      return this.userIsAuthenticated && this.profile.profile.proposals.length < 1;
    }
  },
  created: async function () {
    try {
      await this.$store.dispatch('getProfileData');
      this.profileError = '';
    } catch (response) {
      this.profileError= `Failed to load profile data - ${response.status}: ${response.statusText} - ${response.responseText}`;
      console.error(this.profileError);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch('removeArchiveToken').then(() => {
        window.location = window.location.href.split('?')[0];
      });
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
.name {
  font-family: 'Heebo', sans-serif;
}
#name-large {
  font-size: 1.2rem;
}
#name-small {
  font-size: 1rem;
}
.basic-small {
  font-size: 0.6rem;
}
</style>
