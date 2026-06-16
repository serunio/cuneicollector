import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useContext} from "react";
import {StyleSheet, View} from "react-native";
import {colors} from "@/styles";
import {ctxAuth} from "@/utils/AuthContext";
import {api} from "@/api";
import {getAuth, getIdToken, GoogleAuthProvider, signInWithCredential} from '@react-native-firebase/auth'
import {jwtDecode} from 'jwt-decode'
import {JWT, User} from '@/types'

export default function Login() {
  const {user, setUser} = useContext(ctxAuth)

  if(setUser === null)
    return <></>

  GoogleSignin.configure({webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID});
  const signIn = async () => {
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
        const token = await res.text()
        const decoded = jwtDecode<JWT>(token)
        const user:User = {
          admin: decoded.admin === 1,
          name: decoded.name,
          email: decoded.email,
          uid: decoded.uid,
          token: token
        }
        setUser(user);
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
  };



  return <>
    <View style={styles.background}>
      <GoogleSigninButton onPress={signIn}/>
    </View>
  </>;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    padding: '40%'
  }
})
