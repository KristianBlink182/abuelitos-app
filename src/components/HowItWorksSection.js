import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function HowItWorksSection() {
  return (
    <View style={styles.stripWrapper}>
      <View style={styles.stripContainer}>
        <View style={styles.stepItem}>
          <Text style={styles.stepNum}>1</Text>
          <Text style={styles.stepText}>Elige un caso validado</Text>
        </View>
        <Text style={styles.arrow}>➔</Text>

        <View style={styles.stepItem}>
          <Text style={styles.stepNum}>2</Text>
          <Text style={styles.stepText}>Yapea a la bodega de su caserío</Text>
        </View>
        <Text style={styles.arrow}>➔</Text>

        <View style={styles.stepItem}>
          <Text style={styles.stepNum}>3</Text>
          <Text style={styles.stepText}>Recibe víveres y ves la foto de constancia</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stripWrapper: {
    backgroundColor: '#FFF7ED',
    borderBottomWidth: 1,
    borderColor: '#FED7AA',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  stripContainer: {
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepNum: {
    backgroundColor: '#EA580C',
    color: '#FFF',
    width: 22,
    height: 22,
    borderRadius: 11,
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 11,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9A3412',
  },
  arrow: {
    color: '#FDBA74',
    fontSize: 14,
    fontWeight: 'bold',
  },
});