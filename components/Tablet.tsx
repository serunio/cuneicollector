import React from 'react';
import {Canvas, Path, SkPath} from "@shopify/react-native-skia";
import {Gesture, GestureDetector, GestureHandlerRootView,} from 'react-native-gesture-handler';
import {StyleSheet, View} from 'react-native';
import {colors} from '@/styles'
import {SharedValue} from "react-native-reanimated";

export default function Tablet({path, drawingEnabled = true}:{path:SharedValue<SkPath>, drawingEnabled?:boolean}) {

  const pan = Gesture.Pan()
    .minDistance(0)
    .onStart((event) => {

      const p = path.value.copy();
      p.moveTo(Math.round(event.x), Math.round(event.y))
      path.value = p
    })
    .onUpdate((event) => {
      const {x, y} = path.value.getLastPt()
      if (Math.abs(x-event.x) < 5 && Math.abs(y-event.y) < 5)
        return
      const p = path.value.copy();
      p.lineTo(Math.round(event.x), Math.round(event.y))
      path.value = p
    })

  const gestureDisable = Gesture.Pan();

  return (
      <GestureHandlerRootView style={styles.full}>
        <GestureDetector gesture={drawingEnabled ? pan : gestureDisable}>
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
