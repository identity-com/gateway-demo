#!/usr/bin/env bash
set -e
set -u

FOLDER="/protected-transfer"

if [ "${STAGE}" == "prod" ]; then
  DISTRIBUTION=E2S4Y0ZV7EAMWM
  BUCKET=demo.identity.com
elif [ ${STAGE} == "preprod" ]; then
  DISTRIBUTION=???
  BUCKET=demo-preprod.identity.com
elif [ ${STAGE} == "dev" ]; then
  DISTRIBUTION=E1SU4WO39BJJ5E
  BUCKET=demo-dev.identity.com
fi

npx deploy-aws-s3-cloudfront --non-interactive --react --bucket ${BUCKET} --destination ${FOLDER} --distribution ${DISTRIBUTION}
