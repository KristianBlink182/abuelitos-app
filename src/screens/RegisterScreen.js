import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Modal, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { postularAbuelito } from '../services/api';
import { ubigeoPeru } from '../utils/ubigeoPeru';

export default function RegisterScreen({ onCancel, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState(null);
  
  const [fotoV1, setFotoV1] = useState(null);
  const [fotoV2, setFotoV2] = useState(null);
  const [fotoV3, setFotoV3] = useState(null);

  // Casilla de Aceptación Legal Obligatoria
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [modalTerminosVisible, setModalTerminosVisible] = useState(false);

  // Ubigeo
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
    dolencias_salud: '',
    medicamentos: '',
    carencias_materiales: '',
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

    // VALIDACIÓN LEGAL OBLIGATORIA
    if (!aceptaTerminos) {
      alert('⚠️ Debes aceptar la Declaración Jurada y los Términos y Condiciones Legales para poder registrar el caso.');
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
    formData.append('dolencias_salud', form.dolencias_salud);
    formData.append('medicamentos', form.medicamentos);
    formData.append('carencias_materiales', form.carencias_materiales);
    formData.append('necesidades_urgentes', form.necesidades_urgentes || form.dolencias_salud);

    if (foto.file) formData.append('foto', foto.file);
    else formData.append('foto', { uri: foto.uri, name: 'perfil.jpg', type: 'image/jpeg' });

    if (fotoV1) {
      if (fotoV1.file) formData.append('foto_vivienda_1', fotoV1.file);
      else formData.append('foto_vivienda_1', { uri: fotoV1.uri, name: 'v1.jpg', type: 'image/jpeg' });
    }
    if (fotoV2) {
      if (fotoV2.file) formData.append('foto_vivienda_2', fotoV2.file);
      else formData.append('foto_vivienda_2', { uri: fotoV2.uri, name: 'v2.jpg', type: 'image/jpeg' });
    }
    if (fotoV3) {
      if (fotoV3.file) formData.append('foto_vivienda_3', fotoV3.file);
      else formData.append('foto_vivienda_3', { uri: fotoV3.uri, name: 'v3.jpg', type: 'image/jpeg' });
    }

    const res = await postularAbuelito(formData);
    setLoading(false);

    if (res.success) {
      alert('✅ Caso registrado con éxito. Pasará por supervisión de la autoridad comunal antes de publicarse.');
      onSuccess();
    } else {
      alert(res.error || '❌ Error al registrar el caso.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* BANNER SUPERIOR */}
      <View style={styles.topHeroBanner}>
        <View style={styles.topHeroContent}>
          <Text style={styles.topHeroTag}>EMPADRONAMIENTO SOLIDARIO</Text>
          <Text style={styles.topHeroTitle}>Registrar Nuevo Caso Social</Text>
          <Text style={styles.topHeroSub}>
            Ingresa los datos reales del adulto mayor. Toda información será validada por la autoridad comunal.
          </Text>
        </View>
      </View>

      {/* FORMULARIO */}
      <View style={styles.formSection}>
        <View style={styles.cardWrapper}>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Datos Personales del Adulto Mayor</Text>

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
            <TouchableOpacity style={styles.btnPickImage} onPress={() => pickImage(setFoto)} activeOpacity={0.85}>
              <Text style={styles.btnPickImageText}>📷 {foto ? '✓ Foto de Perfil Seleccionada' : 'Seleccionar Foto de Perfil'}</Text>
            </TouchableOpacity>
            {foto && <Image source={{ uri: foto.uri }} style={styles.previewImage} />}

            {/* 3 FOTOS ADICIONALES */}
            <Text style={[styles.label, { marginTop: 14, color: '#1E293B' }]}>📸 Sube 3 Fotografías Adicionales:</Text>
            
            <View style={styles.viviendaRow}>
              <View style={styles.viviendaCol}>
                <TouchableOpacity style={styles.btnPickSmall} onPress={() => pickImage(setFotoV1)} activeOpacity={0.85}>
                  <Text style={styles.btnPickSmallText}>{fotoV1 ? '✓ Foto 1' : '+ Foto 1'}</Text>
                </TouchableOpacity>
                {fotoV1 && <Image source={{ uri: fotoV1.uri }} style={styles.previewSmall} />}
              </View>

              <View style={styles.viviendaCol}>
                <TouchableOpacity style={styles.btnPickSmall} onPress={() => pickImage(setFotoV2)} activeOpacity={0.85}>
                  <Text style={styles.btnPickSmallText}>{fotoV2 ? '✓ Foto 2' : '+ Foto 2'}</Text>
                </TouchableOpacity>
                {fotoV2 && <Image source={{ uri: fotoV2.uri }} style={styles.previewSmall} />}
              </View>

              <View style={styles.viviendaCol}>
                <TouchableOpacity style={styles.btnPickSmall} onPress={() => pickImage(setFotoV3)} activeOpacity={0.85}>
                  <Text style={styles.btnPickSmallText}>{fotoV3 ? '✓ Foto 3' : '+ Foto 3'}</Text>
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
                ) : null}
              </View>

              <View style={styles.selectWrapper}>
                <Text style={styles.miniLabel}>2. Provincia</Text>
                {Platform.OS === 'web' ? (
                  <select style={styles.selectHtml} value={provincia} onChange={(e) => handleCambioProv(e.target.value)}>
                    {provinciasDisponibles.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                ) : null}
              </View>
            </View>

            <View style={styles.geoRow}>
              <View style={styles.selectWrapper}>
                <Text style={styles.miniLabel}>3. Distrito</Text>
                {Platform.OS === 'web' ? (
                  <select style={styles.selectHtml} value={distrito} onChange={(e) => setDistrito(e.target.value)}>
                    {distritosDisponibles.map((dist) => <option key={dist} value={dist}>{dist}</option>)}
                  </select>
                ) : null}
              </View>

              <View style={styles.selectWrapper}>
                <Text style={styles.miniLabel}>4. Caserío / Anexo / Comunidad *</Text>
                <TextInput style={styles.input} placeholder="Ej: Caserío Huayllay" value={form.caserio} onChangeText={(v) => handleChange('caserio', v)} />
              </View>
            </View>

            {/* HISTORIA */}
            <Text style={styles.label}>Historia y Situación Actual de Vulnerabilidad *</Text>
            <TextInput style={[styles.input, styles.textArea]} multiline numberOfLines={3} placeholder="Describe cómo vive y su situación familiar o económica..." value={form.historia_biografia} onChangeText={(v) => handleChange('historia_biografia', v)} />

            {/* SALUD Y CARENCIAS */}
            <Text style={styles.label}>🏥 Diagnóstico de Salud y Dolencias:</Text>
            <TextInput style={styles.input} placeholder="Ej: Artrosis severa en rodillas, hipertensión arterial..." value={form.dolencias_salud} onChangeText={(v) => handleChange('dolencias_salud', v)} />

            <Text style={styles.label}>💊 Medicamentos que Necesita:</Text>
            <TextInput style={styles.input} placeholder="Ej: Losartán 50mg, Paracetamol 500mg..." value={form.medicamentos} onChangeText={(v) => handleChange('medicamentos', v)} />

            <Text style={styles.label}>🛏️ Carencias de Hogar y Enseres:</Text>
            <TextInput style={styles.input} placeholder="Ej: Cama con colchón, frazadas gruesas, silla de ruedas..." value={form.carencias_materiales} onChangeText={(v) => handleChange('carencias_materiales', v)} />
          </View>

          {/* ========================================================
              BLOQUE DE DECLARACIÓN JURADA Y TÉRMINOS OBLIGATORIOS
             ======================================================== */}
          <View style={styles.legalConsentBox}>
            <TouchableOpacity 
              style={styles.checkboxRow} 
              onPress={() => setAceptaTerminos(!aceptaTerminos)}
              activeOpacity={0.8}
            >
              <Text style={styles.checkIcon}>{aceptaTerminos ? '☑' : '☐'}</Text>
              <Text style={styles.checkConsentText}>
                Declaro bajo juramento que los datos e imágenes son verídicos y acepto los{' '}
                <Text style={styles.linkTerminos} onPress={() => setModalTerminosVisible(true)}>
                  Términos y Condiciones Legales
                </Text>.
              </Text>
            </TouchableOpacity>
            <Text style={styles.legalWarning}>
              * La presentación de información falsa constituye delito de Falsedad Ideológica según el Código Penal del Perú.
            </Text>
          </View>

          {/* BOTONES DE ACCIÓN */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.btnCancel} onPress={onCancel} activeOpacity={0.85}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.btnSubmit, !aceptaTerminos && styles.btnSubmitDisabled]} 
              onPress={handleSubmit} 
              disabled={loading} 
              activeOpacity={0.85}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnSubmitText}>🚀 Guardar y Postular Caso</Text>}
            </TouchableOpacity>
          </View>

        </View>
      </View>

      {/* POPUP DE TÉRMINOS Y CONDICIONES LEGALES */}
      <Modal visible={modalTerminosVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>📜 Términos, Condiciones y Deslinde Legal</Text>
            
            <ScrollView style={{ maxHeight: 380 }}>
              <Text style={styles.tTitle}>1. Declaración Jurada de Veracidad</Text>
              <Text style={styles.tText}>
                El postulante declara bajo juramento que toda la información, fotografías y situación de vulnerabilidad corresponden estrictamente a la realidad. Cualquier falsedad acarreará denuncias penales ante el Ministerio Público por los delitos de Falsedad Ideológica y Estafa.
              </Text>

              <Text style={styles.tTitle}>2. Cero Lucro y Deslinde de Responsabilidad</Text>
              <Text style={styles.tText}>
                abuelitos.pe es un puente tecnológico comunitario sin fines de lucro. La plataforma no cobra comisiones, no recibe depósitos a cuentas propias y no se responsabiliza por disputas comerciales externas con las bodegas comunitarias.
              </Text>

              <Text style={styles.tTitle}>3. Protección de Datos (Ley N° 29733)</Text>
              <Text style={styles.tText}>
                Los datos son tratados con reserva y confidencialidad. No se publican coordenadas exactas de viviendas ni documentos completos para proteger la seguridad física del adulto mayor.
              </Text>
            </ScrollView>

            <TouchableOpacity style={styles.btnCloseModal} onPress={() => setModalTerminosVisible(false)}>
              <Text style={styles.btnCloseModalText}>Entendido y Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 35,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  topHeroContent: { maxWidth: 850, width: '100%', alignSelf: 'center' },
  topHeroTag: { color: '#FF385C', fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 4 },
  topHeroTitle: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  topHeroSub: { fontSize: 13, color: '#94A3B8', maxWidth: 700, lineHeight: 18 },
  formSection: { paddingVertical: 35, paddingHorizontal: 16 },
  cardWrapper: { maxWidth: 800, width: '100%', alignSelf: 'center' },
  section: { backgroundColor: '#FFF', padding: 24, borderRadius: 18, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2, marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: '#0F172A', marginBottom: 14, borderBottomWidth: 1, borderColor: '#F1F5F9', paddingBottom: 8 },
  label: { fontSize: 12, fontWeight: '700', color: '#334155', marginBottom: 5, marginTop: 10 },
  miniLabel: { fontSize: 11, fontWeight: 'bold', color: '#64748B', marginBottom: 3 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13, outlineStyle: 'none' },
  selectHtml: { width: '100%', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E0', borderRadius: 8, padding: 8, fontSize: 13, outline: 'none', cursor: 'pointer' },
  geoRow: { flexDirection: 'row', gap: 10, marginBottom: 8, flexWrap: 'wrap' },
  selectWrapper: { flex: 1, minWidth: 200 },
  textArea: { height: 80, textAlignVertical: 'top' },
  btnPickImage: { backgroundColor: '#FDF2F8', borderWidth: 1, borderColor: '#F472B6', borderStyle: 'dashed', padding: 12, borderRadius: 10, alignItems: 'center', marginVertical: 6 },
  btnPickImageText: { color: '#BE185D', fontWeight: 'bold', fontSize: 13 },
  previewImage: { width: 120, height: 120, borderRadius: 10, alignSelf: 'center', marginVertical: 8 },
  viviendaRow: { flexDirection: 'row', gap: 10, marginVertical: 6 },
  viviendaCol: { flex: 1, alignItems: 'center' },
  btnPickSmall: { width: '100%', backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnPickSmallText: { fontSize: 11, fontWeight: 'bold', color: '#475569' },
  previewSmall: { width: '100%', height: 75, borderRadius: 6, marginTop: 6, resizeMode: 'cover' },
  
  // LEGAL CONSENT BOX
  legalConsentBox: {
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    marginBottom: 20,
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start' },
  checkIcon: { fontSize: 20, color: '#D97706', marginRight: 10, marginTop: -2 },
  checkConsentText: { fontSize: 13, color: '#78350F', flex: 1, lineHeight: 19, fontWeight: '600' },
  linkTerminos: { color: '#DC2626', fontWeight: 'bold', textDecorationLine: 'underline', cursor: 'pointer' },
  legalWarning: { fontSize: 11, color: '#B45309', marginTop: 8, fontStyle: 'italic' },

  btnRow: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end' },
  btnCancel: { backgroundColor: '#E2E8F0', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center' },
  btnCancelText: { color: '#475569', fontWeight: 'bold', fontSize: 13 },
  btnSubmit: { backgroundColor: '#FF385C', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 10, alignItems: 'center', elevation: 3 },
  btnSubmitDisabled: { opacity: 0.5 },
  btnSubmitText: { color: '#FFF', fontWeight: '900', fontSize: 14 },

  // MODAL LEGAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 24, maxWidth: 600, width: '100%', elevation: 6 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 14, borderBottomWidth: 1, borderColor: '#E2E8F0', paddingBottom: 8 },
  tTitle: { fontSize: 14, fontWeight: 'bold', color: '#0F172A', marginTop: 10, marginBottom: 4 },
  tText: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 10 },
  btnCloseModal: { backgroundColor: '#0F172A', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  btnCloseModalText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 }
});