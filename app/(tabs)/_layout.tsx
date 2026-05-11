import {colors} from "@/styles";
import {NativeTabs} from "expo-router/build/native-tabs";
import {SafeAreaView} from "react-native-safe-area-context";
import {useContext} from "react";
import {ctxAuth} from "@/utils/AuthContext";

export default function TabsLayout() {
  const {user}  = useContext(ctxAuth)
  return <>
    <SafeAreaView edges={['top']} style={{flex:1, backgroundColor: colors.background}}>
      <NativeTabs labelVisibilityMode={'labeled'}>

        <NativeTabs.Trigger name={'list'}>
          <NativeTabs.Trigger.Label>
            Znaki
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger hidden={!user?.admin} name={'edit'}>
          <NativeTabs.Trigger.Label>
            Edit
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger hidden={!user?.admin} name={'submissions'}>
          <NativeTabs.Trigger.Label>
            Submissions
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name={'account'}>
          <NativeTabs.Trigger.Label>
            Konto
          </NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

      </NativeTabs>
    </SafeAreaView>

  </>
}

