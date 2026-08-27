import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { 
  getAdminResumen, getCasosPendientes, aprobarCaso, eliminarCaso, 
  getHeroConfig, updateHeroConfig, getDonacionesPendientes, validarDonacionAdmin, rechazarDonacionAdmin,
  getAdminBodegas, crearBodegaAdmin, toggleEstadoBodega, toggleEstadoAbuelito, getAbuelitos
} from '../services/api';

export default function AdminScreen({ onVerCaso, onEditarCaso, onCerrarSesionAdmin }) {
  const [tabAdmin, setTabAdmin] = useState('abuelitos_mgr'); // 'abuelitos_mgr', 'donaciones_val', 'bodegas_mgr', 'pendientes', 'hero_cms'
  const [resumen, setResumen] = useState({ total_activos: 0, total_pendientes: 0, total_donado: 0, total_entregas: 0 });
  const [pendientes, setPendientes] = useState([]);
  const [donacionesPendientes, setDonacionesPendientes] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [todosAbuelitos, setTodosAbuelitos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Formulario Crear Bodega
  const [modalCrearBodega, setModalCrearBodega] = useState(false);
  const [formBodega, setFormBodega] = useState({
    nombre_comercio: '', dueno_nombre: '', telefono_yape_plin: '',
    banco: 'Banco de la Nación', numero_cuenta: '', direccion_referencia: '',
    caserio_comunidad: '', distrito: 'Calca', provincia: 'Calca', departamento: 'Cusco',
    usuario: '', password: ''
  });

  // Estados CMS Portada
  const [heroForm, setHeroForm] = useState({ tagline: '', titulo: '', color_fondo: '#0F172A', foto_existente: '' });
  const [nuevaFotoBanner, setNuevaFotoBanner] = useState(null);
  const [guardandoHero, setGuardandoHero] = useState(false);

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    setLoading(true);
    const dataRes = await getAdminResumen();
    const dataPen = await getCasosPendientes();
    const dataDon = await getDonacionesPendientes();
    const dataBod = await getAdminBodegas();
    const dataAbu = await getAbuelitos();
    const dataHero = await getHeroConfig();
    
    setResumen(dataRes);
    setPendientes(dataPen);
    setDonacionesPendientes(dataDon);
    setBodegas(dataBod);
    setTodosAbuelitos(dataAbu);
    setHeroForm({
      tagline: dataHero.tagline || 'CONECTANDO CORAZONES, TRANSFORMANDO VIDAS:',
      titulo: dataHero.titulo || 'Apadrina una Sonrisa en el Perú Profundo',
      color_fondo: dataHero.color_fondo || '#0F172A',
      foto_existente: dataHero.foto_banner_url || ''
    });
    setLoading(false);
  };

  const handleValidarDonacion = async (id, monto, abuelitoNombre) => {
    if (confirm(`¿Validar comprobante de S/ ${monto} para ${abuelitoNombre}? Se sumará al saldo inmediatamente.`)) {
      const res = await validarDonacionAdmin(id);
      if (res.success) {
        alert('✅ Donación validada. Saldo acreditado.');
        cargarTodo();
      }
    }
  };

  const handleRechazarDonacion = async (id) => {
    if (confirm('¿Descartar este comprobante?')) {
      const res = await rechazarDonacionAdmin(id);
      if (res.success) {
        alert('🗑️ Donación descartada.');
        cargarTodo();
      }
    }
  };

  const handleToggleBodega = async (id, nombre, estadoActual) => {
    const accion = estadoActual === 'activo' ? 'SUSPENDER' : 'ACTIVAR';
    if (confirm(`¿Estás seguro de ${accion} a ${nombre}?`)) {
      await toggleEstadoBodega(id);
      cargarTodo();
    }
  };

  const handleToggleAbuelito = async (id, nombre, estadoActual) => {
    const accion = estadoActual === 'activo' ? 'SUSPENDER' : 'ACTIVAR';
    if (confirm(`¿Estás seguro de ${accion} a ${nombre}?`)) {
      await toggleEstadoAbuelito(id);
      cargarTodo();
    }
  };

  const handleCrearBodegaSubmit = async () => {
    if (!formBodega.nombre_comercio || !formBodega.telefono_yape_plin || !formBodega.usuario || !formBodega.password) {
      alert('Completa los campos obligatorios (*)');
      return;
    }
    const res = await crearBodegaAdmin(formBodega);
    if (res.success) {
      alert('✅ ¡Bodega creada con éxito!');
      setModalCrearBodega(false);
      cargarTodo();
    } else {
      alert(res.error || 'Error al crear bodega.');
    }
  };

  const pickBannerImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.85 });
    if (!result.canceled) setNuevaFotoBanner(result.assets[0]);
  };

  const handleGuardarHero = async () => {
    setGuardandoHero(true);
    const formData = new FormData();
    formData.append('tagline', heroForm.tagline);
    formData.append('titulo', heroForm.titulo);
    formData.append('color_fondo', heroForm.color_fondo);
    formData.append('foto_existente', heroForm.foto_existente);

    if (nuevaFotoBanner) {
      if (nuevaFotoBanner.file) formData.append('foto_banner', nuevaFotoBanner.file);
      else formData.append('foto_banner', { uri: nuevaFotoBanner.uri, name: 'hero.jpg', type: 'image/jpeg' });
    }

    const res = await updateHeroConfig(formData);
    setGuardandoHero(false);
    if (res.success) {
      alert('✅ Portada y textos actualizados con éxito.');
      cargarTodo();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        
        {/* CABECERA ADMIN */}
        <View style={styles.topAdminRow}>
          <Text style={styles.title}>🔐 Panel de Control — abuelitos.pe</Text>
          <TouchableOpacity style={styles.btnCerrarSesion} onPress={onCerrarSesionAdmin}>
            <Text style={styles.btnCerrarSesionText}>Cerrar Sesión Admin</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sub}>Supervisión nacional, edición de casos, validación de donaciones y gestión de bodegas.</Text>

        {/* MÉTRICAS */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricNum}>{resumen.total_activos}</Text>
            <Text style={styles.metricLabel}>Abuelitos Activos</Text>
          </View>
          <View style={[styles.metricCard, { borderColor: '#E11D48' }]}>
            <Text style={[styles.metricNum, { color: '#E11D48' }]}>{donacionesPendientes.length}</Text>
            <Text style={styles.metricLabel}>Vouchers por Validar</Text>
          </View>
          <View style={[styles.metricCard, { borderColor: '#EA580C' }]}>
            <Text style={[styles.metricNum, { color: '#EA580C' }]}>{bodegas.length}</Text>
            <Text style={styles.metricLabel}>Bodegas Aliadas</Text>
          </View>
          <View style={[styles.metricCard, { borderColor: '#16A34A' }]}>
            <Text style={[styles.metricNum, { color: '#16A34A' }]}>S/ {parseFloat(resumen.total_donado || 0).toFixed(2)}</Text>
            <Text style={styles.metricLabel}>Total Donado</Text>
          </View>
        </View>

        {/* PESTAÑAS */}
        <View style={styles.tabsRow}>
          <TouchableOpacity style={[styles.adminTab, tabAdmin === 'abuelitos_mgr' && styles.adminTabActive]} onPress={() => setTabAdmin('abuelitos_mgr')}>
            <Text style={[styles.adminTabText, tabAdmin === 'abuelitos_mgr' && styles.adminTabTextActive]}>👥 Abuelitos ({todosAbuelitos.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.adminTab, tabAdmin === 'donaciones_val' && styles.adminTabActive]} onPress={() => setTabAdmin('donaciones_val')}>
            <Text style={[styles.adminTabText, tabAdmin === 'donaciones_val' && styles.adminTabTextActive]}>💳 Validar Donaciones ({donacionesPendientes.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.adminTab, tabAdmin === 'bodegas_mgr' && styles.adminTabActive]} onPress={() => setTabAdmin('bodegas_mgr')}>
            <Text style={[styles.adminTabText, tabAdmin === 'bodegas_mgr' && styles.adminTabTextActive]}>🏪 Bodegas ({bodegas.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.adminTab, tabAdmin === 'hero_cms' && styles.adminTabActive]} onPress={() => setTabAdmin('hero_cms')}>
            <Text style={[styles.adminTabText, tabAdmin === 'hero_cms' && styles.adminTabTextActive]}>🎨 Portada CMS</Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: GESTIÓN Y EDICIÓN DE ABUELITOS */}
        {tabAdmin === 'abuelitos_mgr' && (
          <View>
            <Text style={styles.secTitle}>👥 Gestión, Edición y Control de Abuelitos</Text>
            <View style={styles.list}>
              {todosAbuelitos.map((a) => (
                <View key={a.id} style={styles.voucherCard}>
                  <Image source={{ uri: a.foto_url }} style={styles.avatarMini} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.vAbuelito}>{a.nombre_completo} ({a.edad} años) — DNI: {a.dni}</Text>
                    <Text style={styles.vBodega}>📍 {a.caserio}, {a.provincia}</Text>
                    <Text style={[styles.badgeEstado, a.estado === 'suspendido' ? styles.bgRojo : styles.bgVerde]}>
                      Estado: {a.estado === 'suspendido' ? 'SUSPENDIDO' : 'PUBLICADO / ACTIVO'}
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {/* BOTÓN EDITAR CASO PARA EL ADMIN */}
                    <TouchableOpacity style={styles.btnEditarAdmin} onPress={() => onEditarCaso(a)}>
                      <Text style={styles.btnEditarAdminText}>✏️ Editar</Text>
                    </TouchableOpacity>

                    {/* BOTÓN SUSPENDER */}
                    <TouchableOpacity 
                      style={[styles.btnToggle, a.estado === 'suspendido' ? styles.btnReactivar : styles.btnSuspender]} 
                      onPress={() => handleToggleAbuelito(a.id, a.nombre_completo, a.estado)}
                    >
                      <Text style={styles.btnToggleText}>{a.estado === 'suspendido' ? '✓ Reactivar' : '🚫 Suspender'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 2: VALIDACIÓN DE VOUCHERS */}
        {tabAdmin === 'donaciones_val' && (
          <View>
            <Text style={styles.secTitle}>💳 Comprobantes de Yape / Plin por Revisar</Text>
            {donacionesPendientes.length === 0 ? (
              <View style={styles.emptyCard}><Text style={styles.emptyText}>✓ Todos los comprobantes están al día.</Text></View>
            ) : (
              <View style={styles.list}>
                {donacionesPendientes.map((d) => (
                  <View key={d.id} style={styles.voucherCard}>
                    <Image source={{ uri: d.foto_voucher_url || 'https://via.placeholder.com/150' }} style={styles.voucherImg} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.vMonto}>Monto: <Text style={{ color: '#16A34A' }}>S/ {d.monto}</Text></Text>
                      <Text style={styles.vAbuelito}>Para: <Text style={{ fontWeight: 'bold' }}>{d.abuelito_nombre}</Text> ({d.caserio})</Text>
                      <Text style={styles.vBodega}>🏪 Bodega: {d.bodega_nombre || 'Bodega Local'}</Text>
                      <Text style={styles.vDetalle}>Donante: {d.donante_nombre} | Op: {d.codigo_operacion}</Text>
                      <Text style={styles.vFecha}>🗓️ {new Date(d.fecha).toLocaleString('es-PE')}</Text>
                      <View style={styles.actionsRow}>
                        <TouchableOpacity style={styles.btnAprobar} onPress={() => handleValidarDonacion(d.id, d.monto, d.abuelito_nombre)}>
                          <Text style={styles.btnAprobarText}>✓ Validar Saldo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnRechazar} onPress={() => handleRechazarDonacion(d.id)}>
                          <Text style={styles.btnRechazarText}>✕ Descartar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* TAB 3: GESTIÓN DE BODEGAS */}
        {tabAdmin === 'bodegas_mgr' && (
          <View>
            <View style={styles.headRowFlex}>
              <Text style={styles.secTitle}>🏪 Bodegas Aliadas Registradas</Text>
              <TouchableOpacity style={styles.btnCrearBodega} onPress={() => setModalCrearBodega(true)}>
                <Text style={styles.btnCrearBodegaText}>+ Registrar Nueva Bodega</Text>
              </TouchableOpacity>
            </View>

            {modalCrearBodega && (
              <View style={styles.formCrearCard}>
                <Text style={styles.formCrearTitle}>📝 Crear Nueva Bodega y Credenciales</Text>
                
                <TextInput style={styles.input} placeholder="Nombre de la Bodega *" value={formBodega.nombre_comercio} onChangeText={(v) => setFormBodega({ ...formBodega, nombre_comercio: v })} />
                <TextInput style={styles.input} placeholder="Nombre del Dueño(a)" value={formBodega.dueno_nombre} onChangeText={(v) => setFormBodega({ ...formBodega, dueno_nombre: v })} />
                <TextInput style={styles.input} placeholder="Número Yape / Plin *" keyboardType="phone-pad" value={formBodega.telefono_yape_plin} onChangeText={(v) => setFormBodega({ ...formBodega, telefono_yape_plin: v })} />
                <TextInput style={styles.input} placeholder="Caserío / Comunidad *" value={formBodega.caserio_comunidad} onChangeText={(v) => setFormBodega({ ...formBodega, caserio_comunidad: v })} />
                
                <Text style={styles.label}>Credenciales de Acceso para el Bodeguero:</Text>
                <TextInput style={styles.input} placeholder="Usuario (Ej: bodega_cusco) *" autoCapitalize="none" value={formBodega.usuario} onChangeText={(v) => setFormBodega({ ...formBodega, usuario: v })} />
                <TextInput style={styles.input} placeholder="Contraseña *" value={formBodega.password} onChangeText={(v) => setFormBodega({ ...formBodega, password: v })} />

                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.btnAprobar} onPress={handleCrearBodegaSubmit}><Text style={styles.btnAprobarText}>Guardar Bodega</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.btnRechazar} onPress={() => setModalCrearBodega(false)}><Text style={styles.btnRechazarText}>Cancelar</Text></TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.list}>
              {bodegas.map((b) => (
                <View key={b.id} style={styles.voucherCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.vAbuelito}>🏪 {b.nombre_comercio} ({b.dueno_nombre})</Text>
                    <Text style={styles.vBodega}>📍 {b.caserio_comunidad}, {b.distrito}</Text>
                    <Text style={styles.vDetalle}>📱 Yape: {b.telefono_yape_plin} | Usuario: <Text style={{ fontWeight: 'bold' }}>{b.usuario || 'Sin usuario'}</Text></Text>
                    <Text style={[styles.badgeEstado, b.estado === 'suspendido' ? styles.bgRojo : styles.bgVerde]}>
                      Estado: {b.estado === 'suspendido' ? 'SUSPENDIDA' : 'ACTIVA'}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.btnToggle, b.estado === 'suspendido' ? styles.btnReactivar : styles.btnSuspender]} 
                    onPress={() => handleToggleBodega(b.id, b.nombre_comercio, b.estado)}
                  >
                    <Text style={styles.btnToggleText}>{b.estado === 'suspendido' ? '✓ Reactivar' : '🚫 Suspender'}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 4: CMS PORTADA */}
        {tabAdmin === 'hero_cms' && (
          <View style={styles.cmsCard}>
            <Text style={styles.cmsTitle}>🖼️ Gestor de la Portada Principal</Text>
            <Text style={styles.label}>Tagline Rojo:</Text>
            <TextInput style={styles.input} value={heroForm.tagline} onChangeText={(v) => setHeroForm({ ...heroForm, tagline: v })} />
            <Text style={styles.label}>Título Principal:</Text>
            <TextInput style={styles.input} value={heroForm.titulo} onChangeText={(v) => setHeroForm({ ...heroForm, titulo: v })} />
            
            <Text style={styles.label}>Fotografía del Abuelito en Portada:</Text>
            <TouchableOpacity style={styles.btnPickBanner} onPress={pickBannerImage}>
              <Text style={styles.btnPickBannerText}>📷 {nuevaFotoBanner ? '✓ Nueva Foto Lista' : 'Seleccionar Nueva Foto de Portada'}</Text>
            </TouchableOpacity>

            <View style={{ alignItems: 'center', marginVertical: 10 }}>
              <Image source={{ uri: nuevaFotoBanner ? nuevaFotoBanner.uri : heroForm.foto_existente }} style={{ width: 260, height: 160, borderRadius: 12 }} />
            </View>

            <TouchableOpacity style={styles.btnGuardarHero} onPress={handleGuardarHero} disabled={guardandoHero}>
              {guardandoHero ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnGuardarHeroText}>💾 Guardar Cambios en Portada</Text>}
            </TouchableOpacity>
          </View>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  wrapper: { maxWidth: 1050, alignSelf: 'center', width: '100%' },
  topAdminRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '900', color: '#1E293B' },
  btnCerrarSesion: { backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  btnCerrarSesionText: { fontSize: 12, fontWeight: 'bold', color: '#991B1B' },
  sub: { fontSize: 13, color: '#64748B', marginBottom: 20 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 20 },
  metricCard: { backgroundColor: '#FFF', flex: 1, minWidth: 180, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', elevation: 2 },
  metricNum: { fontSize: 22, fontWeight: '900', color: '#FF385C' },
  metricLabel: { fontSize: 11, color: '#64748B', fontWeight: 'bold', marginTop: 3 },
  tabsRow: { flexDirection: 'row', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  adminTab: { paddingVertical: 9, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#E2E8F0' },
  adminTabActive: { backgroundColor: '#0F172A' },
  adminTabText: { fontSize: 12, fontWeight: 'bold', color: '#475569' },
  adminTabTextActive: { color: '#FFF' },
  secTitle: { fontSize: 17, fontWeight: '900', color: '#1E293B', marginBottom: 12 },
  headRowFlex: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  btnCrearBodega: { backgroundColor: '#16A34A', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  btnCrearBodegaText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  formCrearCard: { backgroundColor: '#FFF', padding: 18, borderRadius: 14, borderWidth: 2, borderColor: '#16A34A', marginBottom: 20 },
  formCrearTitle: { fontSize: 15, fontWeight: 'bold', color: '#16A34A', marginBottom: 10 },
  list: { gap: 10 },
  voucherCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 14, alignItems: 'center', flexWrap: 'wrap' },
  voucherImg: { width: 110, height: 130, borderRadius: 8, resizeMode: 'contain', backgroundColor: '#0F172A' },
  avatarMini: { width: 55, height: 55, borderRadius: 28, resizeMode: 'cover' },
  vMonto: { fontSize: 16, fontWeight: '900', color: '#0F172A', marginBottom: 2 },
  vAbuelito: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  vBodega: { fontSize: 12, color: '#EA580C', fontWeight: '600' },
  vDetalle: { fontSize: 11, color: '#64748B', marginVertical: 2 },
  vFecha: { fontSize: 10, color: '#94A3B8', marginBottom: 6 },
  badgeEstado: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, fontSize: 10, fontWeight: 'bold', marginTop: 4 },
  bgVerde: { backgroundColor: '#DCFCE7', color: '#166534' },
  bgRojo: { backgroundColor: '#FEE2E2', color: '#991B1B' },
  btnEditarAdmin: { backgroundColor: '#2563EB', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  btnEditarAdminText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  btnToggle: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  btnSuspender: { backgroundColor: '#FEE2E2' },
  btnReactivar: { backgroundColor: '#DCFCE7' },
  btnToggleText: { fontSize: 11, fontWeight: 'bold', color: '#1E293B' },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  btnAprobar: { backgroundColor: '#16A34A', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  btnAprobarText: { color: '#FFF', fontWeight: 'bold', fontSize: 11 },
  btnRechazar: { backgroundColor: '#EF4444', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  btnRechazarText: { color: '#FFF', fontWeight: 'bold', fontSize: 11 },
  cmsCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  cmsTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  label: { fontSize: 11, fontWeight: 'bold', color: '#334155', marginTop: 6, marginBottom: 2 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 7, fontSize: 12, marginBottom: 6, outlineStyle: 'none' },
  btnPickBanner: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 8, alignItems: 'center', marginVertical: 10 },
  btnPickBannerText: { color: '#2563EB', fontWeight: 'bold', fontSize: 12 },
  btnGuardarHero: { backgroundColor: '#16A34A', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  btnGuardarHeroText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  emptyCard: { backgroundColor: '#F0FDF4', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#BBF7D0', alignItems: 'center' },
  emptyText: { color: '#166534', fontWeight: 'bold', fontSize: 13 }
});