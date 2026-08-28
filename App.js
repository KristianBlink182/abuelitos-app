import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, useWindowDimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import AnimatedSplash from './src/components/AnimatedSplash';
import Navbar from './src/components/Navbar';
import MobileHeader from './src/components/MobileHeader';
import BottomTabBar from './src/components/BottomTabBar';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import EditScreen from './src/screens/EditScreen';
import CaseriosScreen from './src/screens/CaseriosScreen';
import AutoridadesScreen from './src/screens/AutoridadesScreen';
import BodegaPortalScreen from './src/screens/BodegaPortalScreen';
import AdminScreen from './src/screens/AdminScreen';
import FAQScreen from './src/screens/FAQScreen';
import TermsScreen from './src/screens/TermsScreen';
import AboutScreen from './src/screens/AboutScreen';
import ContactScreen from './src/screens/ContactScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import AccountSettingsScreen from './src/screens/AccountSettingsScreen';
import DirectorySearchScreen from './src/screens/DirectorySearchScreen';
import Footer from './src/components/Footer';
import AuthModal from './src/components/AuthModal';
import { getAbuelitos } from './src/services/api';

// 1. OBLIGAR A IOS A MANTENER EL SPLASH SCREEN
SplashScreen.preventAutoHideAsync().catch(() => {});

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap');
    body, * { font-family: 'Inter', sans-serif !important; }
    h1, h2, h3, h4 { font-family: 'Plus Jakarta Sans', sans-serif !important; }
  `;
  document.head.appendChild(style);
}

export default function App() {
  const [mostrarSplash, setMostrarSplash] = useState(true);

  const { width } = useWindowDimensions();
  const esEscritorio = width > 768;
  const scrollViewRef = useRef(null);

  const [abuelitos, setAbuelitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [selectedAbuelito, setSelectedAbuelito] = useState(null);
  const [dptoExplorar, setDptoExplorar] = useState('Todos');

  const [usuarioSesion, setUsuarioSesion] = useState(null);
  const [modalAuthVisible, setModalAuthVisible] = useState(false);

  useEffect(() => {
    cargarDatosYSesion();

    // 2. RETENER 4 SEGUNDOS EXACTOS ANTES DE DESVANECER
    const timerSplash = setTimeout(async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {}
      setMostrarSplash(false);
    }, 4000);

    return () => clearTimeout(timerSplash);
  }, []);

  const cargarDatosYSesion = async () => {
    setLoading(true);
    try {
      const sesionGuardada = await AsyncStorage.getItem('usuario_sesion_activa');
      if (sesionGuardada) {
        setUsuarioSesion(JSON.parse(sesionGuardada));
      }
    } catch (e) {}

    const data = await getAbuelitos();
    setAbuelitos(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleCerrarSesion = async () => {
    await AsyncStorage.removeItem('usuario_sesion_activa');
    setUsuarioSesion(null);
    setCurrentView('home');
  };

  const handleNavigate = (view) => {
    setSelectedAbuelito(null);
    setCurrentView(view);
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handleSelectAbuelito = (item) => {
    const targetId = item.abuelito_id || item.id;
    const abuelitoCompleto = abuelitos.find(a => a.id === targetId) || item;
    
    setSelectedAbuelito(abuelitoCompleto);
    setCurrentView('detail');
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, 50);
  };

  const handleAbrirEditar = (item) => {
    setSelectedAbuelito(item);
    setCurrentView('edit');
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, 50);
  };

  const handleAbrirExplorador = (dpto) => {
    setDptoExplorar(dpto);
    setCurrentView('directory_search');
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.mainContainer}>

        {/* SPLASH SCREEN DE 4 SEGUNDOS */}
        {mostrarSplash && (
          <AnimatedSplash onFinish={() => setMostrarSplash(false)} />
        )}

        {esEscritorio ? (
          <Navbar 
            onNavigate={handleNavigate} 
            usuarioSesion={usuarioSesion}
            onOpenAuth={() => setModalAuthVisible(true)}
          />
        ) : (
          <MobileHeader onGoHome={() => handleNavigate('home')} />
        )}

        <ScrollView 
          ref={scrollViewRef} 
          style={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {currentView === 'home' && (
            <HomeScreen 
              abuelitos={abuelitos} 
              loading={loading} 
              onSelectAbuelito={handleSelectAbuelito}
              onVerCatalogoCompleto={() => handleAbrirExplorador('Todos')}
              onSelectDpto={handleAbrirExplorador}
              onEjecutarBusqueda={(dpto) => handleAbrirExplorador(dpto)}
            />
          )}

          {currentView === 'about' && (
            <AboutScreen onGoHome={() => handleNavigate('home')} />
          )}

          {currentView === 'directory_search' && (
            <DirectorySearchScreen 
              abuelitos={abuelitos}
              dptoInicial={dptoExplorar}
              onSelectAbuelito={handleSelectAbuelito}
            />
          )}

          {currentView === 'contacto' && (
            <ContactScreen onGoHome={() => handleNavigate('home')} />
          )}

          {currentView === 'terms' && (
            <TermsScreen onGoHome={() => handleNavigate('home')} />
          )}

          {currentView === 'favorites' && (
            <FavoritesScreen 
              usuario={usuarioSesion}
              onSelectAbuelito={handleSelectAbuelito}
              onOpenAuth={() => setModalAuthVisible(true)}
              onGoHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'account' && (
            <AccountSettingsScreen 
              usuario={usuarioSesion}
              onSelectAbuelito={handleSelectAbuelito}
              onCerrarSesion={handleCerrarSesion}
              onOpenAuth={() => setModalAuthVisible(true)}
            />
          )}

          {currentView === 'caserios' && (
            <CaseriosScreen onSelectCaserio={() => handleAbrirExplorador('Todos')} />
          )}

          {currentView === 'autoridades' && (
            <AutoridadesScreen />
          )}

          {currentView === 'bodega_portal' && (
            <BodegaPortalScreen />
          )}

          {currentView === 'faq' && (
            <FAQScreen onGoHome={() => handleNavigate('home')} />
          )}

          {currentView === 'admin' && (
            <AdminScreen 
              onVerCaso={handleSelectAbuelito} 
              onEditarCaso={handleAbrirEditar}
              onCerrarSesionAdmin={handleCerrarSesion}
            />
          )}

          {currentView === 'register' && (
            <RegisterScreen 
              onCancel={() => handleNavigate('home')}
              onSuccess={() => {
                cargarDatosYSesion();
                handleNavigate('home');
              }}
            />
          )}

          {currentView === 'edit' && selectedAbuelito && (
            <EditScreen 
              abuelito={selectedAbuelito}
              onCancel={() => {
                setCurrentView('admin');
                scrollViewRef.current?.scrollTo({ y: 0, animated: false });
              }}
              onSuccess={() => {
                cargarDatosYSesion();
                handleNavigate('admin');
              }}
            />
          )}

          {currentView === 'detail' && selectedAbuelito && (
            <DetailScreen 
              abuelito={selectedAbuelito} 
              usuarioDonante={usuarioSesion}
              onOpenAuth={() => setModalAuthVisible(true)}
              onBack={() => handleNavigate('home')}
              onEdit={() => handleAbrirEditar(selectedAbuelito)}
            />
          )}

          {esEscritorio && <Footer onNavigate={handleNavigate} />}
        </ScrollView>

        {!esEscritorio && (
          <BottomTabBar 
            currentView={currentView} 
            onNavigate={handleNavigate}
            usuarioSesion={usuarioSesion}
            onOpenAuth={() => setModalAuthVisible(true)}
          />
        )}

        <AuthModal 
          visible={modalAuthVisible} 
          onClose={() => setModalAuthVisible(false)} 
          onSuccess={(user) => {
            setUsuarioSesion(user);
            if (user.tipo === 'bodega') setCurrentView('bodega_portal');
            if (user.tipo === 'admin') setCurrentView('admin');
            if (user.tipo === 'donante') setCurrentView('account');
          }} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF' },
  mainContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { flex: 1 }
});