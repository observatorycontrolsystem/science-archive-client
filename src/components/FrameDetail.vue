<template>
  <b-row>
    <b-col md="8" cols="12">
      <h5>Calibration and Catalog Frames</h5>
      <related-frames-table :frame-id="frameId" :selected-items="selectedItems" v-on="$listeners" />
    </b-col>
    <b-col md="4" cols="12">
      <frame-data :frame-id="frameId" v-if="userIsStaff"></frame-data>
      <b-button v-b-modal="modalId" variant="outline-secondary" class="my-1" block>View Headers</b-button>
      <b-button variant="outline-secondary" class="my-1" block v-if="userIsStaff">Open FITS in JS9</b-button>
      <headers-modal :modal-id="modalId" :frame-id="frameId" />
      <thumbnail v-if="hasThumbnail" :frame-id="frameId"></thumbnail>
      <div v-else>No preview available for this filetype</div>
    </b-col>
  </b-row>
</template>
<script>
import Thumbnail from '@/components/Thumbnail.vue';
import RelatedFramesTable from '@/components/RelatedFramesTable.vue';
import HeadersModal from '@/components/HeadersModal.vue';
import FrameData from '@/components/FrameData.vue';
// import openJs9Window from '@/util.js';

export default {
  name: 'FrameDetail',
  components: {
    Thumbnail,
    RelatedFramesTable,
    HeadersModal,
    FrameData
  },
  props: {
    frameId: {
      type: [String, Number],
      required: true
    },
    obstype: {
      type: String,
      required: true
    },
    selectedItems: {
      type: Array,
      required: false,
      default: () => {
        return [];
      }
    }
  },
  computed: {
    hasThumbnail: function() {
      return ['EXPOSE', 'DARK', 'SKYFLAT', 'BIAS', 'STANDARD', 'SPECTRUM', 'ARC', 'LAMPFLAT'].indexOf(this.obstype) >= 0;
    },
    modalId: function() {
      return `modal-id-${this.frameId}`;
    },
    userIsStaff: function() {
      return this.$store.state.profile.is_staff;
    }
  }
};
</script>
