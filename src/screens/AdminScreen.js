import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAdminResumen, getCasosPendientes, aprobarCaso, eliminarCaso, getHeroConfig, updateHeroConfig } from '../services/api';

export default function AdminScreen({ onVerCaso }) {
  const [pinIngresado, setPinIngresado] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const PIN_CORRECTO = '1234';

  const [tabAdmin, setTabAdmin] = useState('pendientes'); // 'pendientes', 'hero_cms'
  const [resumen, setResumen] = useState({ total_activos: 0, total_pendientes: 0, total_donado: 0, total_entregas: 0 });
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados del Gestor de Portada (CMS)
  const [heroForm, setHeroForm] = useState({
    tagline: '',
    titulo: '',
    color_fondo: '#1E232B',
    foto_existente: ''
  });
  const [nuevaFotoBanner, setNuevaFotoBanner] = useState(null);
  const [guardandoHero, setGuardandoHero] = useState(false);

  const verificarPin = () => {
    if (pinIngresado === PIN_CORRECTO) {
      setAutenticado(true);
      cargarTodo();
    } else {
      alert('❌ PIN de administración incorrecto.');
    }
  };

  const cargarTodo = async () => {
    setLoading(true);
    const dataRes = await getAdminResumen();
    const dataPen = await getCasosPendientes();
    const dataHero = await getHeroConfig();
    
    setResumen(dataRes);
    setPendientes(dataPen);
    setHeroForm({
      tagline: dataHero.tagline || 'CONECTANDO CORAZONES, TRANSFORMANDO VIDAS:',
      titulo: dataHero.titulo || 'Apadrina una Sonrisa en el Perú Profundo',
      color_fondo: dataHero.color_fondo || '#1E232B',
      foto_existente: dataHero.foto_banner_url || ''
    });
    setLoading(false);
  };

  const pickBannerImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
    });
    if (!result.canceled) {
      setNuevaFotoBanner(result.assets[0]);
    }
  };

  const handleGuardarHero = async () => {
    setGuardandoHero(true);
    const formData = new FormData();
    formData.append('tagline', heroForm.tagline);
    formData.append('titulo', heroForm.titulo);
    formData.append('color_fondo', heroForm.color_fondo);
    formData.append('foto_existente', heroForm.foto_existente);

    if (nuevaFotoBanner) {
      if (nuevaFotoBanner.file) {
        formData.append('foto_banner', nuevaFotoBanner.file);
      } else {
        const uriParts = nuevaFotoBanner.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('foto_banner', {
          uri: nuevaFotoBanner.uri,
          name: `hero_banner.${fileType}`,
          type: `image/${fileType}`
        });
      }
    }

    const res = await updateHeroConfig(formData);
    setGuardandoHero(false);

    if (res.success) {
      alert('✅ Portada y textos actualizados con éxito en abuelitos.pe');
      cargarTodo();
    } else {
      alert('❌ Error al guardar los cambios de la portada.');
    }
  };

  const handleAprobar = async (id) => {
    if (confirm('¿Deseas validar este caso y publicarlo en abuelitos.pe?')) {
      const res = await aprobarCaso(id, { autoridad_id: 1, bodega_id: 1 });
      if (res.success) {
        alert('✅ Caso aprobado y publicado con éxito.');
        cargarTodo();
      }
    }
  };

  const handleEliminar = async (id) => {
    if (confirm('¿Estás seguro de descartar y eliminar este caso?')) {
      const res = await eliminarCaso(id);
      if (res.success) {
        alert('🗑️ Caso eliminado.');
        cargarTodo();
      }
    }
  };

  if (!autenticado) {
    return (
      <View style={styles.loginContainer}>
        <View style={styles.loginCard}>
          <Text style={styles.loginIcon}>🔐</Text>
          <Text style={styles.loginTitle}>Acceso de Administración</Text>
          <Text style={styles.loginSub}>Ingresa tu PIN de seguridad para gestionar abuelitos.pe</Text>

          <TextInput 
            style={styles.pinInput}
            placeholder="••••"
            secureTextEntry
            keyboardType="numeric"
            maxLength={6}
            value={pinIngresado}
            onChangeText={setPinIngresado}
          />

          <TouchableOpacity style={styles.btnLogin} onPress={verificarPin}>
            <Text style={styles.btnLoginText}>Ingresar al Panel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.topAdminRow}>
          <Text style={styles.title}>🔐 Panel de Control — abuelitos.pe</Text>
          <TouchableOpacity style={styles.btnCerrarSesion} onPress={() => setAutenticado(false)}>
            <Text style={styles.btnCerrarSesionText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sub}>Supervisión nacional, aprobación de casos sociales y personalización de la plataforma.</Text>

        {/* MÉTRICAS GLOBALES */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricNum}>{resumen.total_activos}</Text>
            <Text style={styles.metricLabel}>Abuelitos Activos</Text>
          </View>

          <View style={[styles.metricCard, { borderColor: '#EA580C' }]}>
            <Text style={[styles.metricNum, { color: '#EA580C' }]}>{resumen.total_pendientes}</Text>
            <Text style={styles.metricLabel}>Casos por Validar</Text>
          </View>

          <View style={[styles.metricCard, { borderColor: '#16A34A' }]}>
            <Text style={[styles.metricNum, { color: '#16A34A' }]}>S/ {parseFloat(resumen.total_donado || 0).toFixed(2)}</Text>
            <Text style={styles.metricLabel}>Total Donado</Text>
          </View>

          <View style={[styles.metricCard, { borderColor: '#2563EB' }]}>
            <Text style={[styles.metricNum, { color: '#2563EB' }]}>{resumen.total_entregas}</Text>
            <Text style={styles.metricLabel}>Canastas Entregadas</Text>
          </View>
        </View>

        {/* PESTAÑAS DE NAVEGACIÓN DEL ADMIN */}
        <View style={styles.tabsRow}>
          <TouchableOpacity style={[styles.adminTab, tabAdmin === 'pendientes' && styles.adminTabActive]} onPress={() => setTabAdmin('pendientes')}>
            <Text style={[styles.adminTabText, tabAdmin === 'pendientes' && styles.adminTabTextActive]}>📋 Casos Pendientes ({pendientes.length})</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.adminTab, tabAdmin === 'hero_cms' && styles.adminTabActive]} onPress={() => setTabAdmin('hero_cms')}>
            <Text style={[styles.adminTabText, tabAdmin === 'hero_cms' && styles.adminTabTextActive]}>🎨 Personalizar Portada y Textos</Text>
          </TouchableOpacity>
        </View>

        {/* CONTENIDO 1: GESTOR DE PORTADA (CMS) */}
        {tabAdmin === 'hero_cms' && (
          <View style={styles.cmsCard}>
            <Text style={styles.cmsTitle}>🖼️ Gestor de la Portada Principal</Text>
            <Text style={styles.cmsSub}>Cambia los textos, el color de fondo y la foto del abuelito que aparece en la portada.</Text>

            <Text style={styles.label}>Texto Superior (Tagline Rojo):</Text>
            <TextInput 
              style={styles.input} 
              value={heroForm.tagline} 
              onChangeText={(v) => setHeroForm({ ...heroForm, tagline: v })} 
            />

            <Text style={styles.label}>Título Principal de la Portada:</Text>
            <TextInput 
              style={[styles.input, { fontWeight: 'bold' }]} 
              value={heroForm.titulo} 
              onChangeText={(v) => setHeroForm({ ...heroForm, titulo: v })} 
            />

            <Text style={styles.label}>Color de Fondo (Código Hexadecimal):</Text>
            <TextInput 
              style={styles.input} 
              placeholder="#1E232B"
              value={heroForm.color_fondo} 
              onChangeText={(v) => setHeroForm({ ...heroForm, color_fondo: v })} 
            />

            <Text style={styles.label}>Fotografía Principal del Abuelito en la Portada:</Text>
            <TouchableOpacity style={styles.btnPickBanner} onPress={pickBannerImage}>
              <Text style={styles.btnPickBannerText}>📷 {nuevaFotoBanner ? '✓ Nueva Foto Seleccionada' : 'Seleccionar Nueva Foto de Portada desde PC / Celular'}</Text>
            </TouchableOpacity>

            <View style={styles.previewBannerWrapper}>
              <Text style={styles.previewBannerLabel}>Vista Previa Actual:</Text>
              <Image 
                source={{ uri: nuevaFotoBanner ? nuevaFotoBanner.uri : (heroForm.foto_existente || 'https://via.placeholder.com/400') }} 
                style={styles.previewBannerImg} 
              />
            </View>

            <TouchableOpacity style={styles.btnGuardarHero} onPress={handleGuardarHero} disabled={guardandoHero}>
              {guardandoHero ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnGuardarHeroText}>💾 Guardar Cambios en la Portada</Text>}
            </TouchableOpacity>
          </View>
        )}

        {/* CONTENIDO 2: BANDEJA DE CASOS PENDIENTES */}
        {tabAdmin === 'pendientes' && (
          <View>
            <Text style={styles.secTitle}>📋 Casos Pendientes de Aprobación ({pendientes.length})</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#FF385C" style={{ marginVertical: 30 }} />
            ) : pendientes.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>✓ No hay casos pendientes por revisar. Todos los casos están al día.</Text>
              </View>
            ) : (
              <View style={styles.list}>
                {pendientes.map((item) => (
                  <View key={item.id} style={styles.pendingCard}>
                    <Image source={{ uri: item.foto_url }} style={styles.pImg} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.pName}>{item.nombre_completo} ({item.edad} años)</Text>
                      <Text style={styles.pDni}>DNI: <Text style={{ fontWeight: 'bold' }}>{item.dni}</Text></Text>
                      <Text style={styles.pLoc}>📍 {item.caserio}, {item.distrito} - {item.provincia} ({item.departamento})</Text>
                      <Text style={styles.pDesc} numberOfLines={2}>📖 {item.historia_biografia}</Text>

                      <View style={styles.actionsRow}>
                        <TouchableOpacity style={styles.btnAprobar} onPress={() => handleAprobar(item.id)}>
                          <Text style={styles.btnAprobarText}>✓ Validar y Publicar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnRechazar} onPress={() => handleEliminar(item.id)}>
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

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  wrapper: { maxWidth: 1000, alignSelf: 'center', width: '100%' },
  topAdminRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '900', color: '#1E293B' },
  btnCerrarSesion: { backgroundColor: '#E2E8F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  btnCerrarSesionText: { fontSize: 12, fontWeight: 'bold', color: '#475569' },
  sub: { fontSize: 13, color: '#64748B', marginBottom: 24 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 25 },
  metricCard: { backgroundColor: '#FFF', flex: 1, minWidth: 200, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', elevation: 2 },
  metricNum: { fontSize: 24, fontWeight: '900', color: '#FF385C' },
  metricLabel: { fontSize: 12, color: '#64748B', fontWeight: 'bold', marginTop: 4 },
  tabsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  adminTab: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10, backgroundColor: '#E2E8F0' },
  adminTabActive: { backgroundColor: '#FF385C' },
  adminTabText: { fontSize: 13, fontWeight: 'bold', color: '#475569' },
  adminTabTextActive: { color: '#FFF' },
  cmsCard: { backgroundColor: '#FFF', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 30 },
  cmsTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B', marginBottom: 4 },
  cmsSub: { fontSize: 13, color: '#64748B', marginBottom: 18 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#334155', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, outlineStyle: 'none' },
  btnPickBanner: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed', padding: 14, borderRadius: 8, alignItems: 'center', marginVertical: 8 },
  btnPickBannerText: { color: '#2563EB', fontWeight: 'bold', fontSize: 13 },
  previewBannerWrapper: { alignItems: 'center', marginVertical: 14 },
  previewBannerLabel: { fontSize: 12, color: '#64748B', marginBottom: 6, fontWeight: 'bold' },
  previewBannerImg: { width: 300, height: 200, borderRadius: 12, resizeMode: 'cover', borderWidth: 2, borderColor: '#E2E8F0' },
  btnGuardarHero: { backgroundColor: '#16A34A', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  btnGuardarHeroText: { color: '#FFF', fontWeight: '900', fontSize: 15 },
  secTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B', marginBottom: 14 },
  emptyCard: { backgroundColor: '#F0FDF4', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#BBF7D0', alignItems: 'center' },
  emptyText: { color: '#166534', fontWeight: 'bold', fontSize: 14 },
  list: { gap: 14 },
  pendingCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 18, borderRadius: 14, borderWidth: 1, borderColor: '#FED7AA', gap: 16, alignItems: 'center' },
  pImg: { width: 90, height: 90, borderRadius: 10, resizeMode: 'cover' },
  pName: { fontSize: 17, fontWeight: 'bold', color: '#1E293B' },
  pDni: { fontSize: 13, color: '#475569', marginTop: 2 },
  pLoc: { fontSize: 12, color: '#64748B', marginVertical: 2 },
  pDesc: { fontSize: 13, color: '#334155', fontStyle: 'italic', marginBottom: 10 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  btnAprobar: { backgroundColor: '#16A34A', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  btnAprobarText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  btnRechazar: { backgroundColor: '#EF4444', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  btnRechazarText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  loginContainer: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', padding: 20, minHeight: 400 },
  loginCard: { backgroundColor: '#FFF', padding: 30, borderRadius: 18, borderWidth: 1, borderColor: '#E2E8F0', maxWidth: 380, width: '100%', alignItems: 'center', shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 },
  loginIcon: { fontSize: 36, marginBottom: 10 },
  loginTitle: { fontSize: 20, fontWeight: '900', color: '#1E293B', marginBottom: 4 },
  loginSub: { fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 20 },
  pinInput: { width: '100%', backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingVertical: 12, textAlign: 'center', fontSize: 22, fontWeight: 'bold', letterSpacing: 8, outlineStyle: 'none', marginBottom: 16 },
  btnLogin: { width: '100%', backgroundColor: '#FF385C', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  btnLoginText: { color: '#FFF', fontWeight: '900', fontSize: 14 }
});