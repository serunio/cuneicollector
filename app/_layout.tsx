import {Stack} from "expo-router";
import {colors} from "@/styles";
import {useFonts} from "expo-font";
import {PaperProvider} from "react-native-paper";
import {ctxAuth as AuthContext} from '@/utils/AuthContext'
import {useState} from "react";
import {User} from "@/types";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Sinacherib': require("./../assets/fonts/Sinacherib.ttf"),
    'Andika': require("./../assets/fonts/Andika/Andika-Regular.ttf")
  });
  const [user, setUser] = useState<User | null>(null)
  return <PaperProvider>
    <AuthContext value={{user, setUser}}>
      <Stack
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
        <Stack.Protected guard={user !== null}>
          <Stack.Screen name={'(tabs)'} options={{headerShown: false}}/>
          <Stack.Screen name={'index'} options={{headerShown: false}}/>
          {/*<Stack.Screen name={'list'} options={{title: 'Znaki'}}/>*/}
          <Stack.Screen name={'draw/[id]'}  options={{title: 'Rysuj', headerBackButtonDisplayMode: 'minimal'}}/>
        </Stack.Protected>
        <Stack.Protected guard={user === null}>
          <Stack.Screen name={'login'} options={{headerShown: false}}/>
        </Stack.Protected>
      </Stack>
    </AuthContext>
  </PaperProvider>

}
