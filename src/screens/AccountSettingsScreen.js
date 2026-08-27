import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { cambiarPasswordDonante, getMisDonaciones } from '../services/api';

export default function AccountSettingsScreen({ usuario = {}, onSelectAbuelito, onCerrarSesion, onOpenAuth }) {
  const [passwordNueva, setPasswordNueva] = useState('');
  const [guardandoPass, setGuardandoPass] = useState(false);
  const [apoyados, setApoyados] = useState([]);
  const [loadingApoyos, setLoadingApoyos] = useState(true);

  const nombreUsuario = usuario?.nombre_completo || usuario?.nombre || 'Donante Solidario';
  const emailUsuario = usuario?.email || 'Sin correo';
  const iniciales = nombreUsuario.trim().substring(0, 2).toUpperCase();

  useEffect(() => {
    if (usuario && usuario.id) {
      cargarApoyados();
    } else {
      setLoadingApoyos(false);
    }
  }, [usuario]);

  const cargarApoyados = async () => {
    setLoadingApoyos(true);
    const data = await getMisDonaciones(usuario.id);
    setApoyados(Array.isArray(data) ? data : []);
    setLoadingApoyos(false);
  };

  const handleCambiarPassword = async () => {
    if (!passwordNueva.trim() || passwordNueva.length < 4) {
      alert('La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }

    setGuardandoPass(true);
    const res = await cambiarPasswordDonante(usuario.id, passwordNueva);
    setGuardandoPass(false);

    if (res.success) {
      alert('✅ ¡Contraseña actualizada exitosamente!');
      setPasswordNueva('');
    } else {
      alert(res.error || 'Error al actualizar contraseña.');
    }
  };

  if (!usuario || !usuario.id) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>👤</Text>
        <Text style={styles.emptyTitle}>Ingresa a tu Cuenta</Text>
        <Text style={styles.emptySub}>Inicia sesión para gestionar tus datos y revisar a los abuelitos que has apoyado.</Text>
        <TouchableOpacity style={styles.btnAuth} onPress={onOpenAuth} activeOpacity={0.85}>
          <Text style={styles.btnAuthText}>Ingresar / Registrarme</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        
        {/* CABECERA CON DATOS */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBig}>
            <Text style={styles.avatarBigText}>{iniciales}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{nombreUsuario}</Text>
            <Text style={styles.userEmail}>✉️ {emailUsuario}</Text>
            <Text style={styles.badgeDonante}>✓ Donante Registrado</Text>
          </View>
          <TouchableOpacity style={styles.btnLogout} onPress={onCerrarSesion} activeOpacity={0.85}>
            <Text style={styles.btnLogoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        {/* 1. CAMBIAR CONTRASEÑA */}
        <View style={styles.boxCard}>
          <Text style={styles.boxTitle}>🔒 Seguridad y Contraseña</Text>
          <Text style={styles.boxSub}>Actualiza tu clave de acceso a abuelitos.pe:</Text>
          
          <TextInput 
            style={styles.input} 
            placeholder="Nueva contraseña (mínimo 4 caracteres)" 
            secureTextEntry
            value={passwordNueva}
            onChangeText={setPasswordNueva}
          />

          <TouchableOpacity style={styles.btnGuardarPass} onPress={handleCambiarPassword} disabled={guardandoPass}>
            {guardandoPass ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnGuardarPassText}>Actualizar Contraseña</Text>}
          </TouchableOpacity>
        </View>

        {/* 2. PERSONAS A LAS QUE HA APOYADO */}
        <View style={styles.boxCard}>
          <Text style={styles.boxTitle}>🤝 Abuelitos que has Apoyado ({apoyados.length})</Text>
          <Text style={styles.boxSub}>Historial de casos a los que has enviado aportes para víveres:</Text>

          {loadingApoyos ? (
            <ActivityIndicator size="small" color="#FF385C" style={{ marginVertical: 15 }} />
          ) : apoyados.length === 0 ? (
            <View style={styles.emptyHistorial}>
              <Text style={styles.emptyHistorialText}>Aún no has registrado donaciones con esta cuenta.</Text>
            </View>
          ) : (
            <View style={styles.apoyosList}>
              {apoyados.map((item, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={styles.apoyoItem}
                  onPress={() => onSelectAbuelito({ id: item.abuelito_id, nombre_completo: item.nombre_completo })}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: item.foto_url }} style={styles.apoyoImg} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.apoyoName}>{item.nombre_completo}</Text>
                    <Text style={styles.apoyoLoc}>📍 {item.caserio}, {item.provincia}</Text>
                    <Text style={styles.apoyoMonto}>Donación: <Text style={{ color: '#16A34A', fontWeight: 'bold' }}>S/ {item.monto}</Text></Text>
                  </View>
                  <Text style={styles.apoyoFecha}>{new Date(item.fecha).toLocaleDateString('es-PE')}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  wrapper: { maxWidth: 800, alignSelf: 'center', width: '100%' },
  profileCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', gap: 14, marginBottom: 18, flexWrap: 'wrap' },
  avatarBig: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' },
  avatarBigText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  userName: { fontSize: 17, fontWeight: '900', color: '#1E293B' },
  userEmail: { fontSize: 12, color: '#64748B', marginVertical: 1 },
  badgeDonante: { fontSize: 11, fontWeight: 'bold', color: '#16A34A', marginTop: 1 },
  btnLogout: { backgroundColor: '#FEE2E2', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  btnLogoutText: { fontSize: 11, fontWeight: 'bold', color: '#991B1B' },
  boxCard: { backgroundColor: '#FFF', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  boxTitle: { fontSize: 16, fontWeight: '900', color: '#1E293B', marginBottom: 2 },
  boxSub: { fontSize: 12, color: '#64748B', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13, outlineStyle: 'none', marginBottom: 10 },
  btnGuardarPass: { backgroundColor: '#0F172A', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnGuardarPassText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  emptyHistorial: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 10, alignItems: 'center' },
  emptyHistorialText: { color: '#64748B', fontSize: 12, fontStyle: 'italic' },
  apoyosList: { gap: 8 },
  apoyoItem: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', gap: 10 },
  apoyoImg: { width: 45, height: 45, borderRadius: 8, resizeMode: 'cover' },
  apoyoName: { fontSize: 13, fontWeight: 'bold', color: '#1E293B' },
  apoyoLoc: { fontSize: 10, color: '#64748B' },
  apoyoMonto: { fontSize: 11, color: '#334155', marginTop: 2 },
  apoyoFecha: { fontSize: 10, color: '#94A3B8' },
  emptyContainer: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', padding: 30, minHeight: 400 },
  emptyIcon: { fontSize: 44, marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B', marginBottom: 6 },
  emptySub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 20 },
  btnAuth: { backgroundColor: '#FF385C', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  btnAuthText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 }
});