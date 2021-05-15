import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/core'

import { Button } from '../components/Button'

import fonts from '../styles/fonts'
import colors from '../styles/colors'

interface Params {
  title: string;
  subtitle: string;
  buttonTitle: string;
  icon: 'hug' | 'smile';
  nextScreen: string;
}

const emojis = {
  hug: '🤗',
  smile: '😄'
}

export function Confirmation() {
  const navigation = useNavigation()
  const  route = useRoute()

  const { 
    title, 
    subtitle, 
    buttonTitle, 
    icon, 
    nextScreen 
  } = route.params as Params

  function handleMoveOn() {
    navigation.navigate(nextScreen)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>
          {emojis[icon]}
        </Text>
        <Text style={styles.title}>
          {title}
        </Text>
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>

        <View style={styles.footer}>
          <Button onPress={handleMoveOn}>
            {buttonTitle}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 94,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    textAlign: 'center',
    marginTop: 64,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: fonts.text,
    color: colors.heading,
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 20,
  }
})