#!/bin/bash
watchman watch-del-all
rm -rf node_modules
rm -rf package-lock.json
rm -rf yarn.lock
yarn cache clean
yarn install
rm -rf /tmp/metro-bundler-cache-*
rm -rf /tmp/haste-map-react-native-packager-*
cd ios
rm -rf Pods
rm -rf Podfile.lock
react-native link
pod cache clean --all
pod install