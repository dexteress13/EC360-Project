#!/bin/bash
# Runs ON THE EC2 SERVER (sent by the pipeline through AWS Systems Manager).
# Needs two variables, exported by the pipeline before this script: BUCKET, AWS_REGION.
# Downloads the latest successful build from S3 and switches nginx over to it.
set -euo pipefail

SITE_DIR="${SITE_DIR:-/var/www/revmatch}"
KEEP=3

KEY=$(aws s3 cp "s3://${BUCKET}/builds/latest.txt" - --region "${AWS_REGION}" | tr -d '[:space:]')
echo "Latest successful build in S3: ${KEY}"

TMP=$(mktemp -d)
aws s3 cp "s3://${BUCKET}/builds/${KEY}" "${TMP}/build.zip" --region "${AWS_REGION}"

RELEASE="${SITE_DIR}/releases/${KEY%.zip}"
rm -rf "${RELEASE}"
mkdir -p "${RELEASE}"
unzip -q "${TMP}/build.zip" -d "${RELEASE}"
chmod -R a+rX "${SITE_DIR}"

# Switch the live site to the new release (nginx serves ${SITE_DIR}/current).
ln -sfn "${RELEASE}" "${SITE_DIR}/current"
echo "Now live: ${RELEASE}"

# Keep only the newest releases so the disk does not fill up.
ls -1dt "${SITE_DIR}"/releases/* | tail -n +$((KEEP + 1)) | xargs -r rm -rf
rm -rf "${TMP}"
