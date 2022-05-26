#!/usr/bin/env bash

FUNCTION_NAME="EpicFreeGamesScraper"
PROJECT_NAME="playground-228817"

gcloud config set project ${PROJECT_NAME}

gcloud functions deploy ${FUNCTION_NAME} \
    --runtime nodejs12 \
    --trigger-http \
    --source src/ \
    --timeout 60
