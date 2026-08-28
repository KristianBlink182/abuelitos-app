import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function AnimatedSplash({ onFinish }) {
  const escalaLogo = useRef(new Animated.Value(0.8)).current;
  const opacidadFondo = useRef(new Animated.Value(1)).current;
  const progresoCarga = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Animación del logo y barra de carga de 4 segundos
    Animated.parallel([
      Animated.spring(escalaLogo, {
        toValue: 1.05,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(progresoCarga, {
        toValue: 1,
        duration: 3800, // 4 segundos de carga visual
        useNativeDriver: false,
      })
    ]).start();

    // 2. Transición de salida exacta a los 4 segundos
    const timer = setTimeout(() => {
      Animated.timing(opacidadFondo, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const anchoBarra = progresoCarga.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.splashContainer, { opacity: opacidadFondo }]}>
      
      {/* RESPLANDOR AMBIENTAL DE FONDO */}
      <View style={styles.glowRed} />
      <View style={styles.glowBlue} />

      <View style={styles.centerContent}>
        {/* LOGO OFICIAL CON ANIMACIÓN */}
        <Animated.View style={{ transform: [{ scale: escalaLogo }] }}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logoOficial} 
          />
        </Animated.View>

        {/* LEMA OFICIAL */}
        <Text style={styles.slogan}>Conectando corazones en el Perú profundo</Text>
        <Text style={styles.subSlogan}>Ayuda directa, transparente y sin intermediarios</Text>

        {/* BARRA DE CARGA DE 4 SEGUNDOS */}
        <View style={styles.loadingTrack}>
          <Animated.View style={[styles.loadingBar, { width: anchoBarra }]} />
        </View>
      </View>

      {/* PIE DE PÁGINA */}
      <View style={styles.footerSplash}>
        <Text style={styles.footerText}>© 2026 abuelitos.pe — Versión Oficial</Text>
      </View>
    </Animated.View>
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
  glowRed: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255, 56, 92, 0.18)',
  },
  glowBlue: {
    position: 'absolute',
    bottom: '15%',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  centerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 2,
  },
  logoOficial: {
    width: 260,
    height: 95,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  slogan: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subSlogan: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 30,
  },
  loadingTrack: {
    width: 160,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    backgroundColor: '#FF385C',
    borderRadius: 2,
  },
  footerSplash: {
    position: 'absolute',
    bottom: 35,
    alignItems: 'center',
  },
  footerText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
  },
});