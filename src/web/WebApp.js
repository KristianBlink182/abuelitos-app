import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import Navbar from '../components/Navbar';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import RegisterScreen from '../screens/RegisterScreen';
import EditScreen from '../screens/EditScreen';
import CaseriosScreen from '../screens/CaseriosScreen';
import AutoridadesScreen from '../screens/AutoridadesScreen';
import BodegaPortalScreen from '../screens/BodegaPortalScreen';
import AdminScreen from '../screens/AdminScreen';
import FAQScreen from '../screens/FAQScreen';
import TermsScreen from '../screens/TermsScreen';
import ContactScreen from '../screens/ContactScreen';
import DonorProfileScreen from '../screens/DonorProfileScreen';
import DirectorySearchScreen from '../screens/DirectorySearchScreen';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { getAbuelitos } from '../services/api';

export default function WebApp() {
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
        <Navbar 
          onNavigate={handleNavigate} 
          usuarioSesion={usuarioSesion}
          onOpenAuth={() => setModalAuthVisible(true)}
        />

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

        <AuthModal 
          visible={modalAuthVisible} 
          onClose={() => setModalAuthVisible(false)} 
          onSuccess={(user) => {
            setUsuarioSesion(user);
            if (user.tipo === 'bodega') setCurrentView('bodega_portal');
            if (user.tipo === 'admin') setCurrentView('admin');
            if (user.tipo === 'donante') setCurrentView('donor_profile');
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