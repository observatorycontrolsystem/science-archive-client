<template>
  <div>
    Home content
    {{ urls }}
  </div>
</template>

<script>
export default {
  name: 'Home',
  computed: {
    urls: function() {
      return this.$store.state.urls;
    }
  }
};
</script>
