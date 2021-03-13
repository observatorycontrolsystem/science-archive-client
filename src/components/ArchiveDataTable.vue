<template>
  <div>
    <b-table id="archive-table" :items="data.results" :fields="fields"> </b-table>
    <ocs-pagination
      v-if="!isBusy"
      table-id="archive-table"
      :per-page="queryParams.limit"
      :total-rows="data.count"
      :current-page="currentPage"
      @pageChange="onPageChange"
    ></ocs-pagination>
  </div>
</template>

<script>
import { OCSMixin } from 'ocs-component-lib';

export default {
  name: 'ArchiveDataTable',
  mixins: [OCSMixin.paginationAndFilteringMixin],
  data: function() {
    return {
      fields: ['basename', 'DATE_OBS', 'PROPID', 'OBJECT', 'FILTER', 'OBSTYPE', 'EXPTIME', 'RLEVEL']
    };
  },
  methods: {
    initializeDataEndpoint: function() {
      return this.$store.state.urls.archiveApi + '/frames/';
    }
  }
};
</script>
