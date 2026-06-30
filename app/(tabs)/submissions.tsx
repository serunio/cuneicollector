import { api } from "@/api";
import Button from "@/components/Button";
import Text from "@/components/Text";
import { colors } from "@/styles";
import { ctxAuth } from "@/utils/AuthContext";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Searchbar } from "react-native-paper";

type Submission = { id: number, user_id: string, name: string, email: string, data: string, unicode:string, phonetic: string, timestamp: string }
export default function Submissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [filtered, setFiltered] = useState<Submission[]>([])
  const [sorted, setSorted] = useState<Submission[]>([])
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    fetchSubmissions()
  }, [])

  useEffect(() => {
    setFiltered(submissions.filter((c) => normalizeText(c.phonetic).startsWith(normalizeText(searchQuery))))
  }, [searchQuery, submissions])

  useEffect(() => {
    setSorted([...filtered].sort((a, b) => new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf()))
  }, [filtered])


  function normalizeText(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
  }

  const {user} = useContext(ctxAuth)

  async function fetchSubmissions() {
    setRefreshing(true)
    try {
      const res = await fetch(api + '/submissions', {
        method: 'GET', headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      })
      const data = await res.json()
      setSubmissions(data)
    } catch (e) {
      console.log(e)
    }
    setRefreshing(false)
  }

  return <View style={{backgroundColor: colors.background}}>
    <Searchbar
      placeholder="Search"
      onChangeText={setSearchQuery}
      value={searchQuery}
    />
      <FlatList
        refreshing={refreshing}
        onRefresh={fetchSubmissions}
        data={sorted}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <SubmissionItem item={item}/>}
      />
  </View>
}

function SubmissionItem({ item }: { item: Submission }) {
  const path = React.useMemo(
    () => Skia.Path.MakeFromSVGString(item.data),
    [item.data]
  )

  if (!path) return null

  const bounds = path.getBounds()
  const size = 100

  const date = new Date(item.timestamp)

  const scale = Math.min(size/(bounds.width + 100), size/(bounds.height + 100))
  // console.log(item.id)
  const dx = (size/scale - bounds.width)/2 - bounds.x
  const dy = (size/scale - bounds.height)/2 - bounds.y

  return (
    <View style={styles.background}>
      <View style={{borderRadius: 10, width: size, height: size, overflow: 'hidden', backgroundColor: colors.tablet, }}>
        <Canvas style={{width: '100%', height: '100%'}}>
          <Path
            path={path}
            style="stroke"
            strokeJoin={"round"}
            strokeWidth={10}
            strokeCap={"round"}
            color={colors.tabletStroke}
            transform={[
              { translateX: dx * scale },
              { translateY: dy * scale },
              { scale }
            ]}
          />
        </Canvas>
      </View>

      <View style={{ justifyContent: 'space-between', flex: 1, flexDirection: "row"}}>
        <View style={{flexDirection: "column", justifyContent: 'center', width: 70}}>
          <Text size={'cuneiSmall'} center>
            {item.unicode}
          </Text>
          <Text size={'small'} center>
            {item.phonetic}
          </Text>
        </View>
        
        <View style={{flexDirection: "column", justifyContent: 'center', flex: 3}}>
          <Text size={'small'} center>
            {item.name }
          </Text>
          <Text size={'small'} center>
            {item.email }
          </Text>
          <Text size={'small'} center>
            {date.toDateString()}
          </Text>
          <Text size={'small'} center>
            {date.toLocaleTimeString()}
          </Text>
          
        </View>
        <View style={{flex: 1}}>
          <Button type="primary" onPress={() => {}} text="Block"/>
        </View>
        
        
      </View>

    </View>

  )
}

const styles = StyleSheet.create({
  background: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderColor: colors.background,
    borderBottomColor: colors.gray,
    borderStyle: 'solid',
    borderWidth: 2,
    gap: 5
  }
})