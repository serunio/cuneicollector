import { api } from '@/api';
import { colors } from '@/styles';
import { Cunei } from "@/types";
import { ctxAuth } from "@/utils/AuthContext";
import { Skia } from "@shopify/react-native-skia";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Checkbox } from "react-native-paper";
import { useSharedValue } from "react-native-reanimated";
import Button from '../../components/Button';
import Tablet from '../../components/Tablet';
import Text from '../../components/Text';

export default function Draw() {
  // const [path, setPath] = useState<string>("")
  const path = useSharedValue(Skia.Path.Make());
  const {id} = useLocalSearchParams()
  const navigation = useNavigation()
  const [cunei, setCunei] = useState<Cunei>()

  const [autoNext, setAutoNext] = useState<"checked" | "unchecked" | "indeterminate">('checked')

  const {user} = useContext(ctxAuth)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (<><Text size='small'>Get next on submit</Text><Checkbox status={autoNext} onPress={(e) => setAutoNext(autoNext === 'checked' ? 'unchecked' : 'checked')}/></>)
    })
  })

  useEffect(() => {
    fetchCunei()
  }, [id])

  async function fetchCunei() {
    try {
      const response = await fetch(api + '/cunei/' + id, {method: 'GET'})
      const data = await response.json()
      setCunei(data)
    } catch (e) {
      console.log(e)
    }
  }

  async function getNext() {
    try {
      const response = await fetch(`${api}/cunei/next`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${user?.token}`
        }
      })
      const data = await response.json()
      console.log(data);
      router.setParams({id: (data.id).toString()})
      return
    } catch (e) {
      console.log(e)
    }
  }

  async function sendSubmission() {
    try {
      const bounds = path.value.getBounds()
      path.value.offset(-bounds.x, -bounds.y)
      const body = {
        cuneiId: cunei?.id,
        submission: path.value.toSVGString()
      }
      const response = await fetch(`${api}/submissions`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${user?.token}`,
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(body)
      })
      clear()
    } catch (e) {
      console.log(e)
    }
    if (autoNext === "checked")
      await getNext()
  }

  function clear() {
    path.value = Skia.Path.Make()
  }

  return (
    <View style={styles.container}>
      {
        cunei ? <View>
          <Text size={'regular'} center>{cunei?.phonetic}</Text>
          <View>
            <Text size={'cuneiBig'} center>{cunei?.unicode}</Text>
          </View>
        </View> : <><Text size={'regular'}>error</Text></>
      }
      <View style={{flex: 15}}>
        <Tablet path={path}/>
      </View>
      <View style={{flex: 2, flexDirection: 'row', gap: 10,}}>
        <Button onPress={clear} type={"secondary"} text={'Clear'}/>
        <Button onPress={sendSubmission} type={"primary"} text={'Submit'}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 50,
    backgroundColor: colors.background,
    gap: 20
  },
  icon: {
    color: colors.stroke
  }
});
