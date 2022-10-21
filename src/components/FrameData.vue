<template>
 <b-table 
    :items="headerItems"
    :fields="fields"
    :busy="!dataLoaded"
 >
 </b-table>
</template>
<script>
import { OCSMixin } from 'ocs-component-lib';

export default {
    name: 'FrameData',
    mixins: [OCSMixin.getDataListMixin],
    props: {
        frameId: {
            type: [String, Number],
            required: true
        }
    },
    data: function() {
        return {
            fields: [
                {
                    key: 'L1FWHM',
                    label: 'FWHM'
                },
                {
                    key: 'FOCOBOFF',
                    label: 'Defocus'
                },
                {
                    key: 'PNTOFST',
                    label: 'Pointing Offset'
                }
            ],
        };
    },
    computed: {
        headerItems: function() {
            let headers = [];
            for (const keyword of this.data.fields) {
                console.log(keyword);
                headers.push({ key: keyword.key, value: this.data.data[keyword.key] });
            }
            return headers;
        }
    },
    methods: {
        initializeDataEndpoint: function() {
            return `${this.$store.state.urls.archiveApiUrl}/frames/${this.frameId}/headers/`;
        }
    }
}
</script>
