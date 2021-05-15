import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import AsyncStorage from '@react-native-async-storage/async-storage'

import colors from '../styles/colors'
import fonts from '../styles/fonts'

export function Header() {
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    async function getUsername() {
      const asyncUsername = await AsyncStorage.getItem('@plantmaneger:username')

      setUsername(asyncUsername ?? '')
    }
    
    getUsername()
  }, [])

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá</Text>
        <Text style={styles.username}>{username}</Text>
      </View>

      <Image 
        source={{uri: 'https://avatars.githubusercontent.com/u/15328398?v=4'}} 
        style={styles.image}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 32,
    marginTop: getStatusBarHeight()
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text
  },
  username: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 40
  },
  image: {
    height: 56,
    width: 56,
    borderRadius: 28
  }
})