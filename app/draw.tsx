import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Tablet from '../components/Tablet'
import {colors} from '@/styles'
import Button from '../components/Button'
import Text from './../components/Text'
import {useLocalSearchParams} from "expo-router";
import {api} from '@/api'
import {Cunei} from "@/types";

export default function Draw() {
  const [path, setPath] = useState<string>("")
  const {id} = useLocalSearchParams()

  const [cunei, setCunei] = useState<Cunei>()
  useEffect(() => {
    fetchCunei()
  }, [])
  console.log(cunei)
  async function fetchCunei() {
    try {
      const response = await fetch(api + '/cunei/' + id)
      const data = await response.json()
      setCunei(data)
    } catch(e) {
      console.log(e)
    }
  }

  return (
    <View style={styles.container}>
      <View style={{flex: 5}}>
        <Text size={'big'} center>{cunei?.unicode}</Text>
      </View>
      <View style={{flex: 20}}>
        <Tablet path={path} setPath={setPath}/>
      </View>
      <View style={{flex: 2, flexDirection: 'row', gap: 10,}}>
        <Button onPress={() => setPath('')} type={"secondary"} text={'Wyczyść'}/>
        <Button onPress={() => {
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
});
