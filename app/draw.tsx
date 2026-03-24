import React, {useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Tablet from '../components/Tablet'
import {colors} from '@/styles'
import Button from '../components/Button'
import Text from './../components/Text'
import {useLocalSearchParams, useNavigation, router} from "expo-router";
import {api} from '@/api'
import {Cunei} from "@/types";
import {Menu} from "react-native-paper";
import {Ionicons} from "@expo/vector-icons";
import {useSharedValue} from "react-native-reanimated";
import {Skia} from "@shopify/react-native-skia";

export default function Draw() {
  // const [path, setPath] = useState<string>("")
  const path = useSharedValue(Skia.Path.Make());
  const {id} = useLocalSearchParams()
  const navigation = useNavigation()
  const [cunei, setCunei] = useState<Cunei>()

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  useLayoutEffect(() => {
    navigation.setOptions({headerRight: () => (<Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Ionicons name={'ellipsis-vertical'} size={24} onPress={openMenu} style={styles.icon}/> }>
        <Menu.Item onPress={() => {}} title="Oznacz do usunięcia" />
        <Menu.Item onPress={() => {}} title="Dodaj komentarz" />
      </Menu>)})
  })

  useEffect(() => {
    fetchCunei()
  }, [id])
  async function fetchCunei() {
    try {
      const response = await fetch(api + '/cunei/' + id, {method: 'GET'})
      const data = await response.json()
      setCunei(data)
    } catch(e) {
      console.log(e)
    }
  }

  async function getNext() {
      try {
        const response = await fetch(api + '/cunei/' + id + '/next', {method: 'GET'})
        const data = await response.json()
        router.setParams({id: (data.id).toString()})
        return
      }
      catch (e) {
        console.log(e)
      }
  }

  async function getPrevious() {
    try {
      const response = await fetch(api + '/cunei/' + id + '/previous', {method: 'GET'})
      const data = await response.json()
      router.setParams({id: (data.id).toString()})
      return
    }
    catch (e) {
      console.log(e)
    }
  }

  return (
    <View style={styles.container}>
      {
        cunei ? <View>
          <View style={{ justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons onPress={getPrevious} name={'caret-back-circle' } style={styles.icon} size={24}/>
            <Text size={'regular'} center>{cunei?.phonetic}</Text>
            <Ionicons onPress={getNext} name={'caret-forward-circle' } style={styles.icon} size={24}/>
          </View>
          <View>
            <Text size={'cuneiBig'} center>{cunei?.unicode}</Text>
          </View>
        </View> : <></>
      }
      <View style={{flex: 15}}>
        <Tablet path={path} />
      </View>
      <View style={{flex: 2, flexDirection: 'row', gap: 10,}}>
        <Button onPress={() => path.value = Skia.Path.Make()} type={"secondary"} text={'Wyczyść'}/>
        <Button onPress={() => {
          console.log(path.value.toSVGString())
        }} type={"primary"} text={'Zatwierdź'}/>
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
