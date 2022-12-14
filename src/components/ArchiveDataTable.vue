<template>
  <b-row>
    <b-modal id="bv-modal-alert" hide-footer>
      <div class="d-block text-center">
        {{ alertModalMessage }}
      </div>
    </b-modal>
    <b-col md="2">
      <b-form @submit="onSubmit" @reset="onReset">
        <b-form-group id="input-group-daterange" class="my-1">
          <div id="date-range-picker" class="border border-secondary rounded p-1 w-100 text-center">
            <i class="far fa-calendar"></i> {{ queryParams.start }} <br />
            <i class="fas fa-caret-down"></i> {{ queryParams.end }}
          </div>
        </b-form-group>
        <aggregated-options-select
          id="proposals"
          v-model="queryParams.proposal_id"
          :options="categorizedAggregatedOptions.proposals"
          place-in-option-group
          option-group-label="Public proposals"
          place-first-options-in-group
          first-option-group-label="My proposals"
          :first-options="profileProposals"
          @input="refreshData"
        >
          <template #label><b> Proposal </b><sup v-b-tooltip.hover.right class="blue" title="Log in to view your proposals">?</sup> </template>
        </aggregated-options-select>
        <b-form-group id="input-group-public" class="my-0">
          <b-form-checkbox
            id="checkbox-public"
            v-model="queryParams.public"
            name="checkbox-public"
            value="true"
            unchecked-value="false"
            @input="refreshData"
          >
            Include public data
          </b-form-checkbox>
        </b-form-group>
        <b-form-group id="input-group-basename" class="my-1">
          <template #label>
            <b>Image Name</b>
            <sup v-b-tooltip.hover.right class="blue" title="Image name does not include file extension">
              ?
            </sup>
          </template>
          <b-form-input v-model="imageName" class="border-secondary my-0"></b-form-input>
        </b-form-group>
        <target-lookup v-model="queryParams.covers" @input="refreshData" />
        <b-form-group id="input-group-object" class="my-1">
          <template #label>
            <b>Object</b>
            <sup
              v-b-tooltip.hover.right
              class="blue"
              title="As written to FITS header. Not an exact match: returns all frames
              with the given text included in the OBJECT header."
            >
              ?
            </sup>
          </template>
          <b-form-input v-model="objectName" class="border-secondary my-0"></b-form-input>
        </b-form-group>
        <aggregated-options-select
          id="obstypes"
          v-model="queryParams.configuration_type"
          label="Observation Type"
          :options="categorizedAggregatedOptions.obstypes"
          @input="refreshData"
        />
        <b-form-group id="input-group-rlevel" class="my-1">
          <template #label>
            <b>Reduction Level</b>
          </template>
          <simple-select id="input-rlevel" v-model="queryParams.reduction_level" :options="reductionLevelOptions" @input="refreshData"></simple-select>
        </b-form-group>
        <aggregated-options-select
          id="sites"
          v-model="queryParams.site_id"
          label="Site"
          :options="categorizedAggregatedOptions.sites"
          @input="refreshData"
        />
        <aggregated-options-select
          id="telescopes"
          v-model="queryParams.telescope_id"
          label="Telescope"
          :options="categorizedAggregatedOptions.telescopes"
          @input="refreshData"
        />
        <aggregated-options-select
          id="instruments"
          v-model="queryParams.instrument_id"
          label="Instrument"
          :options="categorizedAggregatedOptions.instruments"
          @input="refreshData"
        />
        <aggregated-options-select
          id="filters"
          v-model="queryParams.primary_optical_element"
          label="Filter"
          :options="categorizedAggregatedOptions.filters"
          @input="refreshData"
        />
        <b-form-group id="input-group-exposure-time">
          <template #label>
            <b>Exposure Time</b
            ><sup
              v-b-tooltip.hover.right
              class="blue"
              title="Actual exposure time in seconds. Filter results with a greater than or equal value. Value may differ slightly from requested exposure time"
              >?</sup
            >
          </template>
          <b-form-input v-model="exposureTime" type="number" class="border-secondary my-0"></b-form-input>
        </b-form-group>
        <b-button-group class="w-100">
          <b-button type="reset" variant="outline-secondary" :disabled="isBusy">Reset</b-button>
        </b-button-group>
      </b-form>
    </b-col>
    <b-col md="10">
      <b-row class="mb-1">
        <b-col>
          <b-dropdown
            :split-class="{ disabled: selected.length <= 0 || preventDownloadUncompressed() }"
            split
            variant="primary"
            split-href=""
            @click="downloadFiles"
          >
            <template #button-content>Download {{ selected.length }}</template>
            <b-dropdown-form>
              <b-form-group v-slot="{ ariaDescribedby }">
                <b-form-radio v-model="dltype" :aria-describedby="ariaDescribedby" name="dltype" value="zip-compressed">
                  zip download (with compressed fits files)
                </b-form-radio>
                <b-dropdown-divider />
                <b-form-radio
                  v-model="dltype"
                  :disabled="selected.length > maxFunpackedFrames"
                  :aria-describedby="ariaDescribedby"
                  name="dltype"
                  value="zip-uncompressed"
                >
                  zip download (with uncompressed fits files)
                </b-form-radio>
                <b-dropdown-divider />
                <b-form-radio v-model="dltype" :aria-describedby="ariaDescribedby" name="dltype" value="wget">wget script</b-form-radio>
              </b-form-group>
            </b-dropdown-form>
          </b-dropdown>
          <b-button :disabled="selected.length <= 0" variant="primary" class="mx-1" @click="clearSelected">
            <template><i class="fa fa-times"/></template>
          </b-button>
        </b-col>
        <b-col class="text-right">
          <b-button-group>
            <b-button variant="outline-secondary" @click="refreshData"><i class="fas fa-sync-alt"></i></b-button>
            <b-dropdown variant="outline-secondary" right>
              <template #button-content>
                <i class="fas fa-table"></i>
              </template>
              <b-dropdown-form>
                <div v-for="(value, key) in fields" :key="key">
                  <b-form-checkbox
                    v-if="value.hideable"
                    :id="'checkbox-' + value.key"
                    :key="key"
                    v-model="value.hidden"
                    :name="'checkbox-' + value.key"
                    :value="false"
                    :unchecked-value="true"
                  >
                    <span v-if="value.label">{{ value.label }}</span>
                    <span v-else>{{ value.key }}</span>
                  </b-form-checkbox>
                </div>
              </b-dropdown-form>
            </b-dropdown>
            <b-dropdown variant="outline-secondary" right>
              <template #button-content>
                <i class="fas fa-file-export"></i>
              </template>
              <b-dropdown-item @click="exportTable('json')">JSON</b-dropdown-item>
              <b-dropdown-item @click="exportTable('xml')">XML</b-dropdown-item>
              <b-dropdown-item @click="exportTable('csv')">CSV</b-dropdown-item>
              <b-dropdown-item @click="exportTable('txt')">TXT</b-dropdown-item>
              <b-dropdown-item @click="exportTable('sql')">SQL</b-dropdown-item>
              <b-dropdown-item @click="exportTable('excel')">MS-Excel</b-dropdown-item>
            </b-dropdown>
          </b-button-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <span v-if="preventDownloadUncompressed()">Uncompressed downloads are not permitted with more than {{ maxFunpackedFrames }} files.</span>
        </b-col>
      </b-row>
      <b-table
        id="archive-table"
        ref="archivetable"
        :items="data.results"
        :fields="visibleFields"
        :busy="isBusy"
        small
        show-empty
        responsive
        selectable
        selected-variant=""
        hover
        sort-direction="desc"
        :sort-by="getSortByFromOrdering()"
        :sort-desc="getSortDescFromOrdering()"
        no-local-sorting
        @sort-changed="onSortingChanged"
        @row-clicked="onRowClicked"
      >
        <template #head(selected)="">
          <b-form-checkbox :checked="ifAllSelected()" @change="onSelectAll" />
        </template>
        <template #cell(selected)="row">
          <b-form-checkbox :checked="itemInSelected(row.item.id)" @change="onRowChecked(row, ...arguments)" />
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
        <template #cell(showDetails)="row">
          <b-link v-if="row.detailsShowing" @click="row.toggleDetails">
            <i class="fas fa-minus"></i>
          </b-link>
          <b-link v-else @click="row.toggleDetails">
            <i class="fas fa-plus"></i>
          </b-link>
        </template>
        <template #row-details="data">
          <frame-detail
            :frame-id="data.item.id"
            :obstype="data.item.configuration_type"
            :selected-items="selected"
            class="p-3"
            @checked-related-frame="onRowChecked(...arguments)"
            @clicked-related-frame="onRowClicked(...arguments)"
          />
        </template>
      </b-table>
      <template v-if="!isBusy && data.count > 0">
        <b-row>
          <b-col>
            <div class="text-right text-muted">
              Showing {{ currentPageRange.start }} to {{ currentPageRange.end }} of {{ data.count }} row{{ data.count === 1 ? '' : 's' }}
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <ocs-pagination
              table-id="archive-table"
              :per-page="queryParams.limit"
              :total-rows="data.count"
              :current-page="currentPage"
              :display-per-page-dropdown="true"
              :pagination-attrs="{ 'first-number': true, 'last-number': true }"
              :per-page-options="perPageOptions"
              @limitChange="onLimitChange"
              @pageChange="onPageChange"
            />
          </b-col>
        </b-row>
      </template>
    </b-col>
    <!-- This is included for downloading the table data -->
    <script src="https://cdn.lco.global/script/tableExport.min.js" type="application/javascript"></script>
  </b-row>
</template>

<script>
import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';
const Terraformer = require('@terraformer/spatial');
import 'bootstrap-daterangepicker-v2';
import 'bootstrap-daterangepicker-v2/daterangepicker.css';
import { OCSMixin, OCSUtil } from 'ocs-component-lib';

import { itemInList, removeItemFromList } from '@/util.js';
import { downloadZip, downloadWget } from '@/download.js';
import AggregatedOptionsSelect from '@/components/AggregatedOptionsSelect.vue';
import SimpleSelect from '@/components/SimpleSelect.vue';
import TargetLookup from '@/components/TargetLookup.vue';
import FrameDetail from '@/components/FrameDetail.vue';

export default {
  name: 'ArchiveDataTable',
  components: {
    AggregatedOptionsSelect,
    SimpleSelect,
    TargetLookup,
    FrameDetail
  },
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
    let filterDateRangeOptions = this.getTimeRangeFilters();
    return {
      dltype: 'zip-compressed',
      maxFunpackedFrames: 10,
      selected: [],
      filterDateRangeOptions: filterDateRangeOptions,
      alertModalMessage: '',
      perPageOptions: [
        { value: '20', text: '20 rows per page' },
        { value: '50', text: '50 rows per page' },
        { value: '100', text: '100 rows per page' },
        { value: '500', text: '500 rows per page' },
      ],
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
        {
          key: 'showDetails',
          label: '',
          tdClass: 'pr-2',
          sortable: false,
          hidden: false
        },
        {
          key: 'selected',
          sortable: false,
          hidden: false
        },
        {
          key: 'basename',
          label: 'Image Name',
          sortable: true,
          hideable: true,
          hidden: false
        },
        {
          key: 'observation_date',
          label: 'Time',
          sortable: true,
          hideable: true,
          hidden: false,
          formatter: value => {
            return OCSUtil.formatDate(value);
          }
        },
        {
          key: 'proposal_id',
          label: 'Proposal',
          sortable: true,
          hideable: true,
          hidden: false
        },
        {
          key: 'target_name',
          label: 'Object',
          sortable: true,
          hideable: true,
          hidden: false
        },
        {
          key: 'primary_optical_element',
          label: 'Filter',
          sortable: true,
          hideable: true,
          hidden: false
        },
        {
          key: 'configuration_type',
          label: 'Type',
          sortable: true,
          hideable: true,
          hidden: false
        },
        {
          key: 'observation_id',
          label: 'Observation ID',
          hideable: true,
          hidden: true
        },
        {
          key: 'request_id',
          label: 'Request #',
          hideable: true,
          hidden: true
        },
        {
          key: 'area',
          label: 'Centroid',
          hideable: true,
          hidden: true,
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
          key: 'exposure_time',
          label: 'Exp. Time',
          sortable: true,
          hideable: true,
          hidden: false,
          formatter: value => {
            // Only display 1 decimal point of precision in exposure time
            return _.round(parseFloat(value), 1).toFixed(1);
          }
        },
        {
          key: 'reduction_level',
          label: 'R. level',
          sortable: true,
          hideable: true,
          hidden: false,
        }
      ]
    };
  },
  computed: {
    imageName: {
      get: function() {
        return this.queryParams.basename;
      },
      set: _.debounce(function(newImageName) {
        this.queryParams.basename = newImageName;
        this.refreshData();
      }, 500)
    },
    objectName: {
      get: function() {
        return this.queryParams.target_name;
      },
      set: _.debounce(function(newObjectName) {
        this.queryParams.target_name = newObjectName;
        this.refreshData();
      }, 500)
    },
    exposureTime: {
      get: function() {
        return this.queryParams.exposure_time;
      },
      set: _.debounce(function(newExposureTime) {
        this.queryParams.exposure_time = newExposureTime;
        this.refreshData();
      }, 500)
    },
    reductionLevelOptions: function() {
      let options = JSON.parse(this.$store.state.urls.reductionLevelOptions);
      let dropdownOptions = [];
      // add default "All" option when reduction_level isn't specified
      dropdownOptions.push({ "value": "", "text": "All" });
      for (const [value, text] of Object.entries(options)) {
        dropdownOptions.push({"value": String(value), "text": String(text)})
        }
      return dropdownOptions;
    },
    archiveApiUrl: function() {
      return this.$store.state.urls.archiveApiUrl;
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
    visibleFields: function() {
      return _.filter(this.fields, function(field) {
        return !field.hidden;
      });
    },
    currentPageRange: function() {
      let limit = _.toNumber(this.queryParams.limit);
      let offset = _.toNumber(this.queryParams.offset);
      return {
        start: _.min([offset + 1, this.data.count]),
        end: _.min([offset + limit, this.data.count])
      };
    }
  },
  created: function() {
    this.updateFilters();
  },
  mounted: function() {
    // Set up alert modal to clear message when it it hidden
    this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
      if (modalId === 'bv-modal-alert') {
        this.alertModalMessage = '';
      }
    });

    $('#date-range-picker').daterangepicker(
      {
        locale: {
          format: this.getDateFormat()
        },
        opens: 'right',
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 1,
        showDropdowns: true,
        startDate: moment.utc(this.queryParams.start, this.getDateFormat()),
        endDate: moment.utc(this.queryParams.end, this.getDateFormat()),
        ranges: this.filterDateRangeOptions,
        dateLimit: {
          "days": 365
        },
        linkedCalendars: false,
        minDate: moment.utc("2010")
      },
      (start, end) => {
        this.queryParams.start = start.format(this.getDateFormat());
        this.queryParams.end = end.format(this.getDateFormat());
        this.refreshData();
      }
    );
  },
  methods: {
    exportTable: function(type) {
      $('#archive-table').tableExport({
        type: type,
        onCellHtmlData(cell, rowIndex, colIndex, htmlData) {
          if (cell.is('th')) {
            return cell.find('div').text();
          }
          return htmlData;
        },
        exportFooter: false,
        tfootSelector: ''
      });
    },
    getDateFormat: function() {
      return 'YYYY-MM-DD HH:mm';
    },
    getTimeRangeFilters: function() {
      let filterDateRangeOptions = {};
      let currentSemester = this.getCurrentOrLastSemester('current');
      if (currentSemester.start && currentSemester.end) {
        filterDateRangeOptions['This Semester'] = [moment.utc(currentSemester.start, this.getDateFormat()), moment.utc(currentSemester.end, this.getDateFormat())];
      }
      let lastSemester = this.getCurrentOrLastSemester('last');
      if (lastSemester.start && lastSemester.end) {
        filterDateRangeOptions['Last Semester'] = [moment.utc(lastSemester.start, this.getDateFormat()), moment.utc(lastSemester.end, this.getDateFormat())];
      }
      _.merge(filterDateRangeOptions, {
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
      });
      return filterDateRangeOptions;
    },
    getCurrentOrLastSemester: function(currentOrLast) {
      let semesterIndex = currentOrLast === 'current' ? 0 : 1;
      return _.get(this.semesters, semesterIndex, {});
    },
    initializeDataEndpoint: function() {
      return `${this.$store.state.urls.archiveApiUrl}/frames/`;
    },
    preventDownloadUncompressed: function() {
      return this.selected.length > this.maxFunpackedFrames && this.dltype === 'zip-uncompressed';
    },
    selectItem: function(item) {
      if (!_.includes(this.selected, item.id)) this.selected.push(item.id);
    },
    deselectItem: function(item) {
      // remove an item by value via filtering, since vue cannot detect changes made by _.pull or _.remove lodash methods
      this.selected = removeItemFromList(this.selected, item.id);
    },
    clearSelected: function() {
      this.$refs.archivetable.clearSelected();
      this.selected = [];
    },
    ifAllSelected: function() {
      // don't attempt to access the archive table before it has been mounted
      if (typeof this.$refs.archivetable === 'undefined') return;
      for (const item of this.$refs.archivetable.items) {
        if (!this.itemInSelected(item.id)) {
          return false;
        }
      }
      return true;
    },
    itemInSelected(item) {
      return itemInList(this.selected, item);
    },
    onSelectAll: function(checked) {
      if (checked) {
        this.$refs.archivetable.items.forEach(item => {
          this.selectItem(item);
        });
      } else {
        this.$refs.archivetable.items.forEach(item => {
          this.deselectItem(item);
        });
      }
    },
    onRowChecked: function(row, checked) {
      if (checked) {
        this.selectItem(row.item);
      } else {
        this.deselectItem(row.item);
      }
    },
    onRowClicked: function(item) {
      if (!this.itemInSelected(item.id)) {
        this.selectItem(item);
      } else {
        this.deselectItem(item);
      }
    },
    downloadFiles: function() {
      let archiveToken = localStorage.getItem('archiveToken');
      let frameIds = this.selected;
      if (this.dltype === 'zip-compressed' || this.dltype === 'zip-uncompressed') {
        let uncompress = this.dltype === 'zip-compressed' ? false : true;
        downloadZip(frameIds, uncompress, this.archiveApiUrl, archiveToken);
      } else if (this.dltype === 'wget') {
        downloadWget(frameIds, archiveToken, this.archiveApiUrl);
      }
    },
    initializeDefaultQueryParams: function() {
      let timeRangeFilters = this.getTimeRangeFilters();
      let defaultRange;
      // If the semester is available, use that to set the default range. Otherwise set the default range to today,
      // which is guaranteed to be in the time range filters.
      if (timeRangeFilters['This Semester']) {
        defaultRange = timeRangeFilters['This Semester'];
      } else {
        defaultRange = timeRangeFilters['Today'];
      }
      const defaultQueryParams = {
        reduction_level: '',
        proposal_id: '',
        instrument_id: '',
        target_name: '',
        site_id: '',
        telescope_id: '',
        primary_optical_element: '',
        configuration_type: '',
        exposure_time: '',
        observation_id: '',
        request_id: '',
        basename: '',
        start: defaultRange[0].format(this.getDateFormat()),
        end: defaultRange[1].format(this.getDateFormat()),
        id: '',
        covers: '',
        // keep public as undefined for now, we will set it for users as appropriate on creation of the component
        public: undefined,
        ordering: '',
        limit: 20,
        offset: 0
      };
      return defaultQueryParams;
    },
    onErrorRetrievingData: function(response) {
      if (response.status == 429) {
        this.alertModalMessage =
          'Your account has been throttled due to too many requests. Please see https://lco.global/documentation/archive-documentation/#limits';
      } else {
        this.alertModalMessage = `There was a problem with your request. Status: ${response.status}. Please contact support.`;
      }
      this.$bvModal.show('bv-modal-alert');
    },
    refreshData: function() {
      // when refreshing data to display, go to the first page of results.
      this.goToFirstPage();
      this.update();
      // update the available selections based on the newly-selected params
      this.updateFilters();
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
    updateOptions: function() {
      let isParamForFilter, isProposalForFilter;
      let filters = {};
      for (let p in this.queryParams) {
        if (this.queryParams[p]) {
          isParamForFilter = ['site_id', 'telescope_id', 'instrument_id', 'primary_optical_element', 'configuration_type', 'start', 'end', 'public'].indexOf(p) >= 0;
          // Only add the proposal to the filters if the chosen proposal is a public one as those are the ones that are
          // populated by the aggregate endpoint. Profile proposals are handled differently.
          isProposalForFilter = p === 'proposal_id' && this.allAggregatedOptions.proposals.indexOf(this.queryParams[p]) >= 0;
          if (isParamForFilter || isProposalForFilter) {
            filters[p] = this.queryParams[p];
          }
        }
      }
      $.ajax({
        url: `${this.archiveApiUrl}/frames/aggregate/`,
        data: filters
      }).done(response => {
        this.setOptions('proposals', response.proposals);
        this.setOptions('obstypes', response.obstypes);
        this.setOptions('sites', response.sites);
        this.setOptions('instruments', response.instruments);
        this.setOptions('filters', response.filters);
        this.setOptions('telescopes', response.telescopes);
      }).fail(() => {
        this.setOptions('proposals', this.allAggregatedOptions.proposals);
        this.setOptions('obstypes', this.allAggregatedOptions.obstypes);
        this.setOptions('sites', this.allAggregatedOptions.sites);
        this.setOptions('instruments', this.allAggregatedOptions.instruments);
        this.setOptions('filters', this.allAggregatedOptions.filters);
        this.setOptions('telescopes', this.allAggregatedOptions.telescopes);
      });
    },
    getAllFiltersAndUpdateOptions: function() {
      $.ajax({
        url: `${this.archiveApiUrl}/frames/aggregate/`,
        data: { }
      }).done(response => {
        this.allAggregatedOptions.sites = response.sites.sort();
        this.allAggregatedOptions.filters = response.filters.sort();
        this.allAggregatedOptions.instruments = response.instruments.sort();
        this.allAggregatedOptions.telescopes = response.telescopes.sort();
        this.allAggregatedOptions.obstypes = response.obstypes.sort();
        this.allAggregatedOptions.proposals = response.proposals.sort();
        this.updateOptions();
      });
    },
    updateFilters: function() {
      // Populate all the dropdowns from the aggregate endpoint.
      if (this.allAggregatedOptions.sites.length < 1) {
        this.getAllFiltersAndUpdateOptions();
      } else {
        this.updateOptions();
      }
    },
    getSortByFromOrdering: function() {
      // Return what field the data is currently sorted by given the `ordering` field in the query params
      let splitOrdering = _.split(this.queryParams.ordering, '-');
      return splitOrdering.pop();
    },
    getSortDescFromOrdering: function() {
      // Return whether the current sort order set in the `ordering` query param is descending
      return _.startsWith(this.queryParams.ordering, '-') ? true : false;
    },
    getOrderingFromSort: function(sortDesc, sortBy) {
      // Return what the `ordering` value in the query params should be given the sort order and the sort field
      let ordering = '';
      if (sortBy) {
        ordering = sortDesc ? `-${sortBy}` : sortBy;
      }
      return ordering;
    },
    onSortingChanged: function(event) {
      this.queryParams.ordering = this.getOrderingFromSort(event.sortDesc, event.sortBy);
      this.goToFirstPage();
      this.update();
    }
  }
};
</script>
<style scoped>
#date-range-picker {
  cursor: pointer;
}
</style>
<!-- 
Make table header position relative to avoid horizontal overflow. 
Should be fixed in boostrap-vue 2.22.0
https://github.com/bootstrap-vue/bootstrap-vue/issues/6326
-->
<style>
th {
  position: relative;
}

.daterangepicker .clearfix {
  display: inline-flex;
}

.daterangepicker .apply-cancel-buttons {
  text-align: right;
}

</style>

