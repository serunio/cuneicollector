import { api } from "@/api";
import Button from "@/components/Button";
import Tablet from "@/components/Tablet";
import { colors } from '@/styles';
import { Cunei } from "@/types";
import { Skia } from "@shopify/react-native-skia";
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue } from "react-native-reanimated";
import Text from '../../components/Text';

export default function Guesser() {

    const path = useSharedValue(Skia.Path.Make());
    const [guessedCunei, setGuessedCunei] = useState<Cunei[]>([])

    function clear() {
        path.value = Skia.Path.Make()
    }

    async function findCunei() {
        try {
          const bounds = path.value.getBounds()
          path.value.offset(-bounds.x, -bounds.y)
          const body = {
            submission: path.value.toSVGString()
          }
          await fetch(`${api}/cunei/guess`, {
            method: 'POST',
            headers: {
              "Content-Type": 'application/json'
            },
            body: JSON.stringify(body)
          })
          .then(r => r.json())
          .then(c => setGuessedCunei(c))
        } catch (e) {
          console.log(e)
        }
    }

    return <>
        <View style={styles.container}>
              {
                <View>
                  <View style={{flexDirection: 'row', gap: 20}}>
                    {guessedCunei.map((c, i) => (<Text key={i} size={'cuneiSmall'} center>{c.unicode}</Text>))}
                  </View>
                </View> 
              }
              <View style={{flex: 15}}>
                <Tablet path={path}/>
              </View>
              <View style={{flex: 2, flexDirection: 'row', gap: 10,}}>
                <Button onPress={clear} type={"secondary"} text={'Clear'}/>
                <Button onPress={findCunei} type={"primary"} text={'Submit'}/>
              </View>
            </View>
    </>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 50,
    backgroundColor: colors.background,
    gap: 20
  }})