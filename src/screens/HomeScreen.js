import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import HeroBanner from '../components/HeroBanner';
import DepartmentBubblesSection from '../components/DepartmentBubblesSection';
import AbuelitoCard from '../components/AbuelitoCard';

export default function HomeScreen({ 
  abuelitos = [], 
  loading, 
  onSelectAbuelito, 
  onVerCatalogoCompleto, 
  onSelectDpto,
  onEjecutarBusqueda 
}) {
  const [busqueda, setBusqueda] = useState('');
  const [dptoSeleccionado, setDptoSeleccionado] = useState('Todos');

  const lista = Array.isArray(abuelitos) ? abuelitos : [];

  const abuelitosFiltrados = lista.filter(item => {
    const coincideTexto = (item.nombre_completo || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                          (item.caserio || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                          (item.provincia || '').toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideDpto = dptoSeleccionado === 'Todos' || (item.departamento || '').toLowerCase() === dptoSeleccionado.toLowerCase();

    return coincideTexto && coincideDpto;
  });

  return (
    <View style={styles.container}>
      {/* 1. HERO BANNER */}
      <HeroBanner 
        busqueda={busqueda} 
        setBusqueda={setBusqueda}
        dptoSeleccionado={dptoSeleccionado}
        setDptoSeleccionado={setDptoSeleccionado}
        totalCasos={lista.length}
        onEjecutarBusqueda={onEjecutarBusqueda}
      />

      {/* 2. CATÁLOGO DE CASOS CON DEGRADADO SUAVE */}
      <View style={styles.directorySection}>
        <View style={styles.directoryContainer}>
          <View style={styles.dirHeadRow}>
            <View>
              <Text style={styles.dirTag}>CASOS SOCIALES RECIENTES</Text>
              <Text style={styles.sectionHeading}>Adultos Mayores en Extrema Vulnerabilidad</Text>
              <Text style={styles.sectionSubHeading}>Elige a un abuelito para apadrinar su canasta básica de víveres este mes:</Text>
            </View>

            <TouchableOpacity style={styles.btnVerTodos} onPress={onVerCatalogoCompleto} activeOpacity={0.85}>
              <Text style={styles.btnVerTodosText}>VER TODOS →</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#FF385C" style={{ marginTop: 40 }} />
          ) : abuelitosFiltrados.length === 0 ? (
            <View style={styles.emptySearch}>
              <Text style={styles.emptySearchText}>No se encontraron casos con los filtros seleccionados.</Text>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {abuelitosFiltrados.map((item) => (
                <AbuelitoCard key={item.id} item={item} onSelect={onSelectAbuelito} />
              ))}
            </View>
          )}
        </View>
      </View>

      {/* 3. BURBUJAS DE DEPARTAMENTOS CON DEGRADADO */}
      <DepartmentBubblesSection onSelectDpto={onSelectDpto} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
  },
  directorySection: {
    paddingVertical: 50,
    backgroundColor: '#F8FAFC',
    backgroundImage: Platform.OS === 'web' 
      ? 'radial-gradient(circle at 15% 15%, rgba(255, 56, 92, 0.04) 0%, transparent 40%), radial-gradient(circle at 85% 75%, rgba(37, 99, 235, 0.04) 0%, transparent 45%), linear-gradient(180deg, #F1F5F9 0%, #FFFDF9 50%, #F8FAFC 100%)' 
      : undefined,
  },
  directoryContainer: {
    maxWidth: 1180,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  dirHeadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 25,
    flexWrap: 'wrap',
    gap: 12,
  },
  dirTag: {
    color: '#FF385C',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  sectionHeading: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E293B',
  },
  sectionSubHeading: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  btnVerTodos: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#FF385C',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#FF385C',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  btnVerTodosText: {
    color: '#FF385C',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  emptySearch: {
    padding: 40,
    alignItems: 'center',
  },
  emptySearchText: {
    color: '#64748B',
    fontSize: 14,
    fontStyle: 'italic',
  },
});