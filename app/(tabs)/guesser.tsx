import Tablet from "@/components/Tablet";
import { Skia } from "@shopify/react-native-skia";
import { useSharedValue } from "react-native-reanimated";

export function Guesser() {

    const path = useSharedValue(Skia.Path.Make());

    function clear() {
    path.value = Skia.Path.Make()
    }

    return <>
        <Tablet path={path}/>
    </>
}