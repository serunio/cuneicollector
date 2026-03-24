import {Pressable, StyleSheet, View} from "react-native";
import {Cunei} from "@/types";
import Text from "@/components/Text";
import {colors} from '@/styles'
import {Link} from "expo-router";
import {api} from "@/api";

export default function CuneiListElement({cunei}: { cunei: Cunei }) {
  return (
    <Link href={ {pathname: '/draw', params: {id: cunei.id}} } asChild>
      <Pressable style={styles.background}>
        <View style={{flex: 3}}>
          <Text size={'cuneiSmall'} center>
            {cunei.unicode}
          </Text>
        </View>
        <View style={{flex: 5, justifyContent: 'space-evenly'}}>
          <View>
            <Text size={'regular'}>
              {cunei.phonetic}
            </Text>
            <View>
              <View style={{flexDirection: 'row'}}>
                <Text size={'small'}>Twoje próbki: </Text>
                <Text size={'small'}>34/50</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text size={'small'}>Wszystkie próbki: </Text>
                <Text size={'small'}>78</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>

  )
}

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

async function deleteCunei(cunei:Cunei) {
  try {
    await fetch(api + '/cunei/' + cunei.id, {method: 'DELETE'})
    console.log(`deleted cunei ${cunei.phonetic} (id ${cunei.id})`)
  }
  catch (e) {
    console.log(e)
  }
}