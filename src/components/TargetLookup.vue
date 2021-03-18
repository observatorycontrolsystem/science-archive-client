<template>
  <b-form-group id="input-group-point">
    <template #label>
      Point
      <sup
        v-b-tooltip.hover.right
        title="Searching by point is usually the most effective method as it will find
        all frames containing an RA/Dec independent of the name given in the OBJECT header. This will not work for solar
        system objects. Sexagesimal or degrees. You may also click the magnification glass to fetch RA/Dec from online
        sources (such as SIMBAD or NED) by object name."
        >
          ?
        </sup>
    </template>
    <b-input-group>
      <b-form-input v-model="objectName" placeholder="Search sources"></b-form-input>
      <b-input-group-append>
        <b-button :disabled="!objectName" @click="lookupTarget"><i class="fas fa-search"></i></b-button>
      </b-input-group-append>
    </b-input-group>
    <b-input-group>
      <b-form-input v-model="point.x" placeholder="RA" @input="onPointUpdate"></b-form-input>
      <b-form-input v-model="point.y" placeholder="Dec" @input="onPointUpdate"></b-form-input>
    </b-input-group>
  </b-form-group>
</template>
<script>
import $ from 'jquery';
import { wktToGeoJSON } from '@terraformer/wkt';
import { OCSUtil } from 'ocs-component-lib';

export default {
  name: 'TargetLookup',
  props: {
    // This should be a valid WTK representation of GeoJSON
    value: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      objectName: '',
      point: this.parsePoint()
    };
  },
  methods: {
    parsePoint: function() {
      if (this.value) {
        let point = wktToGeoJSON(this.value);
        return {
          x: point.coordinates[0].toString(),
          y: point.coordinates[1].toString()
        };
      } else {
        return { x: '', y: '' };
      }
    },
    lookupTarget: function() {
      if (this.objectName) {
        $.ajax({
          url: `${this.$store.state.urls.simbadService}/${this.objectName}`
        })
          .done(response => {
            this.point.x = response.ra.replace(/ /g, ':');
            this.point.y = response.dec.replace(/ /g, ':');
            this.onPointUpdate();
          })
          .fail(response => {
            // TODO: Display that there was an error
            console.log('Error getting result from simbad', response);
          });
      }
    },
    getPointAsDecimal: function() {
      return {
        x: OCSUtil.sexagesimalRaToDecimal(this.point.x),
        y: OCSUtil.sexagesimalDecToDecimal(this.point.y)
      };
    },
    onPointUpdate: function() {
      // TODO: Check that both points x and y are filled out, and that the decimal
      // representations are valid numbers

      // Emit a string that will go into the url for the covers param
      let pointAsDecimal = this.getPointAsDecimal();
      this.$emit('input', `POINT(${pointAsDecimal.x} ${pointAsDecimal.y})`);
    }
  }
};
</script>
