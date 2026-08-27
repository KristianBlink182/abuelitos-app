import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { registroDonante, loginDonante, loginBodega } from '../services/api';

export default function AuthModal({ visible, onClose, onSuccess }) {
  const [rol, setRol] = useState('donante'); // 'donante', 'bodega', 'admin'
  const [esRegistro, setEsRegistro] = useState(false);
  const [loading, setLoading] = useState(false);

  // Formulario
  const [nombre, setNombre] = useState('');
  const [identificador, setIdentificador] = useState(''); // Email o Usuario
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!identificador.trim() || !password.trim()) {
      alert('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);

    // 1. ROL: ADMINISTRADOR
    if (rol === 'admin') {
      setLoading(false);
      if (password === '1234' || password === 'admin') {
        onSuccess({ id: 0, nombre: 'Super Admin', tipo: 'admin' });
        onClose();
      } else {
        alert('❌ PIN o Contraseña de Administrador incorrecto.');
      }
      return;
    }

    // 2. ROL: BODEGA
    if (rol === 'bodega') {
      const res = await loginBodega({ usuario: identificador, password });
      setLoading(false);
      if (res.success) {
        alert(`¡Bienvenido, ${res.bodega.nombre_comercio}!`);
        onSuccess({ id: res.bodega.id, nombre: res.bodega.nombre_comercio, telefono: res.bodega.telefono_yape_plin, tipo: 'bodega' });
        onClose();
      } else {
        alert(res.error || 'Usuario o contraseña de bodega incorrectos.');
      }
      return;
    }

    // 3. ROL: DONANTE
    if (esRegistro) {
      if (!nombre.trim()) {
        alert('Ingresa tu nombre completo.');
        setLoading(false);
        return;
      }
      const res = await registroDonante({ nombre_completo: nombre, email: identificador, password });
      setLoading(false);
      if (res.success) {
        alert('✅ ¡Cuenta de donante creada con éxito!');
        onSuccess({ id: res.usuario.id, nombre: res.usuario.nombre_completo, email: res.usuario.email, tipo: 'donante' });
        onClose();
      } else {
        alert(res.error || 'Error al registrarte.');
      }
    } else {
      const res = await loginDonante({ email: identificador, password });
      setLoading(false);
      if (res.success) {
        onSuccess({ id: res.usuario.id, nombre: res.usuario.nombre_completo, email: res.usuario.email, tipo: 'donante' });
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
          
          {/* SELECTOR DE TIPO DE ACCESO */}
          <View style={styles.roleTabs}>
            <TouchableOpacity style={[styles.roleTab, rol === 'donante' && styles.roleTabActive]} onPress={() => { setRol('donante'); setEsRegistro(false); }}>
              <Text style={[styles.roleTabText, rol === 'donante' && styles.roleTabTextActive]}>👤 Donante</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.roleTab, rol === 'bodega' && styles.roleTabActive]} onPress={() => { setRol('bodega'); setEsRegistro(false); }}>
              <Text style={[styles.roleTabText, rol === 'bodega' && styles.roleTabTextActive]}>🏪 Bodega</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.roleTab, rol === 'admin' && styles.roleTabActive]} onPress={() => { setRol('admin'); setEsRegistro(false); }}>
              <Text style={[styles.roleTabText, rol === 'admin' && styles.roleTabTextActive]}>🔐 Admin</Text>
            </TouchableOpacity>
          </View>

          {/* TÍTULO */}
          <Text style={styles.title}>
            {rol === 'admin' ? 'Acceso de Administrador' : (rol === 'bodega' ? 'Acceso de Bodega Aliada' : (esRegistro ? 'Crear Cuenta de Donante' : 'Ingreso de Donantes'))}
          </Text>
          <Text style={styles.sub}>
            {rol === 'admin' ? 'Ingresa el PIN de control maestro.' : (rol === 'bodega' ? 'Ingresa con el usuario asignado por abuelitos.pe' : (esRegistro ? 'Regístrate para apadrinar abuelitos.' : 'Inicia sesión para ver tu historial de donaciones.'))}
          </Text>

          {/* CAMPOS */}
          {rol === 'donante' && esRegistro && (
            <TextInput 
              style={styles.input} 
              placeholder="Tu Nombre Completo *" 
              value={nombre} 
              onChangeText={setNombre} 
            />
          )}

          <TextInput 
            style={styles.input} 
            placeholder={rol === 'admin' ? 'Usuario Admin (opcional)' : (rol === 'bodega' ? 'Usuario de Bodega *' : 'Correo Electrónico *')}
            autoCapitalize="none"
            value={identificador} 
            onChangeText={setIdentificador} 
          />

          <TextInput 
            style={styles.input} 
            placeholder={rol === 'admin' ? 'PIN Maestro (1234) *' : 'Contraseña *'} 
            secureTextEntry
            value={password} 
            onChangeText={setPassword} 
          />

          {/* TOGGLE REGISTRO SOLO PARA DONANTES */}
          {rol === 'donante' && (
            <TouchableOpacity onPress={() => setEsRegistro(!esRegistro)} style={{ marginBottom: 12 }}>
              <Text style={styles.linkToggle}>
                {esRegistro ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate aquí'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : (
              <Text style={styles.btnSubmitText}>Ingresar</Text>
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
  card: { backgroundColor: '#FFF', borderRadius: 18, padding: 24, maxWidth: 420, width: '100%', elevation: 5 },
  roleTabs: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 10, padding: 4, marginBottom: 16 },
  roleTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  roleTabActive: { backgroundColor: '#0F172A' },
  roleTabText: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },
  roleTabTextActive: { color: '#FFF' },
  title: { fontSize: 18, fontWeight: '900', color: '#1E293B', textAlign: 'center', marginBottom: 4 },
  sub: { fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, marginBottom: 10, outlineStyle: 'none' },
  linkToggle: { color: '#FF385C', fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
  btnSubmit: { backgroundColor: '#FF385C', paddingVertical: 13, borderRadius: 10, alignItems: 'center', marginTop: 4 },
  btnSubmitText: { color: '#FFF', fontWeight: '900', fontSize: 14 },
  btnCancel: { padding: 10, alignItems: 'center', marginTop: 4 },
  btnCancelText: { color: '#64748B', fontWeight: '600', fontSize: 13 }
});