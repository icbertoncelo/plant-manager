import { Feather } from '@expo/vector-icons';
import React from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { RectButton, RectButtonProps  } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { SvgFromUri } from 'react-native-svg'

import colors from '../styles/colors'
import fonts from '../styles/fonts'

interface PlantSecondaryCardProps extends RectButtonProps {
  data: {
    name: string;
    photo: string;
    hour: string;
  };
  onRemovePlant: () => void
}

export function PlantSecondaryCard({ data, onRemovePlant, ...rest }: PlantSecondaryCardProps) {
  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        <Animated.View>
          <View>
            <TouchableOpacity
              style={styles.swipeableButton}
              onPress={onRemovePlant}
            >
              <Feather name='trash' size={32} color={ colors.white} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    >
      <RectButton style={styles.container} {...rest} >
        <View style={styles.imageContent}>
          <SvgFromUri 
            uri={ data.photo } 
            height={50}
            width={50}
          />
          <Text style={styles.title}>
            { data.name }
          </Text>
        </View>

        <View style={styles.details}>
          <Text style={styles.timeText}>
            Regas às
          </Text>
          <Text style={styles.hour}>
            { data.hour }
          </Text>
        </View>
      </RectButton>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 85,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.shape,
    marginBottom: 10,
  },
  imageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.heading,
    color: colors.heading,
    fontSize: 16,
    marginLeft: 16
  },
  details: {
    justifyContent: 'flex-end'
  },
  timeText: {
    textAlign: 'right',
    color: colors.body_light,
    fontFamily: fonts.text,
    fontSize: 12
  },
  hour: {
    color: colors.body_dark,
    fontFamily: fonts.heading,
    fontSize: 16 
  },
  swipeableButton: {
    width: 100,
    height: 85,
    backgroundColor: colors.red,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    right: 16
  }
})