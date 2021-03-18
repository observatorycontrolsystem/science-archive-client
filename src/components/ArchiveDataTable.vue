<template>
  <b-row>
    <b-col md="10">
      <b-dropdown :disabled="!selected.length" split variant="primary" split-href="" @click="downloadFiles">
        <template #button-content>Download {{ selected.length }}</template>
        <b-dropdown-form>
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-radio v-model="dltype" :aria-describedby="ariaDescribedby" name="dltype" value="zip-compressed">
              zip download (with compressed fits files)
            </b-form-radio>
            <b-dropdown-divider />
            <b-form-radio v-model="dltype" :aria-describedby="ariaDescribedby" name="dltype" value="zip-uncompressed">
              zip download (with uncompressed fits files)
            </b-form-radio>
            <b-dropdown-divider />
            <b-form-radio v-model="dltype" :aria-describedby="ariaDescribedby" name="dltype" value="wget">wget script</b-form-radio>
          </b-form-group>
        </b-dropdown-form>
      </b-dropdown>
      <b-button :disabled="!selected.length" variant="primary" class="mx-1" @click="clearSelected">
        <template><i class="fa fa-times" /></template>
      </b-button>
      <b-table
        id="archive-table"
        ref="archivetable"
        selected-variant=""
        :items="data.results"
        :fields="fields"
        :busy="isBusy"
        small
        show-empty
        responsive
        selectable
        @row-selected="onRowSelected"
      >
        <template #head(selected)="">
          <b-form-checkbox @change="onSelectAll" />
        </template>
        <template #cell(selected)="row">
          <b-form-checkbox v-model="row.rowSelected" />
        </template>
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
      dltype: 'zip-compressed',
      selected: [],
      fields: [
        'selected',
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
      return this.$store.state.urls.archiveApi;
    },
    profile: function() {
      return this.$store.state.profile;
    }
  },
  methods: {
    clearSelected: function() {
      this.$refs.archivetable.clearSelected();
      this.selected = [];
    },
    initializeDataEndpoint: function() {
      return `${this.$store.state.urls.archiveApi}/frames/`;
    },
    onSelectAll: function(checked) {
      console.log(checked);
      if (checked) {
        this.selected = this.$refs.archivetable.items;
      } else {
        this.selected = [];
      }
    },
    onRowSelected: function(items) {
      this.selected = items;
    },
    downloadFiles: function() {
      // TODO: checkbox should select row
      // TODO: validate that fewer than 10 are selected for uncompressed download
      let archiveToken = localStorage.getItem('archiveToken');

      let frameIds = [];
      this.selected.forEach(function(value, i) {
        frameIds[i] = value.id;
      });

      if (this.dltype === 'zip-compressed' || this.dltype === 'zip-uncompressed') {
        let uncompress = this.dltype === 'zip-compressed' ? false : true;
        downloadZip(frameIds, uncompress, this.archiveApiUrl, archiveToken);
      } else if (this.dltype === 'wget') {
        // TODO: implement downloadWget
        downloadWget(frameIds, this.archiveApiUrl, archiveToken);
      }
    }
  }
};
</script>
