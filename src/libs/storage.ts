import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
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
    notificationId: string;
  }
}

export async function savePlant(plant: Plant): Promise<void> {
  try {
    const nextTime = new Date(plant.dateTimeNotification)
    const now = new Date()

    const { times, repeat_every } = plant.frequency

    if(repeat_every === 'week') {
      const interval = Math.trunc(7 / times);
      nextTime.setDate(now.getDate() + interval)
    } else {
      nextTime.setDate(nextTime.getDate() + 1)
    }

    const seconds = Math.abs(
      Math.ceil((now.getTime() - nextTime.getTime()) / 1000)
    )

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Heey, 🌱',
        body: `Está na hora de cuidar da sua ${plant.name}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          plant
        },
      },
      trigger: {
        seconds: seconds < 60 ? 60 : seconds,
        repeats: true
      }
    })

    const data = await AsyncStorage.getItem('@plantmaneger:plants')
    const oldPlants = data ? (JSON.parse(data) as StoragePlant) : {}

    const newPlant = {
      [plant.id]: {
        data: plant,
        notificationId
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

    await Notifications.cancelScheduledNotificationAsync(plants[id].notificationId)

    delete plants[id]

    await AsyncStorage.setItem(
      '@plantmaneger:plants',
      JSON.stringify(plants)
    );
  } catch (error) {
    throw new Error(error)
  }
}