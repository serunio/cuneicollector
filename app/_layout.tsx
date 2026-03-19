import {Stack} from "expo-router";
import {colors} from "@/styles";
import {useFonts} from "expo-font";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Sinacherib': require("./../assets/fonts/Sinacherib.ttf"),
    'Andika': require("./../assets/fonts/Andika/Andika-Regular.ttf")
  });
  return <Stack
    screenOptions={
      {
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.stroke,
        headerTitleStyle: {
          fontFamily: 'Andika'
        },
      }
    }>
    <Stack.Screen name={'index'} options={{title: 'Znaki'}}/>
    <Stack.Screen name={'draw'} options={{title: 'Rysuj', headerBackButtonDisplayMode: 'minimal'}}/>
  </Stack>;
}
