#!/usr/bin/env bash

BUILD_DIR="build"
FUNCTION_NAME="EpicFreeGamesScraper"
PROJECT_NAME="playground-228817"
FUNCTION_VERSION=`node -pe "require('./package.json').version"`

gcloud config set project ${PROJECT_NAME}

OLD_ARTIFACT_PATH="${BUILD_DIR}/${FUNCTION_NAME}-*.zip"
NEW_ARTIFACT_PATH="${BUILD_DIR}/${FUNCTION_NAME}-${FUNCTION_VERSION}.zip"

if [ -f "${OLD_ARTIFACT_PATH}" ]
then
    rm ${OLD_ARTIFACT_PATH}
fi

zip ${NEW_ARTIFACT_PATH} -r node_modules \
                         -r src
                         index.js

gcloud functions deploy ${FUNCTION_NAME} --runtime nodejs10 --trigger-http --source ${NEW_ARTIFACT_PATH} --timeout 15