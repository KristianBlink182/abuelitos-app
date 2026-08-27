import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registroDonante, loginDonante } from '../services/api';

export default function AuthModal({ visible, onClose, onSuccess }) {
  const [esRegistro, setEsRegistro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recordarSesion, setRecordarSesion] = useState(true); // Activo por defecto

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      alert('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);

    // 1. RECONOCIMIENTO AUTOMÁTICO DE ADMINISTRADOR
    if (password.trim() === '1234' || email.trim().toLowerCase() === 'admin') {
      setLoading(false);
      const sesionAdmin = { id: 0, nombre: 'Super Admin', tipo: 'admin' };
      if (recordarSesion) {
        await AsyncStorage.setItem('usuario_sesion_activa', JSON.stringify(sesionAdmin));
      }
      onSuccess(sesionAdmin);
      onClose();
      return;
    }

    // 2. REGISTRO DE DONANTE
    if (esRegistro) {
      if (!nombre.trim()) {
        alert('Ingresa tu nombre completo.');
        setLoading(false);
        return;
      }
      const res = await registroDonante({ nombre_completo: nombre, email, password });
      setLoading(false);
      if (res.success) {
        alert('✅ ¡Cuenta creada con éxito!');
        const sesionDonante = { 
          id: res.usuario.id, 
          nombre: res.usuario.nombre_completo, 
          nombre_completo: res.usuario.nombre_completo, 
          email: res.usuario.email, 
          tipo: 'donante' 
        };
        if (recordarSesion) {
          await AsyncStorage.setItem('usuario_sesion_activa', JSON.stringify(sesionDonante));
        }
        onSuccess(sesionDonante);
        onClose();
      } else {
        alert(res.error || 'Error al registrarte.');
      }
    } else {
      // 3. INICIO DE SESIÓN DONANTE
      const res = await loginDonante({ email, password });
      setLoading(false);
      if (res.success) {
        const sesionDonante = { 
          id: res.usuario.id, 
          nombre: res.usuario.nombre_completo, 
          nombre_completo: res.usuario.nombre_completo, 
          email: res.usuario.email, 
          tipo: 'donante' 
        };
        if (recordarSesion) {
          await AsyncStorage.setItem('usuario_sesion_activa', JSON.stringify(sesionDonante));
        }
        onSuccess(sesionDonante);
        onClose();
      } else {
        alert(res.error || 'Correo o contraseña incorrectos.');
      }
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{esRegistro ? 'Crear Cuenta de Donante' : 'Ingresar a tu Cuenta'}</Text>
          <Text style={styles.sub}>
            {esRegistro 
              ? 'Regístrate para apadrinar abuelitos y guardar tus favoritos.'
              : 'Accede para ver tus casos seguidos o administrar la plataforma.'}
          </Text>

          {esRegistro && (
            <TextInput 
              style={styles.input} 
              placeholder="Tu Nombre Completo *" 
              value={nombre} 
              onChangeText={setNombre} 
            />
          )}

          <TextInput 
            style={styles.input} 
            placeholder="Correo Electrónico *" 
            autoCapitalize="none"
            keyboardType="email-address"
            value={email} 
            onChangeText={setEmail} 
          />

          <TextInput 
            style={styles.input} 
            placeholder="Contraseña *" 
            secureTextEntry
            value={password} 
            onChangeText={setPassword} 
          />

          {/* CASILLA RECORDAR SESIÓN */}
          <TouchableOpacity 
            style={styles.rememberRow} 
            onPress={() => setRecordarSesion(!recordarSesion)} 
            activeOpacity={0.8}
          >
            <Text style={styles.checkboxIcon}>{recordarSesion ? '☑' : '☐'}</Text>
            <Text style={styles.rememberText}>Recordar mi sesión (Mantener abierta)</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setEsRegistro(!esRegistro)} style={{ marginVertical: 8 }}>
            <Text style={styles.linkToggle}>
              {esRegistro ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate aquí'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color="#FFF" /> : (
              <Text style={styles.btnSubmitText}>{esRegistro ? 'Registrarme' : 'Ingresar'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
            <Text style={styles.btnCancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 24, maxWidth: 390, width: '100%', elevation: 5 },
  title: { fontSize: 20, fontWeight: '900', color: '#1E293B', textAlign: 'center', marginBottom: 4 },
  sub: { fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 18, lineHeight: 18 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, marginBottom: 10, outlineStyle: 'none' },
  rememberRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingVertical: 2 },
  checkboxIcon: { fontSize: 18, color: '#FF385C', marginRight: 8 },
  rememberText: { fontSize: 12, color: '#475569', fontWeight: '600' },
  linkToggle: { color: '#FF385C', fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
  btnSubmit: { backgroundColor: '#FF385C', paddingVertical: 13, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  btnSubmitText: { color: '#FFF', fontWeight: '900', fontSize: 14 },
  btnCancel: { padding: 10, alignItems: 'center', marginTop: 4 },
  btnCancelText: { color: '#64748B', fontWeight: '600', fontSize: 13 }
});