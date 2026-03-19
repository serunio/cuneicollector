import React from 'react';
import {Canvas, Path} from "@shopify/react-native-skia";
import {Gesture, GestureDetector, GestureHandlerRootView,} from 'react-native-gesture-handler';
import {StyleSheet, View} from 'react-native';
import {colors} from '@/styles'

export default function Tablet({path, setPath}:{path:string, setPath:React.Dispatch<React.SetStateAction<string>>}) {

  const pan = Gesture.Pan()
    .minDistance(0)
    .onStart((event) => {
      setPath((prevState) => prevState + `M${Math.round(event.x)} ${Math.round(event.y)}`)
    })
    .onUpdate((event) => {
      setPath((prevState) => prevState + `L${Math.round(event.x)} ${Math.round(event.y)}`)
    })
    .runOnJS(true);

  return (
      <GestureHandlerRootView style={styles.full}>
        <GestureDetector gesture={pan}>
          <View key='canvas' style={styles.tablet}>
            <Canvas style={styles.full}>
              <Path
                path={path}
                color={colors.tabletStroke}
                style={"stroke"}
                strokeJoin={"round"}
                strokeWidth={5}
                strokeCap={"round"}
              />
            </Canvas>
          </View>
        </GestureDetector>
      </GestureHandlerRootView>

  );
}

const styles = StyleSheet.create({
  tablet: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.tablet,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.25), -4px -4px 2px rgba(0, 0, 0, 0.25) inset'
  },

  full: {width: '100%', height: '100%'}
});
