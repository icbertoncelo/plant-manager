import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SvgFromUri } from 'react-native-svg'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { useNavigation, useRoute } from '@react-navigation/core'
import DateTimePicker, { Event } from '@react-native-community/datetimepicker'
import { format, isBefore } from 'date-fns'

import { Plant, savePlant } from '../libs/storage'
import { Button } from '../components/Button'

import waterdrop from '../assets/waterdrop.png'
import colors from '../styles/colors'
import fonts from '../styles/fonts'
import { ScrollView } from 'react-native-gesture-handler'

interface Params {
  plant: Plant
}

export function PlantSave() {
  const navigation = useNavigation()
  const route = useRoute()
  const { plant } = route.params as Params
  
  const[selectedDateTime, setSelectedDateTime] = useState(new Date())
  const[isDatePickerOpen, setIsDatePickerOpen] = useState(Platform.OS === 'ios')

  const formattedDateTime = useMemo(() => {
    return format(selectedDateTime, 'HH:mm')
  }, [selectedDateTime])

  function handleChangeDateTime(event: Event, dateTime: Date | undefined) {
    if(Platform.OS === 'android') {
      setIsDatePickerOpen(prevIsDatePickerOpen => !prevIsDatePickerOpen)
    }

    if(dateTime && isBefore(dateTime, new Date())) {
      setSelectedDateTime(new Date())

      return Alert.alert('Escolha um horário no futuro')
    }

    if(dateTime) {
      setSelectedDateTime(dateTime)
    }
  }

  function handleOpenAndroidDatetimePicker() {
    setIsDatePickerOpen(prevIsDatePickerOpen => !prevIsDatePickerOpen)
  }

  async function handleAddPlant() {
    try {
      await savePlant({
        ...plant,
        dateTimeNotification: selectedDateTime
      })

      navigation.navigate('Confirmation', {
        title: 'Tudo certo', 
        subtitle: 'Fiqu tranquilo que sempre vamos lembrá-lo de cuidar da sua plantinha.' ,
        buttonTitle: 'Muito obrigado' ,
        icon: 'hug' ,
        nextScreen: 'MyPlants'
      })

    } catch (error) {
      Alert.alert('Não foi possível salvar a planta')
    }
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.plantInfo}>
          <SvgFromUri 
            uri={plant.photo}
            height={150}
            width={150}
          />

          <Text style={styles.plantName}>
            {plant.name}
          </Text>

          <Text style={styles.plantAbout}>
            {plant.about}
          </Text>
        </View> 

        <View style={styles.controller}>
          <View style={styles.tipContainer}>
            <Image
              source={waterdrop}
              style={styles.image}
            />
            <Text style={styles.tipText}>
              {plant.water_tips}
            </Text>
          </View>

          <Text style={styles.alertLabel}>
            Escolha o melhor horário para ser lembrado:
          </Text>

          {isDatePickerOpen && (
            <DateTimePicker 
              value={selectedDateTime}
              mode='time'
              display='spinner'
              onChange={handleChangeDateTime}
            />
          )}

          {Platform.OS === 'android' && (
            <TouchableOpacity
              onPress={handleOpenAndroidDatetimePicker}
              style={styles.dateTimePickerButton}
            >
              <Text style={styles.dateTimePickerText}>
                {`Selecionar Horário ${formattedDateTime}`}
              </Text>
            </TouchableOpacity>
          )}

          <Button onPress={handleAddPlant}>Cadastrar planta</Button>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.shape,
  },
  plantInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 50,
    backgroundColor: colors.shape,
  },
  plantName: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.heading,
    marginTop: 32,
  },
  plantAbout: {
    textAlign: 'center',
    fontFamily: fonts.text,
    fontSize: 17,
    color: colors.heading,
    marginTop: 32,
  },
  controller: {
    backgroundColor: colors.white,
    paddingHorizontal: 32,
    paddingBottom: getBottomSpace() || 32
  },
  tipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.blue_light,
    padding: 16,
    borderRadius: 20,
    position: 'relative',
    bottom: 50
  },
  image: {
    width: 56,
    height: 56,
  },
  tipText: {
    flex: 1,
    marginLeft: 24,
    fontFamily: fonts.text,
    fontSize: 17,
    color: colors.blue,
  },
  alertLabel: {
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: fonts.complement,
    fontSize: 13,
    color: colors.heading,
  },
  dateTimePickerButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 32
  },
  dateTimePickerText: {
    color: colors.heading,
    fontSize: 26,
    fontFamily: fonts.text
  }
})