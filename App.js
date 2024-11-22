import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

// npx create-expo-app@latest --template blank
// npx expo install expo-screen-orientation

/*
  eas build:configure

  Build for local development on iOS or Android:
  eas build -p ios --profile development
  OR
  eas build -p android --profile development
*/

export default function App() {
  const [orientation, setOrientation] = useState();

  useEffect(() => {
    const getOrientation = async () => {
      const current = await ScreenOrientation.getOrientationAsync();
      const lock = await ScreenOrientation.getOrientationLockAsync();

      setOrientation({
        value: current,
        lock: lock,
      });
    };
    getOrientation();

    const orientationChangeSub =
      ScreenOrientation.addOrientationChangeListener(orientationChanged);

    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientationChangeSub);
    };
  }, []);

  const orientationChanged = (result) => {
    setOrientation({
      value: result.orientationInfo.orientation,
      lock: result.orientationLock,
    });
  };

  let buttonLayout = styles.row;
  if (
    orientation &&
    (orientation.value === ScreenOrientation.Orientation.PORTRAIT_UP ||
      orientation.value === ScreenOrientation.Orientation.PORTRAIT_DOWN)
  ) {
    buttonLayout = styles.column;
  }

  return (
    <View style={styles.container}>
      {orientation ? (
        <>
          <Text>Orientation: {orientation.value}</Text>
          <Text>Lock: {orientation.lock}</Text>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
      <View style={buttonLayout}>
        <Button
          title="Lock"
          onPress={async () =>
            ScreenOrientation.lockAsync(
              ScreenOrientation.OrientationLock.LANDSCAPE
            )
          }
        />
        <Button
          title="Unlock"
          onPress={async () => ScreenOrientation.unlockAsync()}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    alignSelf: "stretch",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  column: {
    alignItems: "center",
    justifyContent: "center",
  },
});
