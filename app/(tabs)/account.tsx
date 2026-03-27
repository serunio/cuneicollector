import {StyleSheet, View, Text, Button} from "react-native";
import {colors} from "@/styles";
import {useContext} from "react";
import {ctxAuth} from "@/utils/AuthContext";
import {GoogleSignin, GoogleSigninButton} from "@react-native-google-signin/google-signin";


export default function Account() {
  const {user, setUser} = useContext(ctxAuth)

  GoogleSignin.configure()
  if(user === null || setUser === null)
    return null
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const getInfo = async () => {
    try {
      const tokensResponse = GoogleSignin.getCurrentUser()
      console.log('--------------------------------------------------------------------------------------------')
      console.log(tokensResponse?.user.id)
    }
    catch (e) {
      console.error(e)
    }
  }

  return <View style={styles.background}>
    <Text>{user.name}</Text>
    <Button title={'logout'} onPress={signOut}/>
    <Button title={'get info'} onPress={getInfo}/>
  </View>
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    padding: '40%'
  }
})