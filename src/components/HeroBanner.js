import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Modal, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { ubigeoPeru } from '../utils/ubigeoPeru';
import { getHeroConfig } from '../services/api';

export default function HeroBanner({ 
  busqueda, setBusqueda, 
  dptoSeleccionado, setDptoSeleccionado, 
  totalCasos = 3,
  onEjecutarBusqueda 
}) {
  const { width } = useWindowDimensions();
  const esMovil = width <= 768;

  const departamentosDisponibles = ['Todos', ...Object.keys(ubigeoPeru)];
  const [modalDptoVisible, setModalDptoVisible] = useState(false);

  // ESTADO INICIAL LIMPIO (SIN FOTOS VIEJAS)
  const [heroData, setHeroData] = useState({
    tagline: 'CONECTANDO CORAZONES, TRANSFORMANDO VIDAS:',
    titulo: 'Apadrina una Sonrisa en el Perú Profundo',
    foto_banner_url: '',
    color_fondo: '#0F172A'
  });

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    const data = await getHeroConfig();
    if (data && data.foto_banner_url) {
      setHeroData(data);
    }
  };

  const handleBuscarClick = () => {
    if (onEjecutarBusqueda) {
      onEjecutarBusqueda(dptoSeleccionado, busqueda);
    }
  };

  const seleccionarDpto = (d) => {
    setDptoSeleccionado(d);
    setModalDptoVisible(false);
  };

  return (
    <View style={[styles.heroSection, esMovil && styles.heroSectionMovil]}>
      <View style={styles.glowRed} />
      <View style={styles.glowBlue} />

      <View style={styles.heroContainer}>
        
        {/* COLUMNA IZQUIERDA: TEXTOS Y BUSCADOR */}
        <View style={[styles.colText, esMovil && styles.colTextMovil]}>
          <View style={[styles.taglineBadge, esMovil && styles.taglineBadgeMovil]}>
            <Text style={styles.tagline}>{heroData.tagline}</Text>
          </View>
          
          <Text style={[styles.title, esMovil && styles.titleMovil]}>{heroData.titulo}</Text>

          {/* BUSCADOR */}
          <View style={[styles.searchBar, esMovil && styles.searchBarMovil]}>
            <TouchableOpacity 
              style={[styles.btnSelectDpto, esMovil && styles.btnSelectDptoMovil]} 
              onPress={() => setModalDptoVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.btnSelectDptoText, esMovil && { fontSize: 11 }]} numberOfLines={1}>
                {dptoSeleccionado === 'Todos' ? '📍 Perú' : `📍 ${dptoSeleccionado}`} ▼
              </Text>
            </TouchableOpacity>

            <TextInput 
              style={[styles.inputSearch, esMovil && styles.inputSearchMovil]}
              placeholder={esMovil ? "Buscar abuelito..." : "Buscar por nombre, caserío o provincia..."}
              value={busqueda}
              onChangeText={setBusqueda}
              onSubmitEditing={handleBuscarClick}
            />

            <TouchableOpacity style={styles.btnBuscar} activeOpacity={0.85} onPress={handleBuscarClick}>
              <Text style={styles.btnBuscarText}>🔍 Buscar</Text>
            </TouchableOpacity>
          </View>

          {/* INDICADORES */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>📍 100%</Text>
              <Text style={styles.statText}>Ayuda Directa</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>👥 {totalCasos}</Text>
              <Text style={styles.statText}>Validados</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>✓ 100%</Text>
              <Text style={styles.statText}>Fiscalizado</Text>
            </View>
          </View>
        </View>

        {/* FOTO DEL ABUELITO (SOLO SE MUESTRA CUANDO CARGA DE LA BASE DE DATOS) */}
        {!esMovil && heroData.foto_banner_url ? (
          <View style={styles.colImage}>
            {Platform.OS === 'web' ? (
              <img 
                src={heroData.foto_banner_url} 
                alt="Abuelito Perú"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 22,
                  objectFit: 'cover',
                  border: '1px solid #334155'
                }}
              />
            ) : (
              <Image 
                source={{ uri: heroData.foto_banner_url }} 
                style={styles.abuelitoImg} 
              />
            )}
          </View>
        ) : null}

      </View>

      {/* MODAL DE DEPARTAMENTOS */}
      <Modal visible={modalDptoVisible} transparent={true} animationType="fade">
        <TouchableOpacity 
          style={styles.modalDptoOverlay} 
          activeOpacity={1} 
          onPress={() => setModalDptoVisible(false)}
        >
          <View style={styles.modalDptoCard}>
            <Text style={styles.modalDptoTitle}>Selecciona un Departamento</Text>
            <ScrollView style={{ maxHeight: 350 }}>
              {departamentosDisponibles.map((d) => (
                <TouchableOpacity 
                  key={d} 
                  style={[styles.dptoOption, dptoSeleccionado === d && styles.dptoOptionActive]}
                  onPress={() => seleccionarDpto(d)}
                >
                  <Text style={[styles.dptoOptionText, dptoSeleccionado === d && styles.dptoOptionTextActive]}>
                    {d === 'Todos' ? '📍 Todo el Perú (Todos)' : `📍 ${d}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
    overflow: 'hidden',
  },
  heroSectionMovil: {
    paddingVertical: 22,
    paddingHorizontal: 16,
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
  colTextMovil: {
    width: '100%',
    minWidth: '100%',
    paddingRight: 0,
    alignItems: 'center',
    marginBottom: 20,
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
  taglineBadgeMovil: {
    alignSelf: 'center',
  },
  tagline: {
    color: '#FF385C',
    fontWeight: 'bold',
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 42,
    marginBottom: 18,
  },
  titleMovil: {
    fontSize: 23,
    lineHeight: 30,
    textAlign: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF9',
    borderRadius: 30,
    padding: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FED7AA',
    shadowColor: '#FF385C',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 18,
    width: '100%',
  },
  searchBarMovil: {
    borderRadius: 25,
    padding: 3,
  },
  btnSelectDpto: {
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 150,
    justifyContent: 'center',
  },
  btnSelectDptoMovil: {
    maxWidth: 105,
    paddingHorizontal: 8,
  },
  btnSelectDptoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  inputSearch: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 13,
    outlineStyle: 'none',
  },
  inputSearchMovil: {
    fontSize: 12,
    paddingHorizontal: 6,
  },
  btnBuscar: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  btnBuscarMovil: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  btnBuscarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    justifyContent: 'center',
  },
  statBox: {
    flex: 1,
    minWidth: 95,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
  },
  statIcon: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 12,
    marginBottom: 2,
  },
  statText: {
    color: '#CBD5E1',
    fontSize: 9,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  colImage: {
    flex: 0.9,
    minWidth: 280,
    height: 330,
    justifyContent: 'center',
    alignItems: 'center',
  },
  abuelitoImg: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  modalDptoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalDptoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    maxWidth: 340,
    width: '100%',
  },
  modalDptoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingBottom: 8,
  },
  dptoOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  dptoOptionActive: {
    backgroundColor: '#FEE2E2',
  },
  dptoOptionText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  dptoOptionTextActive: {
    color: '#991B1B',
    fontWeight: 'bold',
  },
});