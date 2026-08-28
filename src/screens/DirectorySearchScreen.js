import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Modal, useWindowDimensions, Platform } from 'react-native';
import AbuelitoCard from '../components/AbuelitoCard';
import { ubigeoPeru } from '../utils/ubigeoPeru';

export default function DirectorySearchScreen({ abuelitos = [], onSelectAbuelito, dptoInicial = 'Todos' }) {
  const { width } = useWindowDimensions();
  const esEscritorio = width > 768;

  const departamentosDisponibles = ['Todos', ...Object.keys(ubigeoPeru)];

  const [dpto, setDpto] = useState(dptoInicial);
  const [provincia, setProvincia] = useState('Todos');
  const [distrito, setDistrito] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [rangoEdad, setRangoEdad] = useState('Todos');
  const [soloUrgentes, setSoloUrgentes] = useState(false);

  // Modales de selección para Móvil
  const [modalSelector, setModalSelector] = useState(null); // 'dpto', 'prov', 'dist'

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
    setModalSelector(null);
  };

  const handleCambioProv = (nuevaProv) => {
    setProvincia(nuevaProv);
    setDistrito('Todos');
    setModalSelector(null);
  };

  const handleCambioDist = (nuevoDist) => {
    setDistrito(nuevoDist);
    setModalSelector(null);
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
      {/* 1. BANNER SUPERIOR */}
      <View style={styles.topHeroBanner}>
        <View style={styles.topHeroContent}>
          <Text style={styles.topHeroTag}>DIRECTORIO NACIONAL SOLIDARIO</Text>
          <Text style={styles.topHeroTitle}>Directorio General de Abuelitos</Text>
          <Text style={styles.topHeroSub}>
            Filtra por departamento, provincia, distrito o urgencia.
          </Text>
        </View>
      </View>

      {/* 2. CONTENIDO */}
      <View style={styles.wrapper}>
        <View style={[styles.layoutColumns, !esEscritorio && styles.layoutColumnMovil]}>
          
          {/* PANEL DE FILTROS */}
          <View style={[styles.sidebarFilter, !esEscritorio && styles.sidebarFilterMovil]}>
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

            {/* 1. DEPARTAMENTO (COMPATIBLE CON CELULAR Y WEB) */}
            <Text style={styles.label}>1. Departamento:</Text>
            {Platform.OS === 'web' && esEscritorio ? (
              <select style={styles.selectHtml} value={dpto} onChange={(e) => handleCambioDpto(e.target.value)}>
                {departamentosDisponibles.map((d) => <option key={d} value={d}>{d === 'Todos' ? '📍 Todos' : d}</option>)}
              </select>
            ) : (
              <TouchableOpacity style={styles.btnSelectorMovil} onPress={() => setModalSelector('dpto')}>
                <Text style={styles.btnSelectorMovilText} numberOfLines={1}>
                  {dpto === 'Todos' ? '📍 Todos los Departamentos' : `📍 ${dpto}`} ▼
                </Text>
              </TouchableOpacity>
            )}

            {/* 2. PROVINCIA (COMPATIBLE CON CELULAR Y WEB) */}
            <Text style={styles.label}>2. Provincia:</Text>
            {Platform.OS === 'web' && esEscritorio ? (
              <select style={styles.selectHtml} value={provincia} onChange={(e) => handleCambioProv(e.target.value)} disabled={dpto === 'Todos'}>
                {provinciasDisponibles.map((p) => <option key={p} value={p}>{p === 'Todos' ? 'Todas' : p}</option>)}
              </select>
            ) : (
              <TouchableOpacity 
                style={[styles.btnSelectorMovil, dpto === 'Todos' && styles.btnDisabled]} 
                onPress={() => dpto !== 'Todos' && setModalSelector('prov')}
              >
                <Text style={styles.btnSelectorMovilText} numberOfLines={1}>
                  {provincia === 'Todos' ? 'Todas las Provincias' : provincia} ▼
                </Text>
              </TouchableOpacity>
            )}

            {/* 3. DISTRITO (COMPATIBLE CON CELULAR Y WEB) */}
            <Text style={styles.label}>3. Distrito:</Text>
            {Platform.OS === 'web' && esEscritorio ? (
              <select style={styles.selectHtml} value={distrito} onChange={(e) => setDistrito(e.target.value)} disabled={provincia === 'Todos'}>
                {distritosDisponibles.map((dist) => <option key={dist} value={dist}>{dist === 'Todos' ? 'Todos' : dist}</option>)}
              </select>
            ) : (
              <TouchableOpacity 
                style={[styles.btnSelectorMovil, provincia === 'Todos' && styles.btnDisabled]} 
                onPress={() => provincia !== 'Todos' && setModalSelector('dist')}
              >
                <Text style={styles.btnSelectorMovilText} numberOfLines={1}>
                  {distrito === 'Todos' ? 'Todos los Distritos' : distrito} ▼
                </Text>
              </TouchableOpacity>
            )}

            {/* EDAD */}
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

          {/* RESULTADOS */}
          <View style={styles.resultsArea}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                Mostrando <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>{resultados.length}</Text> {resultados.length === 1 ? 'caso encontrado' : 'casos encontrados'}
              </Text>
            </View>

            {resultados.length === 0 ? (
              <View style={styles.emptyResults}>
                <Text style={styles.emptyResultsIcon}>🔍</Text>
                <Text style={styles.emptyResultsTitle}>No se encontraron casos</Text>
                <Text style={styles.emptyResultsSub}>Intenta limpiando los filtros para ver todos los casos.</Text>
                <TouchableOpacity style={styles.btnReset} onPress={limpiarFiltros}>
                  <Text style={styles.btnResetText}>Restablecer Filtros</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.grid, esEscritorio ? styles.gridDesktop3Cols : styles.gridMovil1Col]}>
                {resultados.map((item) => (
                  <AbuelitoCard key={item.id} item={item} onSelect={onSelectAbuelito} />
                ))}
              </View>
            )}
          </View>

        </View>
      </View>

      {/* MODAL NATIVO TÁCTIL PARA CELULARES */}
      <Modal visible={!!modalSelector} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalSelector(null)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalCardTitle}>
              {modalSelector === 'dpto' ? 'Selecciona un Departamento' : (modalSelector === 'prov' ? 'Selecciona una Provincia' : 'Selecciona un Distrito')}
            </Text>

            <ScrollView style={{ maxHeight: 350 }}>
              {modalSelector === 'dpto' && departamentosDisponibles.map((item) => (
                <TouchableOpacity key={item} style={styles.modalOption} onPress={() => handleCambioDpto(item)}>
                  <Text style={[styles.modalOptionText, dpto === item && styles.modalOptionTextActive]}>
                    {item === 'Todos' ? '📍 Todos los Departamentos' : `📍 ${item}`}
                  </Text>
                </TouchableOpacity>
              ))}

              {modalSelector === 'prov' && provinciasDisponibles.map((item) => (
                <TouchableOpacity key={item} style={styles.modalOption} onPress={() => handleCambioProv(item)}>
                  <Text style={[styles.modalOptionText, provincia === item && styles.modalOptionTextActive]}>
                    {item === 'Todos' ? 'Todas las Provincias' : item}
                  </Text>
                </TouchableOpacity>
              ))}

              {modalSelector === 'dist' && distritosDisponibles.map((item) => (
                <TouchableOpacity key={item} style={styles.modalOption} onPress={() => handleCambioDist(item)}>
                  <Text style={[styles.modalOptionText, distrito === item && styles.modalOptionTextActive]}>
                    {item === 'Todos' ? 'Todos los Distritos' : item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.btnCerrarModal} onPress={() => setModalSelector(null)}>
              <Text style={styles.btnCerrarModalText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topHeroBanner: {
    backgroundColor: '#0F172A',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  topHeroContent: { maxWidth: 1400, width: '100%', alignSelf: 'center' },
  topHeroTag: { color: '#FF385C', fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 4 },
  topHeroTitle: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  topHeroSub: { fontSize: 13, color: '#94A3B8', maxWidth: 700, lineHeight: 18 },
  wrapper: { maxWidth: 1400, width: '100%', alignSelf: 'center', padding: 16 },
  layoutColumns: { flexDirection: 'row', gap: 20 },
  layoutColumnMovil: { flexDirection: 'column' },
  sidebarFilter: { width: 250, backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', height: 'fit-content' },
  sidebarFilterMovil: { width: '100%', marginBottom: 15 },
  filterHeadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderColor: '#F1F5F9', paddingBottom: 6 },
  filterTitle: { fontSize: 15, fontWeight: '900', color: '#0F172A' },
  btnLimpiar: { fontSize: 12, color: '#FF385C', fontWeight: 'bold' },
  label: { fontSize: 11, fontWeight: 'bold', color: '#334155', marginTop: 8, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 8, fontSize: 13, outlineStyle: 'none' },
  selectHtml: { width: '100%', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 8, fontSize: 13, outline: 'none', cursor: 'pointer' },
  btnSelectorMovil: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  btnSelectorMovilText: { fontSize: 13, fontWeight: 'bold', color: '#1E293B' },
  btnDisabled: { opacity: 0.5 },
  edadRow: { flexDirection: 'row', gap: 4, marginTop: 4, flexWrap: 'wrap' },
  btnEdad: { flex: 1, minWidth: 45, backgroundColor: '#F1F5F9', paddingVertical: 6, borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  btnEdadActive: { backgroundColor: '#FF385C', borderColor: '#FF385C' },
  btnEdadText: { fontSize: 10, fontWeight: '600', color: '#475569' },
  btnEdadTextActive: { color: '#FFF', fontWeight: 'bold' },
  btnCheckUrgente: { flexDirection: 'row', alignItems: 'center', marginTop: 12, padding: 10, borderRadius: 8, backgroundColor: '#FFF1F2', borderWidth: 1, borderColor: '#FECDD3' },
  btnCheckUrgenteActive: { backgroundColor: '#FFE4E6', borderColor: '#FDA4AF' },
  checkIcon: { fontSize: 14, marginRight: 6, color: '#E11D48' },
  checkText: { fontSize: 11, color: '#9F1239', flex: 1 },
  resultsArea: { flex: 1, width: '100%' },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  resultsCount: { fontSize: 13, color: '#64748B' },
  grid: { width: '100%' },
  gridDesktop3Cols: {
    display: Platform.OS === 'web' ? 'grid' : 'flex',
    gridTemplateColumns: Platform.OS === 'web' ? 'repeat(3, 1fr)' : undefined,
    gap: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridMovil1Col: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  emptyResults: { backgroundColor: '#FFF', padding: 40, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', marginTop: 20 },
  emptyResultsIcon: { fontSize: 36, marginBottom: 10 },
  emptyResultsTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  emptyResultsSub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 16 },
  btnReset: { backgroundColor: '#FF385C', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  btnResetText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, maxWidth: 340, width: '100%' },
  modalCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 12, textAlign: 'center', borderBottomWidth: 1, borderColor: '#E2E8F0', paddingBottom: 8 },
  modalOption: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginVertical: 2 },
  modalOptionText: { fontSize: 13, color: '#334155', fontWeight: '600' },
  modalOptionTextActive: { color: '#FF385C', fontWeight: 'bold' },
  btnCerrarModal: { backgroundColor: '#0F172A', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  btnCerrarModalText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 }
});