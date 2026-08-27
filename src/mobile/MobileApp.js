import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, Text, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import AuthModal from '../components/AuthModal';
import DetailScreen from '../screens/DetailScreen';
import DonorProfileScreen from '../screens/DonorProfileScreen';
import AbuelitoCard from '../components/AbuelitoCard';
import { getAbuelitos, getHeroConfig } from '../services/api';
import { ubigeoPeru } from '../utils/ubigeoPeru';

export default function MobileApp() {
  const scrollViewRef = useRef(null);
  const [abuelitos, setAbuelitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('home'); // 'home', 'explore', 'favorites', 'profile'
  const [selectedAbuelito, setSelectedAbuelito] = useState(null);

  // Filtros en móvil
  const [dptoFiltro, setDptoFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Usuario Donante
  const [usuarioSesion, setUsuarioSesion] = useState(null);
  const [modalAuthVisible, setModalAuthVisible] = useState(false);

  // Configuración Hero
  const [heroData, setHeroData] = useState({
    tagline: 'CONECTANDO CORAZONES, TRANSFORMANDO VIDAS:',
    titulo: 'Apadrina una Sonrisa en el Perú Profundo',
    foto_banner_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200'
  });

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    setLoading(true);
    const data = await getAbuelitos();
    const config = await getHeroConfig();
    setAbuelitos(Array.isArray(data) ? data : []);
    if (config && config.titulo) setHeroData(config);
    setLoading(false);
  };

  const handleSelectAbuelito = (item) => {
    setSelectedAbuelito(item);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, 50);
  };

  const abuelitosFiltrados = abuelitos.filter(item => {
    const coincideTexto = (item.nombre_completo || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                          (item.caserio || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                          (item.provincia || '').toLowerCase().includes(busqueda.toLowerCase());
    const coincideDpto = dptoFiltro === 'Todos' || item.departamento === dptoFiltro;
    return coincideTexto && coincideDpto;
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.mainContainer}>
        
        {/* 1. CABECERA NATIVA MÓVIL (LOGO 100% CENTRADO) */}
        <View style={styles.mobileHeader}>
          <Text style={styles.logoText}>🇵🇪 abuelitos<Text style={{ color: '#FF385C' }}>.pe</Text></Text>
        </View>

        {/* 2. CONTENIDO MÓVIL */}
        <ScrollView ref={scrollViewRef} style={styles.scroll} showsVerticalScrollIndicator={false}>
          
          {/* SI HAY UN ABUELITO SELECCIONADO -> MUESTRA SU FICHA COMPLETA */}
          {selectedAbuelito ? (
            <DetailScreen 
              abuelito={selectedAbuelito} 
              usuarioDonante={usuarioSesion}
              onOpenAuth={() => setModalAuthVisible(true)}
              onBack={() => setSelectedAbuelito(null)}
              onEdit={() => {}}
            />
          ) : (
            <>
              {/* TAB 1: INICIO (HOME MÓVIL NATIVO) */}
              {currentTab === 'home' && (
                <View style={styles.homeView}>
                  
                  {/* HERO CARD MÓVIL */}
                  <View style={styles.mobileHeroCard}>
                    <Image source={{ uri: heroData.foto_banner_url }} style={styles.heroImgBg} />
                    <View style={styles.heroOverlay} />
                    <View style={styles.heroContent}>
                      <Text style={styles.heroTag}>{heroData.tagline}</Text>
                      <Text style={styles.heroTitle}>{heroData.titulo}</Text>
                    </View>
                  </View>

                  {/* INDICADORES NATIVOS MÓVILES */}
                  <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                      <Text style={styles.statNum}>📍 100%</Text>
                      <Text style={styles.statLabel}>Ayuda Directa</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statNum}>👥 {abuelitos.length}</Text>
                      <Text style={styles.statLabel}>Validados</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statNum}>✓ 100%</Text>
                      <Text style={styles.statLabel}>Fiscalizado</Text>
                    </View>
                  </View>

                  {/* LISTA VERTICAL DE ABUELITOS (1 POR FILA) */}
                  <Text style={styles.sectionHeading}>Casos Sociales Urgentes</Text>
                  <View style={styles.listContainer}>
                    {abuelitosFiltrados.map((item) => (
                      <AbuelitoCard key={item.id} item={item} onSelect={handleSelectAbuelito} />
                    ))}
                  </View>
                </View>
              )}

              {/* TAB 2: EXPLORAR CON FILTROS */}
              {currentTab === 'directory_search' && (
                <View style={styles.exploreView}>
                  <Text style={styles.pageTitle}>🔍 Explorar por Región</Text>
                  
                  {/* Selector Horizontal de Regiones */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dptoScroll}>
                    {['Todos', ...Object.keys(ubigeoPeru)].map((d) => (
                      <TouchableOpacity 
                        key={d} 
                        style={[styles.dptoChip, dptoFiltro === d && styles.dptoChipActive]}
                        onPress={() => setDptoFiltro(d)}
                      >
                        <Text style={[styles.dptoChipText, dptoFiltro === d && styles.dptoChipTextActive]}>
                          {d === 'Todos' ? '📍 Todo el Perú' : d}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <View style={styles.listContainer}>
                    {abuelitosFiltrados.map((item) => (
                      <AbuelitoCard key={item.id} item={item} onSelect={handleSelectAbuelito} />
                    ))}
                  </View>
                </View>
              )}

              {/* TAB 3: FAVORITOS / MI CUENTA */}
              {currentTab === 'donor_profile' && (
                <DonorProfileScreen 
                  usuario={usuarioSesion}
                  onSelectAbuelito={handleSelectAbuelito}
                  onCerrarSesion={() => {
                    setUsuarioSesion(null);
                    setCurrentTab('home');
                  }}
                  onGoHome={() => setCurrentTab('home')}
                />
              )}
            </>
          )}

        </ScrollView>

        {/* 3. BARRA INFERIOR NATIVA (BOTTOM TABS) */}
        <BottomTabBar 
          currentView={currentTab} 
          onNavigate={(tab) => {
            setSelectedAbuelito(null);
            setCurrentTab(tab);
          }}
          usuarioSesion={usuarioSesion}
          onOpenAuth={() => setModalAuthVisible(true)}
        />

        {/* MODAL INGRESO EXCLUSIVO DONANTES */}
        <AuthModal 
          visible={modalAuthVisible} 
          onClose={() => setModalAuthVisible(false)} 
          onSuccess={(user) => {
            setUsuarioSesion(user);
            setCurrentTab('donor_profile');
          }} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  mainContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  mobileHeader: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  logoText: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
  scroll: { flex: 1 },
  homeView: { padding: 16 },
  exploreView: { padding: 16 },
  pageTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A', marginBottom: 12 },
  mobileHeroCard: {
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 16,
    marginBottom: 16,
  },
  heroImgBg: { position: 'absolute', width: '100%', height: '100%', resizeMode: 'cover' },
  heroOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.65)' },
  heroContent: { zIndex: 2 },
  heroTag: { color: '#FF385C', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  heroTitle: { color: '#FFF', fontSize: 18, fontWeight: '900', lineHeight: 24 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: '#FFF', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  statNum: { fontSize: 13, fontWeight: '900', color: '#FF385C' },
  statLabel: { fontSize: 9, color: '#64748B', fontWeight: 'bold', marginTop: 2 },
  sectionHeading: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 12 },
  listContainer: { gap: 4 },
  dptoScroll: { flexDirection: 'row', marginBottom: 16 },
  dptoChip: { backgroundColor: '#F1F5F9', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  dptoChipActive: { backgroundColor: '#FF385C', borderColor: '#FF385C' },
  dptoChipText: { fontSize: 12, fontWeight: 'bold', color: '#475569' },
  dptoChipTextActive: { color: '#FFF' },
});