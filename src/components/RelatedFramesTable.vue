<template>
  <b-table :items="data" :fields="fields" :busy="!dataLoaded" show-empty hover>
    <template #table-busy>
      <div class="text-center my-2"><i class="fa fa-spin fa-spinner" /> Loading data, please wait...</div>
    </template>
    <template #empty>
      <div class="text-center">No matching records found</div>
    </template>
  </b-table>
</template>
<script>
import { OCSMixin } from 'ocs-component-lib';

export default {
  name: 'RelatedFramesTable',
  mixins: [OCSMixin.getDataListMixin],
  props: {
    frameId: {
      type: [String, Number],
      required: true
    }
  },
  data: function() {
    return {
      fields: [
        {
          key: 'basename',
          label: 'Basename'
        },
        {
          key: 'OBSTYPE',
          label: 'Type'
        }
      ]
    };
  },
  methods: {
    initializeDataEndpoint: function() {
      return `${this.$store.state.urls.archiveApi}/frames/${this.frameId}/related/`;
    }
  }
};
</script>
