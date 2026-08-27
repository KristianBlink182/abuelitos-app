import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, useWindowDimensions, Platform } from 'react-native';
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
import ContactScreen from './src/screens/ContactScreen';
import DonorProfileScreen from './src/screens/DonorProfileScreen';
import DirectorySearchScreen from './src/screens/DirectorySearchScreen';
import Footer from './src/components/Footer';
import AuthModal from './src/components/AuthModal';
import { getAbuelitos } from './src/services/api';

// Inyectar Plus Jakarta Sans e Inter en la Web
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap');
    body, * {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }
    h1, h2, h3, h4, [class*="title"], [class*="Title"], [class*="Heading"] {
      font-family: 'Plus Jakarta Sans', sans-serif !important;
    }
  `;
  document.head.appendChild(style);
}

export default function App() {
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
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    const data = await getAbuelitos();
    setAbuelitos(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleNavigate = (view) => {
    setSelectedAbuelito(null);
    setCurrentView(view);
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handleSelectAbuelito = (item) => {
    setSelectedAbuelito(item);
    setCurrentView('detail');
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
        {esEscritorio ? (
          <Navbar 
            onNavigate={handleNavigate} 
            usuarioSesion={usuarioSesion}
            onOpenAuth={() => setModalAuthVisible(true)}
          />
        ) : (
          <MobileHeader 
            onGoHome={() => handleNavigate('home')} 
            onGoAdmin={() => setModalAuthVisible(true)} 
          />
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

          {currentView === 'donor_profile' && usuarioSesion && (
            <DonorProfileScreen 
              usuario={usuarioSesion}
              onSelectAbuelito={handleSelectAbuelito}
              onCerrarSesion={() => {
                setUsuarioSesion(null);
                setCurrentView('home');
              }}
              onGoHome={() => handleNavigate('home')}
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
            <AdminScreen onVerCaso={handleSelectAbuelito} />
          )}

          {currentView === 'register' && (
            <RegisterScreen 
              onCancel={() => handleNavigate('home')}
              onSuccess={() => {
                cargarDatos();
                handleNavigate('home');
              }}
            />
          )}

          {currentView === 'edit' && selectedAbuelito && (
            <EditScreen 
              abuelito={selectedAbuelito}
              onCancel={() => {
                setCurrentView('detail');
                scrollViewRef.current?.scrollTo({ y: 0, animated: false });
              }}
              onSuccess={() => {
                cargarDatos();
                handleNavigate('home');
              }}
            />
          )}

          {currentView === 'detail' && selectedAbuelito && (
            <DetailScreen 
              abuelito={selectedAbuelito} 
              usuarioDonante={usuarioSesion}
              onOpenAuth={() => setModalAuthVisible(true)}
              onBack={() => handleNavigate('home')}
              onEdit={() => {
                setCurrentView('edit');
                scrollViewRef.current?.scrollTo({ y: 0, animated: false });
              }}
            />
          )}

          <Footer onNavigate={handleNavigate} />
        </ScrollView>

        {!esEscritorio && (
          <BottomTabBar 
            currentView={currentView} 
            onNavigate={handleNavigate} 
          />
        )}

        <AuthModal 
          visible={modalAuthVisible} 
          onClose={() => setModalAuthVisible(false)} 
          onSuccess={(user) => {
            setUsuarioSesion(user);
            if (user.tipo === 'bodega') setCurrentView('bodega_portal');
            if (user.tipo === 'admin') setCurrentView('admin');
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