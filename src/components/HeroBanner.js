import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Platform } from 'react-native';
import { ubigeoPeru } from '../utils/ubigeoPeru';
import { getHeroConfig } from '../services/api';

export default function HeroBanner({ 
  busqueda, setBusqueda, 
  dptoSeleccionado, setDptoSeleccionado, 
  totalCasos = 3,
  onEjecutarBusqueda 
}) {
  const departamentosDisponibles = ['Todos', ...Object.keys(ubigeoPeru)];

  const [heroData, setHeroData] = useState({
    tagline: 'CONECTANDO CORAZONES, TRANSFORMANDO VIDAS:',
    titulo: 'Apadrina una Sonrisa en el Perú Profundo',
    foto_banner_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',
    color_fondo: '#1E232B'
  });

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    const data = await getHeroConfig();
    if (data && data.titulo) {
      setHeroData(data);
    }
  };

  const handleBuscarClick = () => {
    if (onEjecutarBusqueda) {
      onEjecutarBusqueda(dptoSeleccionado, busqueda);
    }
  };

  return (
    <View style={styles.heroSection}>
      <View style={styles.glowRed} />
      <View style={styles.glowBlue} />

      <View style={styles.heroContainer}>
        
        {/* COLUMNA IZQUIERDA: TEXTOS, BUSCADOR Y MÉTRICAS */}
        <View style={styles.colText}>
          <View style={styles.taglineBadge}>
            <Text style={styles.tagline}>{heroData.tagline}</Text>
          </View>
          
          <Text style={styles.title}>{heroData.titulo}</Text>

          {/* BUSCADOR */}
          <View style={styles.searchBar}>
            {Platform.OS === 'web' && (
              <select 
                style={styles.selectDpto} 
                value={dptoSeleccionado} 
                onChange={(e) => setDptoSeleccionado(e.target.value)}
              >
                {departamentosDisponibles.map((d) => (
                  <option key={d} value={d}>{d === 'Todos' ? '📍 Todo el Perú' : `📍 ${d}`}</option>
                ))}
              </select>
            )}

            <TextInput 
              style={styles.inputSearch}
              placeholder="Buscar por nombre, caserío o provincia..."
              value={busqueda}
              onChangeText={setBusqueda}
              onSubmitEditing={handleBuscarClick}
            />

            <TouchableOpacity style={styles.btnBuscar} activeOpacity={0.85} onPress={handleBuscarClick}>
              <Text style={styles.btnBuscarText}>🔍 Buscar</Text>
            </TouchableOpacity>
          </View>

          {/* INDICADORES FLOTANTES */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>📍 100%</Text>
              <Text style={styles.statText}>Ayuda Directa a los Abuelitos</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>👥 {totalCasos}</Text>
              <Text style={styles.statText}>Casos Validados</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>✓ 100%</Text>
              <Text style={styles.statText}>Fiscalizado por Autoridades</Text>
            </View>
          </View>
        </View>

        {/* COLUMNA DERECHA: FOTO DEL ABUELITO */}
        <View style={styles.colImage}>
          <View style={styles.imageGlowEffect} />
          <Image 
            source={{ uri: heroData.foto_banner_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200' }} 
            style={styles.abuelitoImg} 
          />
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    position: 'relative',
    backgroundColor: '#0B0F19',
    backgroundImage: Platform.OS === 'web' 
      ? 'radial-gradient(circle at 85% 45%, rgba(255, 56, 92, 0.18) 0%, transparent 55%), radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.15) 0%, transparent 60%), linear-gradient(135deg, #090D16 0%, #131B2E 50%, #0F172A 100%)'
      : undefined,
    paddingVertical: 45,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  glowRed: {
    position: 'absolute',
    top: -50,
    right: '25%',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(255, 56, 92, 0.08)',
  },
  glowBlue: {
    position: 'absolute',
    bottom: -80,
    left: '10%',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(37, 99, 235, 0.06)',
  },
  heroContainer: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    zIndex: 2,
  },
  colText: {
    flex: 1.2,
    minWidth: 320,
    paddingRight: 20,
  },
  taglineBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 56, 92, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 56, 92, 0.25)',
    marginBottom: 10,
  },
  tagline: {
    color: '#FF385C',
    fontWeight: 'bold',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 42,
    marginBottom: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 22,
  },
  selectDpto: {
    border: 'none',
    borderRight: '1px solid #E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E293B',
    outline: 'none',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    maxWidth: 150,
  },
  inputSearch: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 13,
    outlineStyle: 'none',
  },
  btnBuscar: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 25,
  },
  btnBuscarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  statBox: {
    flex: 1,
    minWidth: 105,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    backdropFilter: Platform.OS === 'web' ? 'blur(10px)' : undefined,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
  },
  statIcon: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
    marginBottom: 2,
  },
  statText: {
    color: '#CBD5E1',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  colImage: {
    flex: 0.9,
    minWidth: 280,
    height: 330,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageGlowEffect: {
    position: 'absolute',
    width: '95%',
    height: '95%',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 56, 92, 0.15)',
    filter: Platform.OS === 'web' ? 'blur(20px)' : undefined,
  },
  abuelitoImg: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 8,
  },
});