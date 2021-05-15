import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/core'
import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TextInput, 
  View,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { Button } from '../components/Button'

import colors from '../styles/colors'
import fonts from '../styles/fonts'

export function UserIndentification() {
  const navigation = useNavigation()

  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const [name, setName] = useState('')

  function handleInputBlur() {
    setIsFocused(false)
    setIsFilled(!!name)
  }

  function handleInputFocus() {
    setIsFocused(true)
  }

  function handleInpuChange(value: string) {
    setIsFilled(!!value)
    setName(value)
  }

  async function handleSubmint() {
    if(!name) return Alert.alert('Me diz como chamar voce!')

    try {
      await AsyncStorage.setItem('@plantmaneger:username', name)
      navigation.navigate('Confirmation', {
        title: 'Prontinho', 
        subtitle: 'Agora vamos ccomeçar a cuidar das suas plantinhas com muito cuidado.' ,
        buttonTitle: 'Começar' ,
        icon: 'smile' ,
        nextScreen: 'PlantSelect'
      })
    } catch (error) {
      Alert.alert('Não foi possível salvar o seu nome')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.emoji}>
              { isFilled ? '😄' : '😀'}
            </Text>
            <Text style={styles.title}>
              Como podemos {'\n'}
              chamar você?
            </Text>
          </View>

          <TextInput
            style={[
              styles.input,
              (isFocused || isFilled) && { borderColor: colors.green }
            ]}
            placeholder="Digite um nome"
            value={name}
            onChangeText={handleInpuChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
          />

          <View style={styles.footer}>
            <Button onPress={handleSubmint}>
              Confirmar
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 54,
  },
  header: {
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.heading,
    textAlign: 'center',
    marginTop: 20,
  },
  emoji: {
    fontSize: 44,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.gray,
    color: colors.heading,
    width: '100%',
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: 'center'
  },
  footer: {
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 20,
  }
})