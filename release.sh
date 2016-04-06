#!/bin/bash
set -e # exit with nonzero exit code if anything fails

echo "Cleaning dist git remote"
rm -rf ./dist/.git

echo "Building application"
grunt build

echo "Fetching latest build branch"
git fetch https://github.com/Kauabunga/cpx.git build

echo "Pushing compiled application to build branch"
if [ "$GH_TOKEN" = "" ]
then
   grunt buildcontrol:local &&
   echo "Release buildcontrol local success" || echo "Release buildcontrol local failed"
else
   ( grunt buildcontrol:local > /dev/null || git push --force --quiet "https://${GH_TOKEN}@github.com/Kauabunga/cpx.git" build > /dev/null ) &&
   echo "Release buildcontrol local travis success" || echo "Release buildcontrol local travis failed"
fi
