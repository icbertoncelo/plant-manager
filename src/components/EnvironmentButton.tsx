import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { RectButton, RectButtonProps } from 'react-native-gesture-handler'
import colors from '../styles/colors'
import fonts from '../styles/fonts'

interface EnvironmentButtonProps extends RectButtonProps {
  children: string;
  isActive?: boolean;
}

export function EnvironmentButton({ 
  children, 
  isActive = false, 
  ...rest 
}: EnvironmentButtonProps) {
  return (
    <RectButton 
      style={[
        styles.container, 
        isActive && styles.containerActive
      ]}
      { ...rest } 
    >
      <Text style={[
        styles.text,
        isActive && styles.textActive
      ]}>
        { children }
      </Text>
    </RectButton>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.shape,
    height: 40,
    width: 76,
    borderRadius: 12,
  },
  containerActive: {
    backgroundColor: colors.green_light,
  },
  text: {
    color: colors.heading,
    fontFamily: fonts.text
  },
  textActive: {
    color: colors.green_dark,
    fontFamily: fonts.heading
  }
})