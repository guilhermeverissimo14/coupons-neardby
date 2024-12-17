import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/font-family";
import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        gap: 16
    },
    details: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        color: colors.gray[600],
        fontFamily: fontFamily.semiBold,
    },
    description: {
        fontSize: 14,
        color: colors.gray[500],
        fontFamily: fontFamily.regular,
        marginTop: 14
    }
})