import { colors } from '@/styles/colors';
import { ActivityIndicator, View } from 'react-native';
import { s } from './styles';

export default function Loading() {
    return (
        <ActivityIndicator color={colors.green.base} style={s.container} />
    );
}