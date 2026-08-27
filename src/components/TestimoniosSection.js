import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getMensajes, createMensaje } from '../services/api';

export default function TestimoniosSection({ abuelitoId, abuelitoNombre }) {
  const [mensajes, setMensajes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarMensajes();
  }, [abuelitoId]);

  const cargarMensajes = async () => {
    const data = await getMensajes(abuelitoId);
    setMensajes(data);
  };

  const handleEnviar = async () => {
    if (!nombre.trim() || !mensaje.trim()) {
      alert('Por favor escribe tu nombre y un mensaje de aliento.');
      return;
    }

    setLoading(true);
    const res = await createMensaje({
      abuelito_id: abuelitoId,
      nombre_donante: nombre,
      ciudad: ciudad,
      mensaje: mensaje
    });
    setLoading(false);

    if (res.success) {
      alert('❤️ ¡Gracias por tus palabras de aliento!');
      setNombre('');
      setCiudad('');
      setMensaje('');
      cargarMensajes();
    } else {
      alert('❌ Error al enviar mensaje.');
    }
  };

  return (
    <View style={styles.boxCard}>
      <Text style={styles.boxTitle}>❤️ Palabras de Aliento y Solidaridad</Text>
      <Text style={styles.boxSubtitle}>Mensajes que los donantes y voluntarios le dejan a {abuelitoNombre}:</Text>

      {/* LISTA DE MENSAJES */}
      {mensajes.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Sé la primera persona en dejarle un mensaje de ánimo y esperanza.</Text>
        </View>
      ) : (
        <View style={styles.msgList}>
          {mensajes.map((m) => (
            <View key={m.id} style={styles.msgItem}>
              <View style={styles.msgHeader}>
                <Text style={styles.msgAuthor}>👤 {m.nombre_donante}</Text>
                <Text style={styles.msgCity}>📍 {m.ciudad}</Text>
              </View>
              <Text style={styles.msgContent}>"{m.mensaje}"</Text>
            </View>
          ))}
        </View>
      )}

      {/* FORMULARIO ESTILO LISTYGO (IMAGEN 5) */}
      <View style={styles.formBox}>
        <Text style={styles.formHeading}>✍️ Déjale un mensaje de apoyo:</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Tu Nombre o Apodo *" 
          value={nombre} 
          onChangeText={setNombre} 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Tu Ciudad (Ej: Arequipa, Lima, Cusco...)" 
          value={ciudad} 
          onChangeText={setCiudad} 
        />

        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Escribe tus palabras de cariño o aliento..." 
          multiline 
          numberOfLines={3} 
          value={mensaje} 
          onChangeText={setMensaje} 
        />

        <TouchableOpacity style={styles.btnSend} onPress={handleEnviar} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnSendText}>Publicar Mensaje de Aliento</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxCard: { backgroundColor: '#FFF', padding: 22, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  boxTitle: { fontSize: 17, fontWeight: 'bold', color: '#2D3748' },
  boxSubtitle: { fontSize: 13, color: '#718096', marginTop: 2, marginBottom: 14 },
  emptyBox: { backgroundColor: '#F8FAFC', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 16 },
  emptyText: { color: '#64748B', fontSize: 13, fontStyle: 'italic' },
  msgList: { gap: 10, marginBottom: 20 },
  msgItem: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  msgHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  msgAuthor: { fontWeight: 'bold', fontSize: 13, color: '#1E293B' },
  msgCity: { fontSize: 11, color: '#64748B' },
  msgContent: { fontSize: 13, color: '#334155', fontStyle: 'italic', lineHeight: 18 },
  formBox: { backgroundColor: '#FFF7ED', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FFEDD5' },
  formHeading: { fontSize: 14, fontWeight: 'bold', color: '#9A3412', marginBottom: 10 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, marginBottom: 8, outlineStyle: 'none' },
  textArea: { height: 70, textAlignVertical: 'top' },
  btnSend: { backgroundColor: '#EA580C', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  btnSendText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 }
});