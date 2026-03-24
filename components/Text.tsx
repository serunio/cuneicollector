import {StyleSheet, Text as NativeText, TextProps as NativeTextProps} from 'react-native'
import {colors, fontSizes} from "@/styles";
import {useFonts} from "expo-font";

interface TextProps extends NativeTextProps {
  size: 'small' | 'regular' | 'header' | 'cuneiSmall' | 'cuneiBig',
  center?: boolean
}

export default function Text({children, size, center=false}:TextProps) {
  const [loaded, error] = useFonts({
    'Sinacherib': require("./../assets/fonts/Sinacherib.ttf"),
    'Andika': require("./../assets/fonts/Andika/Andika-Regular.ttf")
  });
  const styles = StyleSheet.create({
    text: {
      fontSize: fontSizes[size],
      color: colors.stroke,
      fontFamily: size === 'cuneiBig' || size === 'cuneiSmall' ? 'Sinacherib' : 'Andika',
      alignSelf: center ? 'center' : 'auto',
    }
  })
    return (<NativeText style={styles.text}>{loaded ? children : null}</NativeText>)
}

