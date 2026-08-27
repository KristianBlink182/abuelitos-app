import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import AbuelitoCard from '../components/AbuelitoCard';
import { ubigeoPeru } from '../utils/ubigeoPeru';

export default function DirectorySearchScreen({ abuelitos = [], onSelectAbuelito, dptoInicial = 'Todos' }) {
  const departamentosDisponibles = ['Todos', ...Object.keys(ubigeoPeru)];

  const [dpto, setDpto] = useState(dptoInicial);
  const [provincia, setProvincia] = useState('Todos');
  const [distrito, setDistrito] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [rangoEdad, setRangoEdad] = useState('Todos');
  const [soloUrgentes, setSoloUrgentes] = useState(false);

  const provinciasDisponibles = dpto !== 'Todos' && ubigeoPeru[dpto] 
    ? ['Todos', ...Object.keys(ubigeoPeru[dpto])] 
    : ['Todos'];

  const distritosDisponibles = dpto !== 'Todos' && provincia !== 'Todos' && ubigeoPeru[dpto] && ubigeoPeru[dpto][provincia]
    ? ['Todos', ...ubigeoPeru[dpto][provincia]]
    : ['Todos'];

  const handleCambioDpto = (nuevoDpto) => {
    setDpto(nuevoDpto);
    setProvincia('Todos');
    setDistrito('Todos');
  };

  const handleCambioProv = (nuevaProv) => {
    setProvincia(nuevaProv);
    setDistrito('Todos');
  };

  const limpiarFiltros = () => {
    setDpto('Todos');
    setProvincia('Todos');
    setDistrito('Todos');
    setBusqueda('');
    setRangoEdad('Todos');
    setSoloUrgentes(false);
  };

  const resultados = abuelitos.filter(item => {
    const coincideTexto = (item.nombre_completo || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                          (item.caserio || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                          (item.provincia || '').toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideDpto = dpto === 'Todos' || item.departamento === dpto;
    const coincideProv = provincia === 'Todos' || item.provincia === provincia;
    const coincideDist = distrito === 'Todos' || item.distrito === distrito;

    let coincideEdad = true;
    const edad = parseInt(item.edad || 0);
    if (rangoEdad === '60-74') coincideEdad = edad >= 60 && edad <= 74;
    if (rangoEdad === '75-84') coincideEdad = edad >= 75 && edad <= 84;
    if (rangoEdad === '85+') coincideEdad = edad >= 85;

    let coincideUrgente = true;
    if (soloUrgentes) {
      coincideUrgente = parseFloat(item.saldo_disponible || 0) < 50;
    }

    return coincideTexto && coincideDpto && coincideProv && coincideDist && coincideEdad && coincideUrgente;
  });

  return (
    <ScrollView style={styles.container}>
      {/* 1. BANNER CINEMATOGRÁFICO DE CABECERA */}
      <View style={styles.topHeroBanner}>
        <View style={styles.topHeroContent}>
          <Text style={styles.topHeroTag}>DIRECTORIO NACIONAL SOLIDARIO</Text>
          <Text style={styles.topHeroTitle}>Directorio General de Abuelitos</Text>
          <Text style={styles.topHeroSub}>
            Filtra por departamento, provincia, distrito o estado de urgencia para encontrar a quién apadrinar.
          </Text>
        </View>
      </View>

      {/* 2. CONTENIDO PRINCIPAL EN 2 COLUMNAS */}
      <View style={styles.wrapper}>
        <View style={styles.layoutColumns}>
          
          {/* PANEL IZQUIERDO DE FILTROS */}
          <View style={styles.sidebarFilter}>
            <View style={styles.filterHeadRow}>
              <Text style={styles.filterTitle}>⚙️ Filtros</Text>
              <TouchableOpacity onPress={limpiarFiltros}>
                <Text style={styles.btnLimpiar}>Limpiar</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Buscar por Nombre o Caserío:</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej: Pascual, Huayllay..." 
              value={busqueda} 
              onChangeText={setBusqueda} 
            />

            <Text style={styles.label}>1. Departamento:</Text>
            {Platform.OS === 'web' ? (
              <select style={styles.selectHtml} value={dpto} onChange={(e) => handleCambioDpto(e.target.value)}>
                {departamentosDisponibles.map((d) => <option key={d} value={d}>{d === 'Todos' ? '📍 Todos' : d}</option>)}
              </select>
            ) : null}

            <Text style={styles.label}>2. Provincia:</Text>
            {Platform.OS === 'web' ? (
              <select style={styles.selectHtml} value={provincia} onChange={(e) => handleCambioProv(e.target.value)} disabled={dpto === 'Todos'}>
                {provinciasDisponibles.map((p) => <option key={p} value={p}>{p === 'Todos' ? 'Todas' : p}</option>)}
              </select>
            ) : null}

            <Text style={styles.label}>3. Distrito:</Text>
            {Platform.OS === 'web' ? (
              <select style={styles.selectHtml} value={distrito} onChange={(e) => setDistrito(e.target.value)} disabled={provincia === 'Todos'}>
                {distritosDisponibles.map((dist) => <option key={dist} value={dist}>{dist === 'Todos' ? 'Todos' : dist}</option>)}
              </select>
            ) : null}

            <Text style={styles.label}>Rango de Edad:</Text>
            <View style={styles.edadRow}>
              {[
                { id: 'Todos', label: 'Todas' },
                { id: '60-74', label: '60-74' },
                { id: '75-84', label: '75-84' },
                { id: '85+', label: '85+' }
              ].map((r) => (
                <TouchableOpacity 
                  key={r.id} 
                  style={[styles.btnEdad, rangoEdad === r.id && styles.btnEdadActive]}
                  onPress={() => setRangoEdad(r.id)}
                >
                  <Text style={[styles.btnEdadText, rangoEdad === r.id && styles.btnEdadTextActive]}>{r.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.btnCheckUrgente, soloUrgentes && styles.btnCheckUrgenteActive]}
              onPress={() => setSoloUrgentes(!soloUrgentes)}
            >
              <Text style={styles.checkIcon}>{soloUrgentes ? '☑' : '☐'}</Text>
              <Text style={[styles.checkText, soloUrgentes && { color: '#E11D48', fontWeight: 'bold' }]}>
                Solo casos con urgencia
              </Text>
            </TouchableOpacity>
          </View>

          {/* COLUMNA DERECHA: RESULTADOS (3 POR FILA) */}
          <View style={styles.resultsArea}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                Mostrando <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>{resultados.length}</Text> {resultados.length === 1 ? 'abuelito encontrado' : 'abuelitos encontrados'}
              </Text>
            </View>

            {resultados.length === 0 ? (
              <View style={styles.emptyResults}>
                <Text style={styles.emptyResultsIcon}>🔍</Text>
                <Text style={styles.emptyResultsTitle}>No se encontraron casos con estos filtros</Text>
                <Text style={styles.emptyResultsSub}>Intenta limpiando los filtros para ver todos los casos.</Text>
                <TouchableOpacity style={styles.btnReset} onPress={limpiarFiltros}>
                  <Text style={styles.btnResetText}>Restablecer Filtros</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.grid3Cols}>
                {resultados.map((item) => (
                  <View key={item.id} style={styles.colItem}>
                    <AbuelitoCard item={item} onSelect={onSelectAbuelito} />
                  </View>
                ))}
              </View>
            )}
          </View>

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topHeroBanner: {
    backgroundColor: '#0F172A',
    backgroundImage: Platform.OS === 'web' 
      ? 'linear-gradient(135deg, #0B0F19 0%, #1E293B 100%)' 
      : undefined,
    paddingVertical: 38,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  topHeroContent: {
    maxWidth: 1400,
    width: '100%',
    alignSelf: 'center',
  },
  topHeroTag: {
    color: '#FF385C',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  topHeroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  topHeroSub: {
    fontSize: 14,
    color: '#94A3B8',
    maxWidth: 700,
    lineHeight: 20,
  },
  wrapper: { maxWidth: 1400, width: '100%', alignSelf: 'center', padding: 20 },
  layoutColumns: { flexDirection: 'row', gap: 20, flexWrap: 'wrap' },
  sidebarFilter: { width: 250, backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', height: 'fit-content' },
  filterHeadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderColor: '#F1F5F9', paddingBottom: 6 },
  filterTitle: { fontSize: 15, fontWeight: '900', color: '#0F172A' },
  btnLimpiar: { fontSize: 12, color: '#FF385C', fontWeight: 'bold' },
  label: { fontSize: 11, fontWeight: 'bold', color: '#334155', marginTop: 8, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, fontSize: 12, outlineStyle: 'none' },
  selectHtml: { width: '100%', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 6, fontSize: 12, outline: 'none', cursor: 'pointer' },
  edadRow: { flexDirection: 'row', gap: 4, marginTop: 4, flexWrap: 'wrap' },
  btnEdad: { flex: 1, minWidth: 45, backgroundColor: '#F1F5F9', paddingVertical: 5, borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  btnEdadActive: { backgroundColor: '#FF385C', borderColor: '#FF385C' },
  btnEdadText: { fontSize: 10, fontWeight: '600', color: '#475569' },
  btnEdadTextActive: { color: '#FFF', fontWeight: 'bold' },
  btnCheckUrgente: { flexDirection: 'row', alignItems: 'center', marginTop: 12, padding: 8, borderRadius: 8, backgroundColor: '#FFF1F2', borderWidth: 1, borderColor: '#FECDD3' },
  btnCheckUrgenteActive: { backgroundColor: '#FFE4E6', borderColor: '#FDA4AF' },
  checkIcon: { fontSize: 14, marginRight: 6, color: '#E11D48' },
  checkText: { fontSize: 10, color: '#9F1239', flex: 1 },
  resultsArea: { flex: 1, minWidth: 320 },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  resultsCount: { fontSize: 13, color: '#64748B' },
  grid3Cols: {
    display: Platform.OS === 'web' ? 'grid' : 'flex',
    gridTemplateColumns: Platform.OS === 'web' ? 'repeat(3, 1fr)' : undefined,
    gap: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  colItem: {
    width: '100%',
  },
  emptyResults: { backgroundColor: '#FFF', padding: 40, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', marginTop: 20 },
  emptyResultsIcon: { fontSize: 36, marginBottom: 10 },
  emptyResultsTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  emptyResultsSub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 16 },
  btnReset: { backgroundColor: '#FF385C', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  btnResetText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 }
});