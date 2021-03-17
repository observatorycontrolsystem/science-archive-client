<template>
  <b-row>
    <b-col md="10">
      <b-dropdown split variant="primary" split-href="" text="Download" @click="downloadFiles">
        <b-dropdown-form>
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-radio v-model="dltype" :aria-describedby="ariaDescribedby" name="dltype" value="zip">zip download</b-form-radio>
            <b-dropdown-divider />
            <b-form-radio v-model="dltype" :aria-describedby="ariaDescribedby" name="dltype" value="wget">wget script</b-form-radio>
          </b-form-group>
        </b-dropdown-form>
      </b-dropdown>
      <b-table
        id="archive-table"
        :items="data.results"
        :fields="fields"
        :busy="isBusy"
        small
        show-empty
        responsive
        selectable
        @row-selected="onRowSelected"
      >
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
    </b-col>
  </b-row>
</template>

<script>
const Terraformer = require('@terraformer/spatial');

import { OCSMixin, OCSUtil } from 'ocs-component-lib';

import { downloadZip, downloadWget } from '@/download.js';

export default {
  name: 'ArchiveDataTable',
  mixins: [OCSMixin.paginationAndFilteringMixin],
  data: function() {
    return {
      dltype: 'zip',
      selections: [],
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
    archiveApiUrl: function() {
      console.log(this.$store.state.urls.archiveApi);
      return this.$store.state.urls.archiveApi;
    },
    profile: function() {
      return this.$store.state.profile;
    }
  },
  methods: {
    initializeDataEndpoint: function() {
      return `${this.$store.state.urls.archiveApi}/frames/`;
    },
    onRowSelected(items) {
      this.selected = items;
    },
    downloadFiles: function() {
      // TODO: disable download button if no selections
      // TODO: add deselect all button
      let archiveToken = localStorage.getItem('archiveToken');

      let frameIds = [];
      this.selected.forEach(function(value, i) {
        frameIds[i] = value.id;
      });

      console.log(this.dltype);
      if (this.dltype === 'zip') {
        // TODO: plumb through uncompress flag
        downloadZip(frameIds, true, this.archiveApiUrl, archiveToken);
      } else if (this.dltype === 'wget') {
        downloadWget(frameIds, this.archiveApiUrl, archiveToken);
      }
    }
  }
};
</script>
