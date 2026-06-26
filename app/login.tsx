import { api } from "@/api";
import Text from '@/components/Text';
import { colors } from "@/styles";
import { JWT, User } from '@/types';
import { ctxAuth } from "@/utils/AuthContext";
import { getAuth, getIdToken, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { jwtDecode } from 'jwt-decode';
import { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Login() {
  const {user, setUser} = useContext(ctxAuth)
  const [loading, setLoading] = useState<boolean>(false)

  if(setUser === null)
    return <></>

  GoogleSignin.configure({webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID});
  const signIn = async () => {
    setUser(null)
    setLoading(true)
    GoogleSignin.signOut();
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const auth = getAuth();
        const credential = GoogleAuthProvider.credential(response.data.idToken);
        const userCredential = await signInWithCredential(auth, credential);
        const firebaseIdToken = await getIdToken(userCredential.user);
        const res = await fetch(api + '/users/login', {
          headers: {
            "Authorization": "Bearer " + firebaseIdToken
          }
        })
        if (res.ok) {
          const token = await res.text()
          const decoded = jwtDecode<JWT>(token)
          const user:User = {
            admin: decoded.admin,
            name: decoded.name,
            email: decoded.email,
            uid: decoded.uid,
            token: token,
            isNew: decoded.isNew
          }
          console.log(user)
          setUser(user);
        }
        else {
          console.log("Login failed")
          console.log(await res.text())
        }
        
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      console.log(error)
      if (isErrorWithCode(error)) {
        console.log(error)
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
    setLoading(false)
  };



  return <>
    <View style={styles.background}>
      <GoogleSigninButton onPress={signIn}/>
      <Text size='regular'>{loading ? "Loading..." : ""}</Text>
    </View>
  </>;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: '40%'
  }
})
