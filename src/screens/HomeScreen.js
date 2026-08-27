import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
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
  const { width } = useWindowDimensions();
  const esMovil = width <= 768;

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

      {/* 2. CATÁLOGO DE CASOS */}
      <View style={[styles.directoryContainer, esMovil && styles.directoryContainerMovil]}>
        
        {/* CABECERA RESPONSIVE (NO SE CORTA EN MÓVIL) */}
        <View style={[styles.dirHeadRow, esMovil && styles.dirHeadRowMovil]}>
          <View style={esMovil && { alignItems: 'center', width: '100%' }}>
            <Text style={styles.dirTag}>CASOS SOCIALES RECIENTES</Text>
            <Text style={[styles.sectionHeading, esMovil && styles.sectionHeadingMovil]}>
              Adultos Mayores en Extrema Vulnerabilidad
            </Text>
            <Text style={[styles.sectionSubHeading, esMovil && styles.sectionSubHeadingMovil]}>
              Elige a un abuelito para apadrinar su canasta de víveres:
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.btnVerTodos, esMovil && styles.btnVerTodosMovil]} 
            onPress={onVerCatalogoCompleto} 
            activeOpacity={0.85}
          >
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

      {/* 3. SECCIÓN DE REGIONES COMPACTA */}
      <DepartmentBubblesSection onSelectDpto={onSelectDpto} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
  },
  directoryContainer: {
    paddingVertical: 40,
    paddingHorizontal: 16,
    maxWidth: 1180,
    width: '100%',
    alignSelf: 'center',
  },
  directoryContainerMovil: {
    paddingVertical: 25,
    paddingHorizontal: 12,
  },
  dirHeadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  dirHeadRowMovil: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  dirTag: {
    color: '#FF385C',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 3,
    textAlign: 'center',
  },
  sectionHeading: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E293B',
  },
  sectionHeadingMovil: {
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
  },
  sectionSubHeading: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  sectionSubHeadingMovil: {
    fontSize: 12,
    textAlign: 'center',
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
  btnVerTodosMovil: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 4,
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