<template>
       <div class="footer text-center mt-auto pt-2">
      Copyright <span class="align-top"><i class="far fa-copyright fa-xs"></i></span> {{ year }} {{ copyright-organization }}. All rights reserved.
      <ul>
        <li><a class="black" title="terms of service" :href="terms-of-service-url"></a></li>
        <li><a class="black" title="privacy policy" :href="privacy-policy-url">Privacy Policy</a></li>
        <li><a class="black" title="feedback" :href="feedback-email">Feedback</a></li>
        <li>
          <a class="black" title="github" :href="github-api-url">
            <i class="fab fa-github"></i> View API on Github
          </a>
        </li>
        <li><a class="black" title="API" :href="science-archive-url">API</a></li>
        <li><a class="black" title="API documentation" :href="api-documentation-url">API Documentation</a></li>
        <li>
          <a class="black" title="general documentation" :href="general-documentation-url">General Documentation</a>
        </li>
      </ul>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    name: "ArchiveFooter",
    props: {
        copyrightOrganization: {
            type: String,
            required: false,
            default: ''
        },
        termsOfServiceUrl: {
            type: String,
            required: false,
            default: ''
        },
        privacyPolicyUrl : {
            type: String,
            required: false,
            default: ''
        },
        feedbackEmail: {
            type: String,
            required: false,
            default: ''
        },
        githubApiUrl: {
            type: String,
            required: false,
            default: ''
        },
        scienceArchiveUrl: {
            type: String,
            required: false,
            default: ''
        },
        apiDocumentationUrl: {
            type: String,
            required: false,
            default: ''
        },
        generalDocumentationUrl: {
            type: String,
            required: false,
            default: ''
        }
    },
    data: function() {
        return {
        year: moment.utc().format('YYYY')
        };
    }
}
</script>

