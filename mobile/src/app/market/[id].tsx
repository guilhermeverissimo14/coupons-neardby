import { Alert, View, Modal, StatusBar, ScrollView } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';

import Loading from '@/components/loading';
import { Cover } from '@/components/market/cover';
import { PropsDetails, Details } from '@/components/market/details';
import { api } from '@/services/api';
import { Coupon } from '@/components/market/coupon';
import { Button } from '@/components/button';

type DataProps = PropsDetails & {
    cover: string;
}

export default function Market() {

    const params = useLocalSearchParams<{ id: string }>();

    const [data, setData] = useState<DataProps>();
    const [isLoading, setIsLoading] = useState(true);
    const [coupon, setCoupon] = useState<string | null>(null);
    const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false);
    const [cuponIsFetching, setCuponIsFetching] = useState(false);

    const qrLock = useRef(false);

    const [_, requestPermission] = useCameraPermissions();

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

    async function handleOpenCamera() {
        try {

            const { granted } = await requestPermission();

            if (!granted) {
                return Alert.alert("Permissão negada", "Você precisa permitir o acesso a camera para ler o QR Code.")
            }

            qrLock.current = false;
            setIsVisibleCameraModal(true);
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possivel abrir a camera.")
        }
    }

    async function getCoupon(id: string) {
        try {

            setCuponIsFetching(true);

            const { data } = await api.patch("/coupons/" + id);
            Alert.alert("Cupom", data.coupon);
            setCoupon(data.coupon);

        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possivel obter o cupom.");
        } finally {
            setCuponIsFetching(false);
        }
    }

    function handleUseCoupon(id: string) {

        setIsVisibleCameraModal(false);

        Alert.alert("Cupom",
            "Não é possível reutilizar um cupom resgatado. Deseja realmente resgatar o cupom?",
            [
                {
                    text: "Não",
                    style: "cancel"
                },
                {
                    text: "Resgatar",
                    onPress: () => getCoupon(id)
                }
            ]
        )
    }

    useEffect(() => {
        fetchMarket();
    }, [params.id, coupon])

    if (isLoading) {
        return <Loading />
    }

    if (!data) {
        return <Redirect href="/home" />
    }

    return (
        <View style={{ flex: 1 }} >
            <StatusBar barStyle="light-content" hidden={isVisibleCameraModal} />

            <ScrollView showsVerticalScrollIndicator={false}>
                <Cover uri={data?.cover} />
                <Details data={data} />
                {coupon && <Coupon code={coupon} />}
            </ScrollView>

            <View style={{ padding: 32, }}>

                <Button onPress={handleOpenCamera}>
                    <Button.Title>Ler QR Code</Button.Title>
                </Button>

            </View>

            <Modal style={{ flex: 1, }} visible={isVisibleCameraModal}>
                <CameraView
                    style={{ flex: 1 }}
                    facing="back"
                    onBarcodeScanned={({ data }) => {

                        if (data && !qrLock.current) {
                            qrLock.current = true;
                            setTimeout(() => handleUseCoupon(data), 500)
                        }
                    }}
                />

                <View style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
                    <Button
                        isLoading={cuponIsFetching}
                        onPress={() => setIsVisibleCameraModal(false)}
                    >
                        <Button.Title>Voltar</Button.Title>
                    </Button>
                </View>

            </Modal>
        </View>
    );
}