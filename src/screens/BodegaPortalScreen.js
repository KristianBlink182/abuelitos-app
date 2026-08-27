import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { loginBodega, getAbuelitosBodega, entregarCanastaBodega } from '../services/api';

export default function BodegaPortalScreen() {
  const [usuarioInput, setUsuarioInput] = useState('bodega_huayllay');
  const [passwordInput, setPasswordInput] = useState('123');
  const [bodegaActiva, setBodegaActiva] = useState(null);
  const [abuelitos, setAbuelitos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Entrega
  const [selectedAbuelito, setSelectedAbuelito] = useState(null);
  const [tipoCanasta, setTipoCanasta] = useState('Canasta Básica (S/ 40)');
  const [monto, setMonto] = useState('40');
  const [foto, setFoto] = useState(null);
  const [desc, setDesc] = useState('Arroz, avena, aceite, menestras y azúcar.');

  const handleLogin = async () => {
    if (!usuarioInput || !passwordInput) {
      alert('Ingresa tu usuario y contraseña.');
      return;
    }
    setLoading(true);
    const res = await loginBodega({ usuario: usuarioInput, password: passwordInput });
    setLoading(false);

    if (res.success) {
      setBodegaActiva(res.bodega);
      cargarCasos(res.bodega.telefono_yape_plin);
    } else {
      alert(res.error || 'Credenciales incorrectas.');
    }
  };

  const cargarCasos = async (telefono) => {
    setLoading(true);
    const data = await getAbuelitosBodega(telefono);
    setAbuelitos(data);
    setLoading(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (!result.canceled) setFoto(result.assets[0]);
  };

  const handleEntregar = async () => {
    if (!foto) {
      alert('Debes tomar/subir la foto de constancia de la entrega.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('abuelito_id', selectedAbuelito.id);
    formData.append('tipo_canasta', tipoCanasta);
    formData.append('monto_valorizado', monto);
    formData.append('descripcion', desc);

    if (foto.file) formData.append('foto_comprobante', foto.file);
    else formData.append('foto_comprobante', { uri: foto.uri, name: 'entrega.jpg', type: 'image/jpeg' });

    const res = await entregarCanastaBodega(formData);
    setLoading(false);

    if (res.success) {
      alert(`✅ Canasta entregada con éxito.\nSe descontaron S/ ${monto} del saldo de ${selectedAbuelito.nombre_completo}.`);
      setSelectedAbuelito(null);
      setFoto(null);
      cargarCasos(bodegaActiva.telefono_yape_plin);
    } else {
      alert('❌ Error al registrar entrega.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>🏪 Portal de la Bodega Solidaria</Text>
        <Text style={styles.sub}>Punto oficial de despacho de alimentos con fiscalización comunal.</Text>

        {!bodegaActiva ? (
          <View style={styles.loginCard}>
            <Text style={styles.loginTitle}>Ingreso Exclusivo para Comerciantes</Text>
            <Text style={styles.loginSub}>Ingresa con el usuario y contraseña asignados por la administración de abuelitos.pe</Text>

            <Text style={styles.label}>Usuario de Bodega:</Text>
            <TextInput style={styles.input} autoCapitalize="none" value={usuarioInput} onChangeText={setUsuarioInput} />

            <Text style={styles.label}>Contraseña:</Text>
            <TextInput style={styles.input} secureTextEntry value={passwordInput} onChangeText={setPasswordInput} />

            <TouchableOpacity style={styles.btnLogin} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnLoginText}>Acceder al Portal</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {/* CABECERA BODEGA */}
            <View style={styles.bodegaHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bName}>🏪 {bodegaActiva.nombre_comercio}</Text>
                <Text style={styles.bLoc}>📍 {bodegaActiva.caserio_comunidad} ({bodegaActiva.distrito})</Text>
                <Text style={styles.bYape}>📱 Yape/Plin: {bodegaActiva.telefono_yape_plin}</Text>
              </View>
              <TouchableOpacity style={styles.btnLogout} onPress={() => setBodegaActiva(null)}>
                <Text style={styles.btnLogoutText}>Salir</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.secTitle}>Abuelitos Asignados a tu Tienda ({abuelitos.length}):</Text>

            {abuelitos.length === 0 ? (
              <View style={styles.emptyCard}><Text style={{ color: '#64748B' }}>No tienes abuelitos asignados en este momento.</Text></View>
            ) : (
              <View style={styles.grid}>
                {abuelitos.map((a) => (
                  <View key={a.id} style={styles.abuelitoCard}>
                    <Image source={{ uri: a.foto_url }} style={styles.avatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.aName}>{a.nombre_completo}</Text>
                      <Text style={styles.aLoc}>📍 {a.caserio}</Text>
                      <Text style={styles.aSaldo}>
                        🛒 Saldo Disponible: <Text style={{ color: '#16A34A', fontWeight: '900', fontSize: 16 }}>S/ {parseFloat(a.saldo_disponible || 0).toFixed(2)}</Text>
                      </Text>
                      
                      <TouchableOpacity style={styles.btnDespachar} onPress={() => setSelectedAbuelito(a)}>
                        <Text style={styles.btnDespacharText}>📦 Entregar Canasta</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* MODAL DE ENTREGA */}
            {selectedAbuelito && (
              <View style={styles.despachoCard}>
                <Text style={styles.despachoTitle}>📦 Despachar Canasta a {selectedAbuelito.nombre_completo}</Text>
                
                <Text style={styles.label}>Selecciona el Pack de Canasta:</Text>
                <View style={styles.packRow}>
                  <TouchableOpacity style={[styles.btnPack, monto === '40' && styles.btnPackActive]} onPress={() => { setMonto('40'); setTipoCanasta('Canasta Básica (S/ 40)'); }}>
                    <Text style={[styles.packText, monto === '40' && styles.packTextActive]}>🧺 Básica (S/ 40)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btnPack, monto === '80' && styles.btnPackActive]} onPress={() => { setMonto('80'); setTipoCanasta('Canasta Familiar (S/ 80)'); }}>
                    <Text style={[styles.packText, monto === '80' && styles.packTextActive]}>🧺 Familiar (S/ 80)</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Foto de la entrega con el abuelito *:</Text>
                <TouchableOpacity style={styles.btnFoto} onPress={pickImage}>
                  <Text style={styles.btnFotoText}>{foto ? '✓ Foto de Constancia Lista' : '📷 Tomar Foto de la Entrega'}</Text>
                </TouchableOpacity>
                {foto && <Image source={{ uri: foto.uri }} style={styles.preview} />}

                <Text style={styles.label}>Detalle de productos entregados:</Text>
                <TextInput style={styles.input} value={desc} onChangeText={setDesc} />

                <TouchableOpacity style={styles.btnConfirmarDespacho} onPress={handleEntregar} disabled={loading}>
                  {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnConfirmarDespachoText}>Descontar S/ {monto} y Guardar Constancia</Text>}
                </TouchableOpacity>
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
  wrapper: { maxWidth: 800, alignSelf: 'center', width: '100%' },
  title: { fontSize: 24, fontWeight: '900', color: '#1E293B', textAlign: 'center', marginBottom: 4 },
  sub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 24 },
  loginCard: { backgroundColor: '#FFF', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', maxWidth: 420, alignSelf: 'center', width: '100%' },
  loginTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 4, textAlign: 'center' },
  loginSub: { fontSize: 12, color: '#64748B', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 12, fontWeight: 'bold', color: '#334155', marginBottom: 4, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13 },
  btnLogin: { backgroundColor: '#FF385C', paddingVertical: 13, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  btnLoginText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  bodegaHeader: { flexDirection: 'row', backgroundColor: '#FFF', padding: 18, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', marginBottom: 20 },
  bName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  bLoc: { fontSize: 12, color: '#64748B', marginVertical: 2 },
  bYape: { fontSize: 13, color: '#74226C', fontWeight: 'bold' },
  btnLogout: { backgroundColor: '#FEE2E2', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  btnLogoutText: { fontSize: 11, fontWeight: 'bold', color: '#991B1B' },
  secTitle: { fontSize: 17, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  grid: { gap: 12 },
  abuelitoCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', gap: 14, alignItems: 'center' },
  avatar: { width: 75, height: 75, borderRadius: 10, resizeMode: 'cover' },
  aName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  aLoc: { fontSize: 11, color: '#64748B', marginVertical: 2 },
  aSaldo: { fontSize: 12, color: '#334155', marginTop: 2 },
  btnDespachar: { backgroundColor: '#16A34A', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, alignSelf: 'flex-start', marginTop: 6 },
  btnDespacharText: { color: '#FFF', fontWeight: 'bold', fontSize: 11 },
  despachoCard: { backgroundColor: '#FFF7ED', padding: 20, borderRadius: 16, borderWidth: 2, borderColor: '#EA580C', marginTop: 20 },
  despachoTitle: { fontSize: 16, fontWeight: '900', color: '#9A3412', marginBottom: 10 },
  packRow: { flexDirection: 'row', gap: 10 },
  btnPack: { flex: 1, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FDBA74', padding: 10, borderRadius: 8, alignItems: 'center' },
  btnPackActive: { backgroundColor: '#EA580C', borderColor: '#EA580C' },
  packText: { fontWeight: 'bold', color: '#9A3412', fontSize: 12 },
  packTextActive: { color: '#FFF' },
  btnFoto: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#FDBA74', borderStyle: 'dashed', alignItems: 'center', marginTop: 4 },
  btnFotoText: { color: '#EA580C', fontWeight: 'bold', fontSize: 12 },
  preview: { width: 100, height: 100, borderRadius: 8, alignSelf: 'center', marginVertical: 8 },
  btnConfirmarDespacho: { backgroundColor: '#EA580C', paddingVertical: 13, borderRadius: 10, alignItems: 'center', marginTop: 14 },
  btnConfirmarDespachoText: { color: '#FFF', fontWeight: '900', fontSize: 14 },
  emptyCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' }
});