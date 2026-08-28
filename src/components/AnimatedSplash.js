import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('screen');

export default function AnimatedSplash({ onFinish }) {
  useEffect(() => {
    // 4 segundos exactos en pantalla
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <StatusBar hidden={true} />
      <Image
        source={require('../../assets/splash.png')}
        style={styles.fullScreenImage}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
    backgroundColor: '#000000',
    zIndex: 9999999,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 100,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
});