import {
  GoogleSignin,
  GoogleSigninButton, isErrorWithCode, isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useState} from "react";
import {Button, View} from "react-native";

export default function Login() {

  const [userInfo, setUserInfo] = useState({})

  GoogleSignin.configure();
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        setUserInfo(response.data);
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
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

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  return <>
    <View>
      <GoogleSigninButton onPress={signIn}/>
      <Button title={"info"} onPress={() => console.log(userInfo)} />
      <Button title={"clear"} onPress={signOut} />
    </View>
  </>;
}

