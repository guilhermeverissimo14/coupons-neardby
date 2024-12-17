import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import MapView, { Callout, Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import { Categories, CategoriesProps } from '@/components/categories';
import { PlaceProps } from '@/components/place';
import Places from '@/components/places';
import { api } from '@/services/api';
import { colors } from '@/styles/colors';
import { fontFamily } from '@/styles/font-family';
import { router } from 'expo-router';

type MarketsProps = PlaceProps & {
    latitude: number;
    longitude: number;
};

const currentLocation = {
    latitude: -23.561187293883442,
    longitude: -46.656451388116494
}

export default function Home() {

    const [categories, setCategories] = useState<CategoriesProps>([]);
    const [category, setCategory] = useState("");
    const [markets, setMarkets] = useState<MarketsProps[]>([]);

    async function fetchCategories() {
        try {

            const { data } = await api.get("/categories");
            setCategories(data);
            setCategory(data[0].id)

        } catch (error) {
            console.log(error)
            Alert.alert("Erro ao buscar categorias.")
        }
    }

    async function fetchMarkets() {
        try {

            if (!category) {
                return
            }
            const { data } = await api.get("/markets/category/" + category)
            setMarkets(data)

        } catch (error) {
            console.log(error);
            Alert.alert("Locais", "Não foi possível carregar os locais")
        }
    }

    // async function getCurrentLocation() {
    //     try {
    //         const { granted } = await Location.requestForegroundPermissionsAsync();

    //         if (granted) {
    //             const location = await Location.getCurrentPositionAsync({});
    //             console.log(location)
    //         }

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    useEffect(() => {
        fetchCategories();
        // getCurrentLocation();
    }, [])

    useEffect(() => {
        fetchMarkets();
    }, [category])

    return (
        <View style={{ flex: 1, backgroundColor: "#cecece" }} >
            <Categories
                data={categories}
                onSelect={setCategory}
                selected={category}
            />

            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }}
            >
                {markets.map((item) => (
                    <Marker
                        key={item.id}
                        identifier={item.id}
                        coordinate={{
                            latitude: item.latitude,
                            longitude: item.longitude
                        }}
                        image={require("@/assets/pin.png")}
                    >

                        <Callout style={{ backgroundColor: "red", width: 100, height: 100 }} onPress={() => router.navigate(`/market/${item.id}`)}>
                            <View style={{ backgroundColor: "red", width: 100, height: 100 }}>

                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: colors.gray[600],
                                        fontFamily: fontFamily.regular
                                    }}
                                >
                                    {item.name}
                                </Text>

                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: colors.gray[600],
                                        fontFamily: fontFamily.regular
                                    }}
                                >
                                    {item.address}
                                </Text>

                            </View>
                        </Callout>

                    </Marker>

                ))}

            </MapView>

            <Places data={markets} />

        </View>
    );
}