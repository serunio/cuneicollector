import {GestureResponderEvent, Pressable, StyleSheet} from "react-native";
import {colors, fontSizes} from '@/styles'
import Text from './Text'

export type ButtonType = "primary" | "secondary" | "delete"
type ButtonProps = {
  type: ButtonType,
  text: string,
  onPress: ((event: GestureResponderEvent) => void) | null | undefined
}

export default function Button({type, text, onPress}: ButtonProps) {
  return <Pressable onPress={onPress}
                    style={({pressed}) => [background(pressed, type), styles.background]}>
    <Text size={'regular'} center>
      {text}
    </Text>
  </Pressable>
}

const background = (pressed: boolean, type: ButtonType): { backgroundColor: string } => {
  return {
    backgroundColor:
      !pressed && type === 'primary' ? colors.primary :
      !pressed && type === 'secondary' ? colors.gray :
      !pressed && type === 'delete' ? 'red' :
      pressed && type === 'primary' ? colors.primaryClicked :
      pressed && type === 'secondary' ? colors.grayClicked : '#fff'
  }

}

const styles = StyleSheet.create({
  background: {
    borderRadius: 6,
    padding: 5,
    flexGrow: 1,
    justifyContent: 'center'
  },
  text: {
    color: colors.stroke,
    alignSelf: 'center',
    fontSize: fontSizes.regular,
    fontFamily: 'Andika'
  }
})