<template>
  <b-table 
    :items="data"
    :fields="fields"
    selectable
    selected-variant=""
    :busy="!dataLoaded"
    show-empty
    hover
    @row-clicked="$emit('clicked-related-frame', $event)" >
    <template #cell(selected)="row">
      <b-form-checkbox :checked="itemInSelected(row.item.id)" @change="$emit('checked-related-frame', row, $event)" />
    </template>
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
    },
    selectedItems: {
      type: Array,
      required: false
    }
  },
  data: function() {
    return {
      fields: [
        {
          key: 'selected',
          label: '',
        },
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
    },
    itemInSelected: function(item) {
      return _.includes(this.selectedItems, item)
    }
  }
};
</script>
