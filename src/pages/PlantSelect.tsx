import React, { useEffect, useState } from 'react'
import { 
  StyleSheet, 
  Text, 
  View,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native'
import { useNavigation } from '@react-navigation/core'

import { Header } from '../components/Header'
import { EnvironmentButton } from '../components/EnvironmentButton'
import { PlantPrimaryCard } from '../components/PlantPrimaryCard'
import { Loading } from '../components/Loading'

import { Plant } from '../libs/storage'

import api from '../services/api'

import colors from '../styles/colors'
import fonts from '../styles/fonts'

interface Environment {
  key: string;
  title: string;
}

export function PlantSelect() {
  const navigation = useNavigation()
  
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [plants, setPlants] = useState<Plant[]>([])
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([])
  const [environmentSelected, setEnvironmentSelected] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(true)
  const [page, setPage] = useState(1)

  async function loadPlants() {
    try {
      const { data } = await api.get('plants', {
        params: {
          _sort: 'name',
          _order: 'asc',
          _page: page,
          _limit: 8
        }
      });
  
      if(!data) return setIsLoading(false)
  
      if(page > 1) {
        setPlants(prevPlants => [...prevPlants, ...data])
        setFilteredPlants(prevPlants => [...prevPlants, ...data])
      } else {
        setPlants(data)
        setFilteredPlants(data)
      }
    } catch (error) {
      Alert.alert('Erro ao carregar os dados da api!')
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    async function loadEnvironments() {
      const { data } = await api.get('plants_environments', {
        params: {
          _sort: 'title',
          _order: 'asc'
        }
      });
      const mockedAllItem = {
        key: 'all',
        title: 'todos'
      }

      setEnvironments([mockedAllItem, ...data])
    }

    loadEnvironments()
    loadPlants()
  }, [])

  function handleSelectEnvironment(environment: string) {
    setEnvironmentSelected(environment)

    if(environment === 'all') {
      return setFilteredPlants(plants)
    }

    const filteredData = plants.filter(plant => 
      plant.environments.includes(environment)
    )

    setFilteredPlants(filteredData)
  }

  function handleLoadMore(distance: number) {
    if(distance < 1) return;

    setIsLoadingMore(true)
    setPage(prevPage => prevPage + 1)
    loadPlants()
  }

  function handlePlantSelect(plant: Plant) {
    navigation.navigate('PlantSave', { plant })
  }

  if(isLoading) {
    return <Loading />
  }

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.textContent}>
        <Text style={styles.title}>
          Em qual ambiente
        </Text>
        <Text style={styles.subtitle}>
          você quer colocar sua planta
        </Text>
      </View>

      <View>
        <FlatList 
          data={environments}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.environmentItem}>
              <EnvironmentButton 
                isActive={item.key === environmentSelected}
                onPress={() => handleSelectEnvironment(item.key)}
              >
                {item.title}
              </EnvironmentButton>
            </View>
          )}
          contentContainerStyle={styles.environmentList}
        />
      </View>

      <View style={styles.plantsListContainer}>
        <FlatList 
          data={filteredPlants}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PlantPrimaryCard 
              data={item} 
              onPress={() => handlePlantSelect(item)} 
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) => handleLoadMore(distanceFromEnd)}
          ListFooterComponent={
            isLoadingMore 
              ? <ActivityIndicator color={colors.green} />
              : <></>
          }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  textContent: {
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitle: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.text,
    lineHeight: 20,
  },
  environmentItem: {
    marginRight: 8
  },
  environmentList: {
    justifyContent: 'center',
    height: 40,
    paddingBottom: 5,
    marginVertical: 32,
    paddingLeft: 32,
  },
  plantsListContainer: {
    flex: 1,
    paddingHorizontal: 32,
  },
  columnWrapper: {
    marginVertical: 10,
    justifyContent: 'space-between',
  }
})