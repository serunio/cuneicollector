import { api } from "@/api";
import Text from "@/components/Text";
import { colors } from "@/styles";
import { ctxAuth } from "@/utils/AuthContext";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

type Submission = { id: number, user_id: string, data: string, unicode:string }
export default function Submissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [refreshing, setRefreshing] = useState<boolean>(false)
  useEffect(() => {
    fetchSubmissions()
  }, [])

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
      <FlatList
        refreshing={refreshing}
        onRefresh={fetchSubmissions}
        data={submissions}
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

      <View style={{ justifyContent: 'center', width: size, flex: 1}}>
        <Text size={'cuneiSmall'} center>
          {item.unicode}
        </Text>
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
    borderWidth: 2
  }
})