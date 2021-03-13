<template>
  <div>
    <b-table id="archive-table" :items="data.results" :fields="fields" :busy="isBusy" small show-empty responsive>
      <template #empty>
        return 'No matching records found.';
        <div v-if="!profile.username"></div>
        <div v-else>No matching records found. You must be logged in to view proprietary data.</div>
      </template>
      <template #table-busy>
        <div>Getting data.</div>
      </template>
    </b-table>
    <ocs-pagination
      v-if="!isBusy"
      table-id="archive-table"
      :per-page="queryParams.limit"
      :total-rows="data.count"
      :current-page="currentPage"
      @pageChange="onPageChange"
    />
  </div>
</template>

<script>
const Terraformer = require('@terraformer/spatial');

import { OCSMixin, OCSUtil } from 'ocs-component-lib';

export default {
  name: 'ArchiveDataTable',
  mixins: [OCSMixin.paginationAndFilteringMixin],
  data: function() {
    return {
      fields: [
        {
          key: 'basename',
          label: 'Basename'
        },
        {
          key: 'DATE_OBS',
          label: 'Time',
          formatter: value => {
            return OCSUtil.formatDate(value);
          }
        },
        {
          key: 'PROPID',
          label: 'Proposal'
        },
        {
          key: 'OBJECT',
          label: 'Object'
        },
        {
          key: 'FILTER',
          label: 'Filter'
        },
        {
          key: 'OBSTYPE',
          label: 'Type'
        },
        {
          key: 'BLKUID',
          label: 'Observation ID'
        },
        {
          key: 'REQNUM',
          label: 'Request #'
        },
        {
          key: 'area',
          label: 'Centroid',
          formatter: value => {
            if (value) {
              let envelope = Terraformer.calculateEnvelope(value);
              let ra = envelope.x + envelope.w / 2;
              if (ra < 0) {
                ra = parseFloat(ra) + 360.0;
              }
              let dec = envelope.y + envelope.h / 2;
              return `${ra.toFixed(4)}, ${dec.toFixed(4)}`;
            } else {
              return '';
            }
          }
        },
        {
          key: 'EXPTIME',
          label: 'Exp. Time'
        },
        {
          key: 'RLEVEL',
          label: 'R. level',
          formatter: value => {
            switch (value) {
              case 0:
                return 'Raw';
              case 10:
                return 'QuickLook (ORAC)';
              case 11:
                return 'QuickLook (BANZAI)';
              case 90:
                return 'Reduced (ORAC)';
              case 91:
                return 'Reduced (BANZAI)';
            }
            return '';
          }
        }
      ]
    };
  },
  computed: {
    profile: function() {
      return this.$store.state.profile;
    }
  },
  methods: {
    initializeDataEndpoint: function() {
      return `${this.$store.state.urls.archiveApi}/frames/`;
    }
  }
};
</script>
