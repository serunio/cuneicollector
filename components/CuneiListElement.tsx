import {Pressable, StyleSheet, View} from "react-native";
import {Cunei} from "@/types";
import Text from "@/components/Text";
import {colors} from '@/styles'
import {Link} from "expo-router";
import {api} from "@/api";
import Button from "@/components/Button";
import {useContext} from "react";
import {ctxAuth} from "@/utils/AuthContext";

export default function CuneiListElement({cunei, admin=false}: { cunei: Cunei, admin?: boolean }) {

  const styles = StyleSheet.create({
    background: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      borderColor: colors.background,
      borderBottomColor: colors.gray,
      borderStyle: 'solid',
      borderWidth: 2
    }
  })

  const {user} = useContext(ctxAuth)

  async function chooseCunei() {
    try {
      const response = await fetch(api + '/cunei/choose/' + cunei.id, {method: 'POST', headers: {
          "Authorization": `Bearer ${user?.token}`
        }})
      const text = await response.text()
      console.log(text)
      if (response.status === 200)
        console.log(`chosen cunei ${cunei.phonetic} (id ${cunei.id})`)
    } catch (e) {
      console.log(e)
    }
  }
  const numbers =
    (<View>
    <View style={{flexDirection: 'row'}}>
      <Text size={'small'}>Twoje próbki: </Text>
      <Text size={'small'}>{cunei.user_count}/50</Text>
    </View>
    <View style={{flexDirection: 'row'}}>
      <Text size={'small'}>Wszystkie próbki: </Text>
      <Text size={'small'}>{cunei.total_count}</Text>
    </View>
  </View>)

  const deleteButton =
    (<View style={{flex: 2}}>
      <Button type={'primary'} text={'Choose'} onPress={chooseCunei}/>
    </View>)

  return (
    <Link href={{pathname: '/draw/[id]', params: {id: cunei.id}}} asChild>
      <Pressable style={styles.background}>
        <View style={{flex: 3, justifyContent: 'center'}}>
          <Text size={'cuneiSmall'} center>
            {cunei.unicode}
          </Text>
        </View>
        <View style={{flex: 5, justifyContent: 'space-evenly'}}>
          <View>
            <Text size={'regular'}>
              {cunei.phonetic}
            </Text>

            {!admin ? numbers : null}

          </View>
        </View>
        {admin ? deleteButton : null}
      </Pressable>
    </Link>

  )

}



async function deleteCunei(cunei: Cunei) {
  try {
    await fetch(api + '/cunei/' + cunei.id, {method: 'DELETE'})
    console.log(`deleted cunei ${cunei.phonetic} (id ${cunei.id})`)
  } catch (e) {
    console.log(e)
  }
}

