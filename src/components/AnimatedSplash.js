import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('screen');

export default function AnimatedSplash({ onFinish }) {
  useEffect(() => {
    // Retener la imagen 4 segundos exactos
    const timer = setTimeout(() => {
      onFinish();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <StatusBar hidden />
      <Image 
        source={require('../../assets/splash-icon.png')} 
        style={styles.splashImage} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: '#090D16',
    zIndex: 9999999,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 100,
  },
  splashImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});