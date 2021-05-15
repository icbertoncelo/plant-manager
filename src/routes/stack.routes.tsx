import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Welcome } from '../pages/Welcome';
import { UserIndentification } from '../pages/UserIndentification';
import { Confirmation } from '../pages/Confirmation';
import { PlantSave } from '../pages/PlantSave';

import colors from '../styles/colors';
import { MyPlants } from '../pages/MyPlants';
import { TabRoutes } from './Tab.routes';

const Stack = createStackNavigator();

export function StackRoutes() {
  return (
    <Stack.Navigator
      headerMode='none'
      screenOptions={{
        cardStyle: {
          backgroundColor: colors.white
        }
      }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="UserIndentification" component={UserIndentification} />
      <Stack.Screen name="Confirmation" component={Confirmation} />
      <Stack.Screen name="PlantSelect" component={TabRoutes} />
      <Stack.Screen name="PlantSave" component={PlantSave} />
      <Stack.Screen name="MyPlants" component={TabRoutes} />
    </Stack.Navigator>
  );
}