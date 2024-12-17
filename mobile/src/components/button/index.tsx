import { ActivityIndicator, Text, TextProps, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { s } from './styles';
import { colors } from '@/styles/colors';

import { IconProps as TableIconProps } from '@tabler/icons-react-native';
import React from 'react';

type ButtonProps = TouchableOpacityProps & {
    isLoading?: boolean;
}

function Button({ children, style, isLoading = false, ...rest }: ButtonProps) {
    return (
        <TouchableOpacity
            style={[s.container, style]}
            activeOpacity={0}
            disabled={isLoading}
            {...rest}
        >
            {
                isLoading ? <ActivityIndicator size="small" color={colors.gray[100]} /> : children
            }
        </TouchableOpacity>
    )
}

function Title({ children }: TextProps) {
    return <Text style={s.title}>{children}</Text>
}

type IconProps = {
    icon: React.ComponentType<TableIconProps>
}

function Icon({ icon: Icon }: IconProps) {
    return <Icon size={24} color={colors.gray[100]} />
}

Button.Title = Title;
Button.Icon = Icon;

export { Button }