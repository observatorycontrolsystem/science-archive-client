#!/bin/sh

CONFIG_FILE_PATH=/app/config/config.json

check_and_set_config() {
    env_var_value=$1
    config_key=$2
    config_file_path=$3
    if [[ -n "${env_var_value}" ]]; then
        echo "Setting ${config_key} to ${env_var_value}"
        # Check if this is a JSON object encoded as a string
        if echo "${env_var_value}" | grep -q '{'; then
            export value=${env_var_value}
            contents=$(jq '.'${config_key}' = ($ENV.value | fromjson)' ${config_file_path})
        else
            contents=$(jq '.'${config_key}' = "'${env_var_value}'"' ${config_file_path})
        fi
        echo ${contents} > ${config_file_path}
    fi
}

if [ ! "$DISABLE_OVERWRITE_APP_CONFIG_IN_ENTRYPOINT" = "true" ]
then
    check_and_set_config "${VUE_APP_OBSERVATION_PORTAL_API_URL}" "observationPortalApiUrl" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_ARCHIVE_API_URL}" "archiveApiUrl" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_SIMBAD_SERVICE_URL}" "simbadServiceUrl" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_THUMBNAIL_SERVICE_URL}" "thumbnailServiceUrl" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_NAVBAR_BRAND_URL}" "navbarBrandUrl" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_BRAND_IMAGE_LARGE}" "brandImageLarge" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_BRAND_IMAGE_SMALL}" "brandImageSmall" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_BRAND_IMAGE_ALT_TEXT}" "brandImageAltText" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_DOCUMENTATION_URL}" "documentationUrl" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_ORGANIZATION_HOMEPAGE_URL}" "organizationHomepageUrl" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_ORGANIZATION_HOMEPAGE_TEXT}" "organizationHomepageText" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_COPYRIGHT_ORGANIZATION}" "copyrightOrganization" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_TERMS_OF_SERVICE_URL}" "termsOfServiceUrl" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_PRIVACY_POLICY_URL}" "privacyPolicyUrl" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_FEEDBACK_EMAIL}" "feedbackEmail" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_GITHUB_API_URL}" "githubApiUrl" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_API_DOCUMENTATION_URL}" "apiDocumentationUrl" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_GENERAL_DOCUMENTATION_URL}" "generalDocumentationUrl" "${CONFIG_FILE_PATH}"
    check_and_set_config "${VUE_APP_REDUCTION_LEVEL_OPTIONS}" "reductionLevelOptions" "${CONFIG_FILE_PATH}"
fi

exec nginx -g 'daemon off;'
