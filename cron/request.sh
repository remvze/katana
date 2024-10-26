#!/bin/sh

if [ -z "$TARGET_URL" ]; then
  echo "TARGET_URL is not set. Exiting."
  exit 1
fi

curl -X GET -H "Authorization: Bearer ${EXPIRATION_SECRET}" "$TARGET_URL"