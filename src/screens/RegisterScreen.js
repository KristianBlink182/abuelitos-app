import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { postularAbuelito } from '../services/api';
import { ubigeoPeru } from '../utils/ubigeoPeru';

export default function RegisterScreen({ onCancel, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState(null);
  
  // Fotos de la Vivienda y Entorno (Máx. 3)
  const [fotoV1, setFotoV1] = useState(null);
  const [fotoV2, setFotoV2] = useState(null);
  const [fotoV3, setFotoV3] = useState(null);

  // Estados de Ubicación Encadenada (Ubigeo)
  const departamentosDisponibles = Object.keys(ubigeoPeru);
  const [departamento, setDepartamento] = useState(departamentosDisponibles[0]);
  
  const provinciasDisponibles = Object.keys(ubigeoPeru[departamento] || {});
  const [provincia, setProvincia] = useState(provinciasDisponibles[0] || '');

  const distritosDisponibles = (ubigeoPeru[departamento] && ubigeoPeru[departamento][provincia]) || [];
  const [distrito, setDistrito] = useState(distritosDisponibles[0] || '');

  const [form, setForm] = useState({
    nombre_completo: '',
    edad: '',
    dni: '',
    caserio: '',
    historia_biografia: '',
    necesidades_urgentes: ''
  });

  const handleCambioDpto = (nuevoDpto) => {
    setDepartamento(nuevoDpto);
    const nuevasProvs = Object.keys(ubigeoPeru[nuevoDpto] || {});
    const primeraProv = nuevasProvs[0] || '';
    setProvincia(primeraProv);
    const nuevosDistritos = (ubigeoPeru[nuevoDpto] && ubigeoPeru[nuevoDpto][primeraProv]) || [];
    setDistrito(nuevosDistritos[0] || '');
  };

  const handleCambioProv = (nuevaProv) => {
    setProvincia(nuevaProv);
    const nuevosDistritos = (ubigeoPeru[departamento] && ubigeoPeru[departamento][nuevaProv]) || [];
    setDistrito(nuevosDistritos[0] || '');
  };

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const pickImage = async (setter) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setter(result.assets[0]);
  };

  const handleSubmit = async () => {
    if (!form.nombre_completo || !form.edad || !form.dni || !form.caserio) {
      alert('Por favor completa todos los campos obligatorios (*)');
      return;
    }
    if (form.dni.trim().length !== 8) {
      alert('El DNI debe tener exactamente 8 dígitos.');
      return;
    }
    if (!foto) {
      alert('Por favor selecciona la foto de perfil del abuelito.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('nombre_completo', form.nombre_completo);
    formData.append('edad', form.edad);
    formData.append('dni', form.dni.trim());
    formData.append('departamento', departamento);
    formData.append('provincia', provincia);
    formData.append('distrito', distrito);
    formData.append('caserio', form.caserio);
    formData.append('historia_biografia', form.historia_biografia);
    formData.append('necesidades_urgentes', form.necesidades_urgentes);

    // Foto Principal
    if (foto.file) formData.append('foto', foto.file);
    else formData.append('foto', { uri: foto.uri, name: 'perfil.jpg', type: 'image/jpeg' });

    // Fotos de Vivienda
    if (fotoV1) {
      if (fotoV1.file) formData.append('foto_vivienda_1', fotoV1.file);
      else formData.append('foto_vivienda_1', { uri: fotoV1.uri, name: 'vivienda1.jpg', type: 'image/jpeg' });
    }
    if (fotoV2) {
      if (fotoV2.file) formData.append('foto_vivienda_2', fotoV2.file);
      else formData.append('foto_vivienda_2', { uri: fotoV2.uri, name: 'vivienda2.jpg', type: 'image/jpeg' });
    }
    if (fotoV3) {
      if (fotoV3.file) formData.append('foto_vivienda_3', fotoV3.file);
      else formData.append('foto_vivienda_3', { uri: fotoV3.uri, name: 'vivienda3.jpg', type: 'image/jpeg' });
    }

    const res = await postularAbuelito(formData);
    setLoading(false);

    if (res.success) {
      alert('✅ Caso registrado con éxito con todas sus fotografías.');
      onSuccess();
    } else {
      alert(res.error || '❌ Error al registrar el caso.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardWrapper}>
        <TouchableOpacity style={styles.btnVolver} onPress={onCancel}>
          <Text style={styles.btnVolverText}>← Volver al Directorio</Text>
        </TouchableOpacity>

        <Text style={styles.mainTitle}>📝 Registrar Caso Social</Text>
        <Text style={styles.subTitle}>Ingresa los datos del adulto mayor y sube fotos reales de su vivienda.</Text>

        <View style={styles.section}>
          <Text style={styles.label}>DNI del Abuelito (8 Dígitos Obligatorio) *</Text>
          <TextInput 
            style={[styles.input, { fontWeight: 'bold', letterSpacing: 2 }]} 
            placeholder="Ej: 02458912" 
            maxLength={8}
            keyboardType="numeric" 
            value={form.dni} 
            onChangeText={(v) => handleChange('dni', v)} 
          />

          <Text style={styles.label}>Nombre Completo *</Text>
          <TextInput style={styles.input} placeholder="Ej: Pascual Huaranca" value={form.nombre_completo} onChangeText={(v) => handleChange('nombre_completo', v)} />

          <Text style={styles.label}>Edad *</Text>
          <TextInput style={styles.input} placeholder="Ej: 82" keyboardType="numeric" value={form.edad} onChangeText={(v) => handleChange('edad', v)} />

          {/* FOTO PRINCIPAL */}
          <Text style={styles.label}>Fotografía Principal del Abuelito (Retrato) *</Text>
          <TouchableOpacity style={styles.btnPickImage} onPress={() => pickImage(setFoto)}>
            <Text style={styles.btnPickImageText}>📷 {foto ? '✓ Foto de Perfil Seleccionada' : 'Seleccionar Foto de Perfil'}</Text>
          </TouchableOpacity>
          {foto && <Image source={{ uri: foto.uri }} style={styles.previewImage} />}

          {/* GALERÍA DE VIVIENDA */}
          <Text style={[styles.label, { marginTop: 14, color: '#1E293B' }]}>📸 Fotografías de la Vivienda y Entorno (Hasta 3 fotos)</Text>
          <Text style={styles.miniHelp}>Sube fotos de la choza, cocina o habitación para documentar el caso:</Text>
          
          <View style={styles.viviendaRow}>
            {/* Foto 1 */}
            <View style={styles.viviendaCol}>
              <TouchableOpacity style={styles.btnPickSmall} onPress={() => pickImage(setFotoV1)}>
                <Text style={styles.btnPickSmallText}>{fotoV1 ? '✓ Foto 1' : '+ Foto Choza'}</Text>
              </TouchableOpacity>
              {fotoV1 && <Image source={{ uri: fotoV1.uri }} style={styles.previewSmall} />}
            </View>

            {/* Foto 2 */}
            <View style={styles.viviendaCol}>
              <TouchableOpacity style={styles.btnPickSmall} onPress={() => pickImage(setFotoV2)}>
                <Text style={styles.btnPickSmallText}>{fotoV2 ? '✓ Foto 2' : '+ Foto Interior'}</Text>
              </TouchableOpacity>
              {fotoV2 && <Image source={{ uri: fotoV2.uri }} style={styles.previewSmall} />}
            </View>

            {/* Foto 3 */}
            <View style={styles.viviendaCol}>
              <TouchableOpacity style={styles.btnPickSmall} onPress={() => pickImage(setFotoV3)}>
                <Text style={styles.btnPickSmallText}>{fotoV3 ? '✓ Foto 3' : '+ Foto Entorno'}</Text>
              </TouchableOpacity>
              {fotoV3 && <Image source={{ uri: fotoV3.uri }} style={styles.previewSmall} />}
            </View>
          </View>

          {/* UBICACIÓN */}
          <Text style={[styles.label, { marginTop: 16, color: '#1E293B' }]}>📍 Ubicación Geográfica Oficial (Perú) *</Text>
          
          <View style={styles.geoRow}>
            <View style={styles.selectWrapper}>
              <Text style={styles.miniLabel}>1. Departamento</Text>
              {Platform.OS === 'web' ? (
                <select style={styles.selectHtml} value={departamento} onChange={(e) => handleCambioDpto(e.target.value)}>
                  {departamentosDisponibles.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              ) : (
                <TextInput style={styles.input} value={departamento} editable={false} />
              )}
            </View>

            <View style={styles.selectWrapper}>
              <Text style={styles.miniLabel}>2. Provincia</Text>
              {Platform.OS === 'web' ? (
                <select style={styles.selectHtml} value={provincia} onChange={(e) => handleCambioProv(e.target.value)}>
                  {provinciasDisponibles.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              ) : (
                <TextInput style={styles.input} value={provincia} editable={false} />
              )}
            </View>
          </View>

          <View style={styles.geoRow}>
            <View style={styles.selectWrapper}>
              <Text style={styles.miniLabel}>3. Distrito</Text>
              {Platform.OS === 'web' ? (
                <select style={styles.selectHtml} value={distrito} onChange={(e) => setDistrito(e.target.value)}>
                  {distritosDisponibles.map((dist) => <option key={dist} value={dist}>{dist}</option>)}
                </select>
              ) : (
                <TextInput style={styles.input} value={distrito} editable={false} />
              )}
            </View>

            <View style={styles.selectWrapper}>
              <Text style={styles.miniLabel}>4. Caserío / Anexo / Comunidad *</Text>
              <TextInput style={styles.input} placeholder="Ej: Caserío Huayllay" value={form.caserio} onChangeText={(v) => handleChange('caserio', v)} />
            </View>
          </View>

          <Text style={styles.label}>Historia y Situación Actual *</Text>
          <TextInput style={[styles.input, styles.textArea]} multiline numberOfLines={3} placeholder="Describe cómo vive y su situación actual..." value={form.historia_biografia} onChangeText={(v) => handleChange('historia_biografia', v)} />

          <Text style={styles.label}>Necesidades Urgentes *</Text>
          <TextInput style={styles.input} placeholder="Ej: Víveres, frazadas, medicinas..." value={form.necesidades_urgentes} onChangeText={(v) => handleChange('necesidades_urgentes', v)} />
        </View>

        <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnSubmitText}>💾 Guardar y Publicar Caso</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  cardWrapper: { maxWidth: 750, width: '100%', alignSelf: 'center', padding: 20, marginVertical: 15 },
  btnVolver: { alignSelf: 'flex-start', marginBottom: 14, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: '#E2E8F0', borderRadius: 8 },
  btnVolverText: { fontWeight: 'bold', color: '#4A5568' },
  mainTitle: { fontSize: 26, fontWeight: '900', color: '#1A202C', marginBottom: 4 },
  subTitle: { fontSize: 13, color: '#718096', marginBottom: 20 },
  section: { backgroundColor: '#FFF', padding: 20, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#4A5568', marginBottom: 6, marginTop: 10 },
  miniHelp: { fontSize: 12, color: '#64748B', marginBottom: 8 },
  miniLabel: { fontSize: 11, fontWeight: 'bold', color: '#64748B', marginBottom: 4 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, outlineStyle: 'none' },
  selectHtml: { width: '100%', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 8, padding: 9, fontSize: 14, outline: 'none', cursor: 'pointer' },
  geoRow: { flexDirection: 'row', gap: 10, marginBottom: 8, flexWrap: 'wrap' },
  selectWrapper: { flex: 1, minWidth: 200 },
  textArea: { height: 80, textAlignVertical: 'top' },
  btnPickImage: { backgroundColor: '#EDF2F7', borderWidth: 1, borderColor: '#CBD5E0', borderStyle: 'dashed', padding: 12, borderRadius: 8, alignItems: 'center', marginVertical: 6 },
  btnPickImageText: { color: '#2B6CB0', fontWeight: 'bold', fontSize: 13 },
  previewImage: { width: 120, height: 120, borderRadius: 10, alignSelf: 'center', marginVertical: 8 },
  viviendaRow: { flexDirection: 'row', gap: 10, marginVertical: 6 },
  viviendaCol: { flex: 1, alignItems: 'center' },
  btnPickSmall: { width: '100%', backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnPickSmallText: { fontSize: 11, fontWeight: 'bold', color: '#475569' },
  previewSmall: { width: '100%', height: 75, borderRadius: 6, marginTop: 6, resizeMode: 'cover' },
  btnSubmit: { backgroundColor: '#FF385C', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 10, elevation: 3 },
  btnSubmitText: { color: '#FFF', fontWeight: '900', fontSize: 15 }
});