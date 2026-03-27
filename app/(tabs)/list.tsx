import {Animated} from "react-native";
import {api} from '@/api'
import {useEffect, useState} from "react";
import {Cunei} from '@/types'
import CuneiListElement from "@/components/CuneiListElement";
import ScrollView = Animated.ScrollView;
import {colors} from "@/styles";


export default function List() {
  const [cunei, setCunei] = useState<Cunei[]>([])
  useEffect(() => {
    fetchCunei()
  }, [])

  async function fetchCunei() {
    try {
      const response = await fetch(api + '/cunei')
      const data = await response.json()
      setCunei(data)
    } catch(e) {
      console.log(e)
    }
  }
  return <ScrollView style={{backgroundColor: colors.background}}>
    {cunei.map((c, i) => (
      <CuneiListElement key={i} cunei={c}/>
    ))}
  </ScrollView>
}