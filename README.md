# renteasy

to run app make sure android emulator is on, navigate to frontend folder and run:
```
react-native run-android
```

if you have trouble running the react-native app follow this quick start guide to make sure you have all dependancies (android sdk etc.)
https://facebook.github.io/react-native/docs/getting-started (Follow the react native cli quickstart tab NOT expo cli quickstart)

npm dependancies run:

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

if an error similar to below is seen when running ```react-native run-android```
```
FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:transformDexArchiveWithDexMergerForDebug'.
> java.io.IOException: Unable to delete directory C:\Users\user\Documents\3rdYear\CPEN321\CPEN321\frontend\android\app\build\intermediates\transforms\dexMerger\debug.
```
navigate to frontend/android/app/build, delete contents of build directory and try running again
