
grunt build && grunt buildcontrol:local

if [ "$GH_TOKEN" = "" ]
then
   git push https://github.com/Kauabunga/cpx.git build
else
   git push --quiet "https://${GH_TOKEN}@github.com/Kauabunga/cpx.git" build > /dev/null
fi
