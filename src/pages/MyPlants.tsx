import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, Alert } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { formatDistance } from 'date-fns'
import pt from 'date-fns/esm/locale/pt'

import { Header } from '../components/Header'
import { PlantSecondaryCard } from '../components/PlantSecondaryCard'
import { loadPlants, Plant, removePlant } from '../libs/storage'

import colors from '../styles/colors'
import fonts from '../styles/fonts'

import waterdrop from '../assets/waterdrop.png'
import { Loading } from '../components/Loading'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function MyPlants() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [nextWaterd, setNextWaterd] = useState('')

  useEffect(() => {
    async function ladStoragePlants() {
      try {
        const plantsStoraged = await loadPlants()

        const nextTime = formatDistance(
          new Date(plantsStoraged[0].dateTimeNotification), 
          new Date(),
          { locale: pt }
        )

        const nextWaterdMessage = `Não esqueça de regar a ${plantsStoraged[0].name} às ${nextTime} horas`

        setNextWaterd(nextWaterdMessage)
        setPlants(plantsStoraged)
      } catch (error) {
        Alert.alert('Erro ao carregar os dados da api!')
      } finally {
        setIsLoading(false)
      }
      
    }

    ladStoragePlants()
  }, [])

  async function handleConfirmRemove(id: number) {
    try {
      removePlant(id)
      setPlants(prevPlants => 
        prevPlants.filter(item => item.id !== id)
      )
    } catch (error) {
      Alert.alert('Erro ao remover a planta selecionada')
    }
  }

  function handleRemovePlant(plant: Plant) {
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
      {
        text: 'Não',
        style: 'cancel'
      },
      {
        text: 'Sim',
        onPress: () => handleConfirmRemove(plant.id)
      }
    ])
  }

  if(isLoading) {
    return <Loading />
  }
  
  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image
          source={waterdrop}
          style={styles.spotlightImage}
        />

        <Text  style={styles.spotlightText}>
          {nextWaterd}
        </Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>
          Próximas regadas
        </Text>

        <FlatList
          data={plants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantSecondaryCard 
              data={item} 
              onRemovePlant={() => handleRemovePlant(item)} 
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background
  },
  spotlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.blue_light,
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 32
  },
  spotlightImage: {
    width: 56,
    height: 56,
  },
  spotlightText: {
    flex: 1,
    marginLeft: 24,
    fontFamily: fonts.text,
    fontSize: 17,
    color: colors.blue,
  },
  plants: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 32
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 24
  }
})