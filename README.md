# renteasy

to run app make sure android emulator is on, navigate to frontend folder and run:
```
react-native run-android
```

if you have trouble running the react-native app follow this quick start guide to make sure you have all dependancies (android sdk etc.)
https://facebook.github.io/react-native/docs/getting-started (Follow the react native cli quickstart tab NOT expo cli quickstart)

npm dependancies run:

for react-navigation
```
npm install react-navigation
npm install react-native-gesture-handler
```

for react navigation material bottom tabs
```
npm install react-navigation-material-bottom-tabs react-native-paper
npm install react-native-vector-icons
```

for some reason need to use md icons from https://oblador.github.io/react-native-vector-icons/

for react-native maps api
```
npm install react-native-maps --save-exact
react-native link react-native-maps
```

for get geo location:
```
npm install @react-native-community/geolocation --save
react-native link @react-native-community/geolocation
```

for google autocomplete apis (NOT SURE WHICH ONE TO USE YET SO DO BOTH):
```
npm install react-native-google-places-autocomplete
npm install react-native-google-autocomplete
```

for entering fields
```
npm install react-native-material-dropdown
npm install --save react-native-text-input-mask
react-native link react-native-text-input-mask
```

for push notifications
```
npm install --save react-native-firebase
react-native link react-native-firebase
```

for slider
```
npm install --save @ptomasroos/react-native-multi-slider
react-native link @ptomasroos/react-native-multi-slider
```

for AsyncStorage
```
npm install @react-native-community/async-storage
```

for checkbox on signup and profile pages
```
npm install react-native-checkbox-form --save
```

for stack navigator
```
npm install react-navigation-stack
```


for image picker
```
npm install --save image-picker
```

for some random ui elements
```
npm install react-native-elements --save
npm install react-native-autogrow-input
```

for event-listener
```
npm install react-native-event-listeners
```

if an error similar to below is seen when running ```react-native run-android```
```
FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:transformDexArchiveWithDexMergerForDebug'.
> java.io.IOException: Unable to delete directory C:\Users\user\Documents\3rdYear\CPEN321\CPEN321\frontend\android\app\build\intermediates\transforms\dexMerger\debug.
```
navigate to frontend/android/app/build, delete contents of build directory and try running again

# Backend

to run mongo and server
```
sudo service mongod start
CPEN321/backend/node index.js
```

for geolocation handling
```
https://www.npmjs.com/package/geolib
npm install geolib
```

for multer
```
npm install multer
```

for firebase admin sdk
```
https://firebase.google.com/docs/admin/setup
npm install firebase-admin --save
```

```
ssh renteradmin@renterassurance.westus.cloudapp.azure.com
Pass: Renterassurance!
```
