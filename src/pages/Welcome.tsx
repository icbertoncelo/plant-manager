import React from 'react'
import { useNavigation } from '@react-navigation/core'

import { 
  SafeAreaView, 
  Image, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  View
} from 'react-native'

import { Feather } from '@expo/vector-icons'

import wateringImg from '../assets/watering.png'

import colors from '../styles/colors'
import fonts from '../styles/fonts'

export function Welcome() {
  const navigation = useNavigation()

  function handleStart() {
    navigation.navigate('UserIndentification')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Gerencie {'\n'}
          suas plantas de {'\n'}
          forma fácil
        </Text>

        <Image  
          source={wateringImg}  
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.subtitle}>
          Não esqueça mais de regar suas plantas. Nós cuidamos de lembrar você
          sempre que precisar.
        </Text>

        <TouchableOpacity 
          style={styles.button}
          activeOpacity={0.7}
          onPress={handleStart}
        > 
          <Feather name='chevron-right' style={styles.buttonIcon}/>
        </TouchableOpacity>
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
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.heading,
    marginTop: 32,
    fontFamily: fonts.heading,
    lineHeight: 38
  },
  image: {
    height: Dimensions.get('window').width * 0.7,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
    color: colors.heading,
    fontFamily: fonts.text,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    width: 56,
    marginBottom: 20,
    backgroundColor: colors.green,
    borderRadius: 16,
  },
  buttonIcon: {
    color: colors.white,
    fontSize: 24
  }
})