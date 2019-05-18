#!/bin/bash
watchman watch-del-all
rm -rf node_modules
rm -rf package-lock.json
rm -rf yarn.lock
yarn cache clean
yarn install
#npm install
react-native link
rm -rf /tmp/metro-bundler-cache-*
rm -rf /tmp/haste-map-react-native-packager-*
cd ios
rm -rf Pods
rm -rf Podfile.lock
pod cache clean --all
pod install
