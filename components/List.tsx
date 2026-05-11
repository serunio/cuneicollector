import {FlatList, View} from "react-native";
import {api} from '@/api'
import {useContext, useEffect, useState} from "react";
import {Cunei} from '@/types'
import CuneiListElement from "@/components/CuneiListElement";
import {colors} from "@/styles";
import {Searchbar} from "react-native-paper";
import {ctxAuth} from "@/utils/AuthContext";
import Button from "@/components/Button";

type Sort = "user" | "all" | "alphabetically"

const sortFunc: Record<Sort, (a: Cunei, b: Cunei) => number> = {
  "user": (a: Cunei, b: Cunei) => {
    const prim = a.user_count - b.user_count
    return prim !== 0 ? prim : a.total_count - b.total_count
  },
  "all": (a: Cunei, b: Cunei) => {
    const prim = a.total_count - b.total_count
    return prim !== 0 ? prim : a.user_count - b.user_count
  },
  "alphabetically": (a: Cunei, b: Cunei) => a.phonetic.localeCompare(b.phonetic)
}
export default function List({admin = false}) {
  const [cunei, setCunei] = useState<Cunei[]>([])
  const [cuneiFiltered, setCuneiFiltered] = useState<Cunei[]>([])
  const [cuneiSorted, setCuneiSorted] = useState<Cunei[]>([])
  const [searchQuery, setSearchQuery] = useState('');
  const {user} = useContext(ctxAuth)
  const [sort, setSort] = useState<Sort>("alphabetically")

  useEffect(() => {
    fetchCunei()
  }, [])

  useEffect(() => {
    const filtered = cunei.filter((c) => normalizeText(c.phonetic).includes(normalizeText(searchQuery)))
    setCuneiFiltered(filtered)
  }, [searchQuery])

  useEffect(() => {
    const sorted = [...cuneiFiltered].sort(sortFunc[sort])
    setCuneiSorted(sorted)
  }, [sort])

  function normalizeText(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
  }

  async function fetchCunei() {
    let response
    try {
      response = await fetch(api + '/cunei/for-user', {
        headers: {
          "Authorization": `Bearer ${user?.token}`
        }
      })
      const data = await response.json()
      setCunei(data)
      setCuneiFiltered(data)
    } catch (e) {
      console.log(e)
      console.log(response)
    }
  }

  const sortPanel = (
    <View style={{flexDirection: 'row'}}>
      <Button type={sort === "alphabetically" ? "primary" : "secondary"} text={'Alfabetycznie'}
              onPress={() => setSort("alphabetically")}/>
      <Button type={sort === "user" ? "primary" : "secondary"} text={'Twoje'} onPress={() => setSort("user")}/>
      <Button type={sort === "all" ? "primary" : "secondary"} text={'Wszystkie'} onPress={() => setSort("all")}/>
    </View>
  )

  return <View style={{backgroundColor: colors.background, height: '100%'}}>
    <Searchbar
      placeholder="Search"
      onChangeText={setSearchQuery}
      value={searchQuery}
    />
    <FlatList
      style={{backgroundColor: colors.background}}
      data={cuneiSorted}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({item}) => <CuneiListElement cunei={item} admin={admin}/>}
      ListHeaderComponent={sortPanel}
    />
  </View>
}