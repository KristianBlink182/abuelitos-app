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
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
});