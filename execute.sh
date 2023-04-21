#!/bin/bash

# shellcheck disable=SC2034
param=$1
if [ "$1" = "-h" ]; then
  echo "Usage: ./execute.sh -d"
  echo "       ./execute.sh -p"
  echo "       ./execute.sh -h"
  echo "       ./execute.sh"
  echo "       -d: Development mode"
  echo "       -p: Production mode"
  echo "       -h: Help"
  echo "       No parameter: Production mode"
  exit 0
fi

NODE=$(node -v)
if [ "$NODE" != "v14.20.0" ]; then
  echo "NODE VERSION DISTINCT v14.20.0" >&2
  echo "RUN nvm install --v14.20.0"
  bash nvm install 14.20.0;
  exit 2;
fi

if [ "$1" = "" ]; then
  echo "No parameter: Production mode"
  MODE=PROD
  PORT=7000
fi
if [ "$1" = "-d" ]; then
  echo "Development mode"
  PORT=7001
  MODE=DEV
fi
if [ "$1" = "-p" ]; then
  echo "Production mode"
  PORT=7000
  MODE=PROD
fi

BRANCH=$(git branch | sed -nr 's/\*\s(.*)/\1/p')
echo "CURRENT BRANCH:" $BRANCH;
if [ "$BRANCH" != "main" ]; then
  echo "NO PROD BRANCH"
  PORT=7001
  MODE=DEV
fi

rm deploy.json;
echo
echo "***************************************"
echo "******Generating Run File******"
echo "***************************************"
cat <<EOF >deploy.json
{
  "apps": [
    {
      "name": "$MODE-AutoSys-Front:$PORT",
      "script": "./node_modules/next/dist/bin/next",
      "args": "start",
      "env": {
        "PORT": "$PORT"
      }
    }
  ]
}
EOF

echo
echo "***************************************"
echo "*++++++AutoSys Generation Date*********"
echo "***************************************"
# shellcheck disable=SC2046
# shellcheck disable=SC2005
echo $(date)

echo
echo "***************************************"
echo "*++++++Executing BUILD and run ********"
echo "***************************************"
rm -rf node_modules/
rm package-lock.json
npm install
npm run build

echo
echo "***************************************"
echo "****** Running AutoSys PM2 ************"
echo "***************************************"

echo

echo "Stop Module"
pm2 stop $MODE-AutoSys-Frontend:$PORT

echo "Stop Module"
pm2 delete $MODE-AutoSys-Frontend:$PORT

echo "Starting"
pm2 start deploy.json

echo "url: https://optimun.lapsystec.com/"
