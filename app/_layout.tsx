import { api } from "@/api";
import { colors } from "@/styles";
import { User } from "@/types";
import { ctxAuth as AuthContext } from '@/utils/AuthContext';
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Sinacherib': require("./../assets/fonts/Sinacherib.ttf"),
    'Andika': require("./../assets/fonts/Andika/Andika-Regular.ttf")
  });
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    (async () => {
      console.log('me')
      const token = user?.token

      if (!token) {
        setUser(null)
        return
      }

      const res = await fetch(api + "/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(res)

      if (!res.ok) {
        setUser(null)
        return
      }
    })()
}, [])

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
          <Stack.Screen name={'draw/[id]'}  options={{title: 'Draw', headerBackButtonDisplayMode: 'minimal'}}/>
        </Stack.Protected>
        <Stack.Protected guard={user === null}>
          <Stack.Screen name={'login'} options={{headerShown: false}}/>
        </Stack.Protected>
      </Stack>
    </AuthContext>
  </PaperProvider>

}
