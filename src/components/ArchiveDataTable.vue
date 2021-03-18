<template>
  <b-row>
    <b-col md="2">
      <b-form @submit="onSubmit" @reset="onReset">
        <b-form-group id="input-group-daterange">
          <!-- TODO: Implement -->
          <b-form-datepicker id="input-group-daterange-start" v-model="queryParams.start" class="mb-2"></b-form-datepicker>
          <b-form-datepicker id="input-group-daterange-end" v-model="queryParams.end" class="mb-2"></b-form-datepicker>
        </b-form-group>

        <b-form-group id="input-group-proposals">
          <template #label> Proposal<sup v-b-tooltip.hover.right title="Log in to view your proposals">?</sup> </template>
          <b-form-select id="input-proposals" v-model="queryParams.PROPID">
            <template #first>
              <b-form-select-option :value="''">All</b-form-select-option>
              <b-form-select-option :value="''" disabled>---</b-form-select-option>
            </template>
            <b-form-select-option-group v-if="profileProposals.length > 0" label="My proposals">
              <b-form-select-option v-for="proposal in profileProposals" :key="proposal" :value="proposal">
                {{ proposal }}
              </b-form-select-option>
            </b-form-select-option-group>
            <b-form-select-option-group label="Public proposals">
              <b-form-select-option v-for="proposal in categorizedAggregatedOptions.proposals.available" :key="proposal" :value="proposal">
                {{ proposal }}
              </b-form-select-option>
              <b-form-select-option v-if="categorizedAggregatedOptions.proposals.unavailable.length > 0" :value="''" disabled
                >---</b-form-select-option
              >
              <b-form-select-option v-for="proposal in categorizedAggregatedOptions.proposals.unavailable" :key="proposal" :value="proposal">
                {{ proposal }}
              </b-form-select-option>
            </b-form-select-option-group>
          </b-form-select>
        </b-form-group>

        <b-form-group id="input-group-public">
          <b-form-checkbox id="checkbox-public" v-model="queryParams.public" name="checkbox-public" value="true" unchecked-value="false">
            Include public data
          </b-form-checkbox>
        </b-form-group>

        <b-form-group id="input-group-basename">
          <template #label>
            Basename
          </template>
          <b-form-input v-model="queryParams.basename"></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-point">
          <template #label>
            Point<sup
              v-b-tooltip.hover.right
              title="Searching by point is usually the most effective method as it will find
            all frames containing an RA/Dec independent of the name given in the OBJECT header. This will not work for solar
            system objects. Sexagesimal or degrees. You may also click the magnification glass to fetch RA/Dec from online
            sources (such as SIMBAD or NED) by object name."
              >?</sup
            >
          </template>
          <!-- TODO: Implement -->
          <b-form-input v-model="queryParams.covers"></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-object">
          <template #label>
            Object<sup
              v-b-tooltip.hover.right
              title="As written to FITS header. Not an exact match: returns all frames with the given text included in the OBJECT header."
              >?</sup
            >
          </template>
          <b-form-input v-model="queryParams.OBJECT"></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-obstype">
          <template #label>
            Observation Type
          </template>
          <b-form-select id="input-obstype" v-model="queryParams.OBSTYPE">
            <template #first>
              <b-form-select-option :value="''">All</b-form-select-option>
            </template>
            <b-form-select-option v-for="obstype in categorizedAggregatedOptions.obstypes.available" :key="obstype" :value="obstype">
              {{ obstype }}
            </b-form-select-option>
            <b-form-select-option v-if="categorizedAggregatedOptions.obstypes.unavailable.length > 0" :value="''" disabled>---</b-form-select-option>
            <b-form-select-option v-for="obstype in categorizedAggregatedOptions.obstypes.unavailable" :key="obstype" :value="obstype">
              {{ obstype }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>

        <b-form-group id="input-group-rlevel">
          <template #label>
            Reduction Level
          </template>
          <template #description>
            See <a href="https://lco.global/documentation/archive-documentation/#products" target="blank">documentation on reduction levels</a>.
          </template>
          <b-form-select id="input-rlevel" v-model="queryParams.RLEVEL">
            <template #first>
              <b-form-select-option :value="''">All</b-form-select-option>
            </template>
            <b-form-select-option value="0">Raw</b-form-select-option>
            <b-form-select-option value="10">Quicklook (ORAC)</b-form-select-option>
            <b-form-select-option value="11">Quicklook (BANZAI)</b-form-select-option>
            <b-form-select-option value="90">Reduced (ORAC)</b-form-select-option>
            <b-form-select-option value="91">Reduced (BANZAI)</b-form-select-option>
          </b-form-select>
        </b-form-group>

        <b-form-group id="input-group-site">
          <template #label>
            Site
          </template>
          <b-form-select id="input-site" v-model="queryParams.SITEID">
            <template #first>
              <b-form-select-option :value="''">All</b-form-select-option>
            </template>
            <b-form-select-option v-for="site in categorizedAggregatedOptions.sites.available" :key="site" :value="site">
              {{ site }}
            </b-form-select-option>
            <b-form-select-option v-if="categorizedAggregatedOptions.sites.unavailable.length > 0" :value="''" disabled>---</b-form-select-option>
            <b-form-select-option v-for="site in categorizedAggregatedOptions.sites.unavailable" :key="site" :value="site">
              {{ site }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>

        <b-form-group id="input-group-telescope">
          <template #label>
            Telescope
          </template>
          <b-form-select id="input-telescope" v-model="queryParams.TELID">
            <template #first>
              <b-form-select-option :value="''">All</b-form-select-option>
            </template>
            <b-form-select-option v-for="telescope in categorizedAggregatedOptions.telescopes.available" :key="telescope" :value="telescope">
              {{ telescope }}
            </b-form-select-option>
            <b-form-select-option v-if="categorizedAggregatedOptions.telescopes.unavailable.length > 0" :value="''" disabled
              >---</b-form-select-option
            >
            <b-form-select-option v-for="telescope in categorizedAggregatedOptions.telescopes.unavailable" :key="telescope" :value="telescope">
              {{ telescope }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>

        <b-form-group id="input-group-instrument">
          <template #label>
            Instrument
          </template>
          <b-form-select id="input-instrument" v-model="queryParams.INSTRUME">
            <template #first>
              <b-form-select-option :value="''">All</b-form-select-option>
            </template>
            <b-form-select-option v-for="instrument in categorizedAggregatedOptions.instruments.available" :key="instrument" :value="instrument">
              {{ instrument }}
            </b-form-select-option>
            <b-form-select-option v-if="categorizedAggregatedOptions.instruments.unavailable.length > 0" :value="''" disabled
              >---</b-form-select-option
            >
            <b-form-select-option v-for="instrument in categorizedAggregatedOptions.instruments.unavailable" :key="instrument" :value="instrument">
              {{ instrument }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>

        <b-form-group id="input-group-filter">
          <template #label>
            Filter
          </template>
          <b-form-select id="input-filter" v-model="queryParams.FILTER">
            <template #first>
              <b-form-select-option :value="''">All</b-form-select-option>
            </template>
            <b-form-select-option v-for="filter in categorizedAggregatedOptions.filters.available" :key="filter" :value="filter">
              {{ filter }}
            </b-form-select-option>
            <b-form-select-option v-if="categorizedAggregatedOptions.filters.unavailable.length > 0" :value="''" disabled>---</b-form-select-option>
            <b-form-select-option v-for="filter in categorizedAggregatedOptions.filters.unavailable" :key="filter" :value="filter">
              {{ filter }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>

        <b-form-group id="input-group-object">
          <template #label>
            Exposure Time<sup v-b-tooltip.hover.right title="Exposure time in seconds. Filter results with a greater than or equal value">?</sup>
          </template>
          <b-form-input v-model="queryParams.EXPTIME" type="number"></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" :disabled="isBusy">Submit</b-button>
        <b-button type="reset" variant="danger" :disabled="isBusy">Reset</b-button>
      </b-form>
    </b-col>
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
          <div v-if="!userIsAuthenticated" class="text-center my-2">
            No matching records found. You must be logged in to view proprietary data.
          </div>
          <div v-else class="text-center my-2">
            No matching records found.
          </div>
        </template>
        <template #table-busy>
          <div class="text-center my-2"><i class="fa fa-spin fa-spinner" /> Loading data, please wait...</div>
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
import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';
const Terraformer = require('@terraformer/spatial');

import { OCSMixin, OCSUtil } from 'ocs-component-lib';

import { downloadZip, downloadWget } from '@/download.js';

export default {
  name: 'ArchiveDataTable',
  mixins: [OCSMixin.paginationAndFilteringMixin],
  props: {
    // List of semesters to be used to generate helpful time ranges for the time filter. The current semester is
    // expected to be the first semester in the array, and the array is expected to be sorted going back in time.
    semesters: {
      type: Array,
      required: false,
      default: () => {
        return [];
      }
    }
  },
  data: function() {
    let filterDateRangeOptions = {
      'All Time': [
        moment('2000-01-01'),
        moment
          .utc()
          .endOf('day')
          .add(1, 'days')
      ],
      Today: [moment.utc().startOf('day'), moment.utc().endOf('day')],
      Yesterday: [
        moment
          .utc()
          .startOf('day')
          .subtract(1, 'days'),
        moment
          .utc()
          .endOf('day')
          .subtract(1, 'days')
      ],
      'Last 7 Days': [
        moment
          .utc()
          .startOf('day')
          .subtract(6, 'days'),
        moment.utc().endOf('day')
      ],
      'Last 30 Days': [
        moment
          .utc()
          .startOf('day')
          .subtract(29, 'days'),
        moment.utc().endOf('day')
      ]
    };
    if (this.currentSemester) {
      filterDateRangeOptions['This Semester'] = [moment.utc(this.currentSemester.start), moment.utc(this.currentSemester.end)];
    }
    if (this.lastSemester) {
      filterDateRangeOptions['Last Semester'] = [moment.utc(this.lastSemester.start), moment.utc(this.lastSemester.end)];
    }
    console.log('date ranges', filterDateRangeOptions);

    return {
      dltype: 'zip-compressed',
      selected: [],
      filterDateRangeOptions: filterDateRangeOptions,
      categorizedAggregatedOptions: {
        sites: {
          available: [],
          unavailable: []
        },
        instruments: {
          available: [],
          unavailable: []
        },
        telescopes: {
          available: [],
          unavailable: []
        },
        filters: {
          available: [],
          unavailable: []
        },
        obstypes: {
          available: [],
          unavailable: []
        },
        proposals: {
          available: [],
          unavailable: []
        }
      },
      allAggregatedOptions: {
        sites: [],
        instruments: [],
        telescopes: [],
        filters: [],
        obstypes: [],
        proposals: []
      },
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
    },
    userIsAuthenticated: function() {
      return this.$store.state.userIsAuthenticated;
    },
    profileProposals: function() {
      return _.get(this.profile, ['profile', 'proposals'], []).sort();
    },
    currentSemester: function() {
      return _.get(this.semesters, 0, {});
    },
    lastSemester: function() {
      return _.get(this.semesters, 1, {});
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
      // TODO: selections don't persist across pages
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
    },
    initializeDefaultQueryParams: function() {
      let defaultStart = '';
      let defaultEnd = '';
      if (this.currentSemester) {
        defaultStart = moment.utc(this.currentSemester.start).format('YYYY-MM-DD HH:mm');
        defaultEnd = moment.utc(this.currentSemester.end).format('YYYY-MM-DD HH:mm');
      }
      const defaultQueryParams = {
        RLEVEL: '',
        PROPID: '',
        INSTRUME: '',
        OBJECT: '',
        SITEID: '',
        TELID: '',
        FILTER: '',
        OBSTYPE: '',
        EXPTIME: '',
        BLKUID: '',
        REQNUM: '',
        basename: '',
        start: defaultStart,
        end: defaultEnd,
        id: '',
        covers: '',
        public: 'true',
        ordering: '',
        limit: 10,
        offset: 0
      };
      return defaultQueryParams;
    },
    onSuccessfulDataRetrieval: function() {
      this.updateFilters();
    },
    onErrorRetrievingData: function(response) {
      // TODO: Test
      // TODO: Maybe don't use alerts - use maybe bootstrap alerts or a modal
      if (response.status == 429) {
        alert('Your account has been throttled due to too many requests. Please see https://lco.global/documentation/archive-documentation/#limits');
      } else {
        alert('There was a problem with your request. Status: ' + response.status + ' Please contact support.');
      }
    },
    setOptions: function(optionKey, availableOptions) {
      // optionKey must be (is expected to be) one of the keys inside allAggregatedOptions
      availableOptions.sort();
      this.categorizedAggregatedOptions[optionKey].available = availableOptions;
      let unavailable = this.allAggregatedOptions[optionKey].slice(0);
      let unavailableIdx;
      for (let availableIdx in availableOptions) {
        unavailableIdx = unavailable.indexOf(availableOptions[availableIdx]);
        if (unavailableIdx >= 0) {
          unavailable.splice(unavailableIdx, 1);
        }
      }
      this.categorizedAggregatedOptions[optionKey].unavailable = unavailable;
    },
    updateOptions: function(aggregateField) {
      let isParamForFilter, isProposalForFilter;
      let filters = {
        aggregate_field: aggregateField
      };
      for (let p in this.queryParams) {
        if (this.queryParams[p]) {
          isParamForFilter = ['SITEID', 'TELID', 'INSTRUME', 'FILTER', 'OBSTYPE', 'start', 'end'].indexOf(p) >= 0;
          // Only add the proposal to the filters if the chosen proposal is a public one as those are the ones that are
          // populated by the aggregate endpoint. Profile proposals are handled differently.
          isProposalForFilter = p === 'PROPID' && this.allAggregatedOptions.proposals.indexOf(this.queryParams[p]) >= 0;
          if (isParamForFilter || isProposalForFilter) {
            filters[p] = this.queryParams[p];
          }
        }
      }
      $.ajax({
        url: `${this.archiveApiUrl}/frames/aggregate/`,
        data: filters
      })
        .done(response => {
          if (aggregateField === 'PROPID') {
            this.setOptions('proposals', response.proposals);
          } else if (aggregateField === 'OBSTYPE') {
            this.setOptions('obstypes', response.obstypes);
          } else if (aggregateField === 'SITEID') {
            this.setOptions('sites', response.sites);
          } else if (aggregateField === 'INSTRUME') {
            this.setOptions('instruments', response.instruments);
          } else if (aggregateField === 'FILTER') {
            this.setOptions('filters', response.filters);
          } else if (aggregateField === 'TELID') {
            this.setOptions('telescopes', response.telescopes);
          }
        })
    },
    getAllFiltersAndUpdateOptions: function(aggregateField) {
      $.ajax({
        url: `${this.archiveApiUrl}/frames/aggregate/`,
        data: { aggregate_field: aggregateField }
      })
        .done(response => {
          if (aggregateField === 'SITEID') {
            this.allAggregatedOptions.sites = response.sites.sort();
          } else if (aggregateField === 'FILTER') {
            this.allAggregatedOptions.filters = response.filters.sort();
          } else if (aggregateField === 'INSTRUME') {
            this.allAggregatedOptions.instruments = response.instruments.sort();
          } else if (aggregateField === 'TELID') {
            this.allAggregatedOptions.telescopes = response.telescopes.sort();
          } else if (aggregateField === 'OBSTYPE') {
            this.allAggregatedOptions.obstypes = response.obstypes.sort();
          } else if (aggregateField === 'PROPID') {
            this.allAggregatedOptions.proposals = response.proposals.sort();
          }
          this.updateOptions(aggregateField);
        })
    },
    updateFilters: function() {
      // Populate all the dropdowns from the aggregate endpoint.
      for (let filterName of ['SITEID', 'TELID', 'OBSTYPE', 'FILTER', 'INSTRUME', 'PROPID']) {
        if (this.allAggregatedOptions.sites.length < 1) {
          this.getAllFiltersAndUpdateOptions(filterName);
        } else {
          this.updateOptions(filterName);
        }
      }
    }
  }
};
</script>
