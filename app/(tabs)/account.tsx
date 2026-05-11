import {StyleSheet, View} from "react-native";
import {colors} from "@/styles";
import {useContext} from "react";
import {ctxAuth} from "@/utils/AuthContext";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import Button from "@/components/Button";
import Text from '@/components/Text'

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

  return <View style={styles.background}>
    <Text size={'regular'} center>{user.name}</Text>
    <View style={{paddingHorizontal: 100}}>
      <Button type={'delete'} text={'Logout'} onPress={signOut}/>
    </View>

  </View>
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center'

  }
})