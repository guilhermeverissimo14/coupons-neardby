import { Alert, View } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import Loading from '@/components/loading';
import { Cover } from '@/components/market/cover';
import { PropsDetails, Details } from '@/components/market/details';
import { api } from '@/services/api';

type DataProps = PropsDetails & {
    cover: string;
}

export default function Market() {

    const params = useLocalSearchParams<{ id: string }>();

    const [data, setData] = useState<DataProps>();
    const [isLoading, setIsLoading] = useState(true);

    async function fetchMarket() {
        try {

            const { data } = await api.get("/markets/" + params.id);
            setData(data);
            setIsLoading(false);

        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possivel carregar os dados.",
                [
                    {
                        text: "Ok",
                        onPress: () => router.back()
                    }
                ]
            )
        }
    }

    useEffect(() => {
        fetchMarket();
    }, [params.id])

    if (isLoading) {
        return <Loading />
    }

    if (!data) {
        return <Redirect href="/home" />
    }

    return (
        <View style={{ flex: 1 }} >

            <Cover uri={data?.cover} />
            <Details data={data} />

        </View>
    );
}