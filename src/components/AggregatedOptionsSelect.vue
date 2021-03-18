<template>
  <b-form-group :id="'input-group-' + id">
    <template #label>
      <slot name="label">{{ label }}</slot>
    </template>
    <b-form-select :id="'input-' + id" :value="value" @input="onUpdate">
      <template #first>
        <slot name="first">
          <b-form-select-option :value="''">All</b-form-select-option>
        </slot>
      </template>
      <b-form-select-option-group v-if="placeInOptionGroup" :label="optionGroupLabel">
        <b-form-select-option v-for="available in options.available" :key="available" :value="available">
          {{ available }}
        </b-form-select-option>
        <b-form-select-option v-if="options.unavailable.length > 0" :value="''" disabled>---</b-form-select-option>
        <b-form-select-option v-for="unavailable in options.unavailable" :key="unavailable" :value="unavailable">
          {{ unavailable }}
        </b-form-select-option>
      </b-form-select-option-group>
      <template v-else>
        <b-form-select-option v-for="available in options.available" :key="available" :value="available">
          {{ available }}
        </b-form-select-option>
        <b-form-select-option v-if="options.unavailable.length > 0" :value="''" disabled>---</b-form-select-option>
        <b-form-select-option v-for="unavailable in options.unavailable" :key="unavailable" :value="unavailable">
          {{ unavailable }}
        </b-form-select-option>
      </template>
    </b-form-select>
  </b-form-group>
</template>
<script>
export default {
  name: 'AggregatedOptionsSelect',
  props: {
    options: {
      type: Object,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    placeInOptionGroup: {
      type: Boolean
    },
    optionGroupLabel: {
      type: String,
      default: 'Options'
    }
  },
  methods: {
    onUpdate: function(event) {
      this.$emit('input', event);
    }
  }
};
</script>
