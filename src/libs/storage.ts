import AsyncStorage from '@react-native-async-storage/async-storage'
import { format } from 'date-fns'

export interface Plant {
  id: number;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: [string];
  frequency: {
    times: number;
    repeat_every: string;
  };
  hour: string;
  dateTimeNotification: Date;
}

export interface StoragePlant {
  [id: string]: {
    data: Plant;
  }
}

export async function savePlant(plant: Plant): Promise<void> {
  try {
    const data = await AsyncStorage.getItem('@plantmaneger:plants')
    const oldPlants = data ? (JSON.parse(data) as StoragePlant) : {}

    const newPlant = {
      [plant.id]: {
        data: plant
      }
    }

    const plants = JSON.stringify({
      ...oldPlants,
      ...newPlant
    })

    await AsyncStorage.setItem('@plantmaneger:plants', plants)
    

  } catch (error) {
    throw new Error(error)
  }
}

export async function loadPlants(): Promise<Plant[]> {
  try {
    const data = await AsyncStorage.getItem('@plantmaneger:plants')
    const plants = data ? (JSON.parse(data) as StoragePlant) : {}

    const plantsSorted = Object.keys(plants).map(plantKey => {
      const hour = format(new Date(plants[plantKey].data.dateTimeNotification), 'HH:mm')

      return {
        ...plants[plantKey].data,
        hour

      }
    }).sort((a, b) => 
      new Date(b.dateTimeNotification).getTime() - new Date(a.dateTimeNotification).getTime()
    )   

    return plantsSorted 
  } catch (error) {
    throw new Error(error)
  }
}

export async function removePlant(id: number): Promise<void> {
  try {
    const data = await AsyncStorage.getItem('@plantmaneger:plants');
    const plants = data ? (JSON.parse(data) as StoragePlant) : {}

    delete plants[id]

    await AsyncStorage.setItem(
      '@plantmaneger:plants',
      JSON.stringify(plants)
    );
  } catch (error) {
    throw new Error(error)
  }
}