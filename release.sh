#!/bin/bash
set -e # exit with nonzero exit code if anything fails

echo "Building application"
grunt build

echo "Fetching latest build branch"
git fetch https://github.com/Kauabunga/cpx.git build

echo "Pushing compiled application to build branch"
if [ "$GH_TOKEN" = "" ]
then
   grunt buildcontrol:local && git push https://github.com/Kauabunga/cpx.git build || echo "Release buildcontrol local failed"
else
   grunt buildcontrol:local && git push --force --quiet "https://${GH_TOKEN}@github.com/Kauabunga/cpx.git" build > /dev/null || echo "Release buildcontrol local travis failed"
fi
