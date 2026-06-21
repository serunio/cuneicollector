import { api } from '@/api';
import CuneiListElement from "@/components/CuneiListElement";
import { colors } from "@/styles";
import { Cunei } from '@/types';
import { ctxAuth } from "@/utils/AuthContext";
import { useContext, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Searchbar } from "react-native-paper";

const sort = (a: Cunei, b: Cunei) => {
    const prim = a.user_count - b.user_count
    const sec = a.total_count - b.total_count
    return prim !== 0 ? prim : sec !== 0 ? sec : Math.random() - 0.5
  }
export default function List({admin = false}) {
  const [cunei, setCunei] = useState<Cunei[]>([])
  const [cuneiFiltered, setCuneiFiltered] = useState<Cunei[]>([])
  const [cuneiSorted, setCuneiSorted] = useState<Cunei[]>([])
  const [searchQuery, setSearchQuery] = useState('');
  const {user} = useContext(ctxAuth)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  useEffect(() => {
    
    fetchCunei()
  }, [])

  useEffect(() => {
    
    const filtered = cunei.filter((c) => normalizeText(c.phonetic).includes(normalizeText(searchQuery)))
    
    setCuneiFiltered(filtered)
  }, [searchQuery])

  useEffect(() => {
    const sorted = [...cuneiFiltered].sort(sort)
    setCuneiSorted(sorted)
  }, [cuneiFiltered])

  function normalizeText(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
  }

  async function fetchCunei() {
    setRefreshing(true)
    const endpoint = admin ? '/cunei' : '/cunei/for-user'
    
    let response
    try {
      response = await fetch(api + endpoint, {
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
    setRefreshing(false)
  }

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
      refreshing={refreshing}
      onRefresh={fetchCunei}
    />
  </View>
}