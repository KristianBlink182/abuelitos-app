import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function FAQScreen({ onGoHome }) {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      pregunta: '1. ¿Por qué el dinero va a la Bodega Aliada y no en efectivo al abuelito?',
      respuesta: 'En el Perú profundo, la mayoría de adultos mayores en extrema pobreza no tienen celular, luz ni cuentas bancarias. Si enviamos efectivo a terceros o familiares, existe riesgo de desvío. Al enviar el dinero a la Bodega Aliada de su caserío, garantizamos que el 100% de tu donación se transforme en alimentos de primera necesidad (arroz, avena, leche, menestras) que el abuelito retira de forma segura.'
    },
    {
      pregunta: '2. ¿Cómo se evita que la bodega cobre precios excesivos o infle los productos?',
      respuesta: 'Cada Bodega Aliada firma un Convenio de Precios Comunitarios fiscalizado por el Teniente Gobernador o Presidente Comunal. Además, trabajamos con Canastas Básicas Estandarizadas (S/ 40 y S/ 80) con productos y pesos pre-acordados.'
    },
    {
      pregunta: '3. ¿Cómo puedo comprobar que los víveres realmente fueron entregados?',
      respuesta: 'Cada vez que el abuelito recoge su canasta, la bodega o autoridad sube una fotografía del abuelito con sus víveres en la sección "Muro de Transparencia" de su perfil en abuelitos.pe, detallando la fecha y los productos entregados.'
    },
    {
      pregunta: '4. ¿Puedo hacer una videollamada o visitar al abuelito en su caserío?',
      respuesta: '¡Sí! En la ficha de cada abuelito encontrarás el botón "📹 Solicitar Videollamada". Esto te pondrá en contacto directo por WhatsApp con la Autoridad Comunal para coordinar una llamada en vivo cuando visiten al abuelito, o coordinar una visita solidaria.'
    },
    {
      pregunta: '5. ¿Cómo puedo postular a un adulto mayor de mi comunidad?',
      respuesta: 'Haz clic en el botón "+ Postular Caso" en el menú. Solo necesitas su DNI, ubicación exacta y una fotografía real. Nuestro equipo se comunicará con las autoridades de la zona para validar la situación antes de publicarlo.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>❓ Preguntas Frecuentes y Garantía de Ayuda</Text>
        <Text style={styles.sub}>
          Conoce cómo funciona el modelo de transparencia triangular entre Donante, Bodega y Autoridad Comunal.
        </Text>

        <View style={styles.faqList}>
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <View key={index} style={[styles.faqCard, isOpen && styles.faqCardOpen]}>
                <TouchableOpacity style={styles.faqHeader} onPress={() => toggleFAQ(index)} activeOpacity={0.8}>
                  <Text style={[styles.faqQuestion, isOpen && styles.faqQuestionOpen]}>
                    {item.pregunta}
                  </Text>
                  <Text style={styles.faqArrow}>{isOpen ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                
                {isOpen && (
                  <View style={styles.faqBody}>
                    <Text style={styles.faqAnswer}>{item.respuesta}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* CAJA DE CONTACTO SOLIDARIO */}
        <View style={styles.contactBox}>
          <Text style={styles.contactTitle}>¿Tienes más dudas o quieres ser voluntario?</Text>
          <Text style={styles.contactText}>
            Escríbenos directamente para coordinar apoyo en tu provincia o caserío.
          </Text>
          <TouchableOpacity style={styles.btnHome} onPress={onGoHome}>
            <Text style={styles.btnHomeText}>← Volver al Directorio de Casos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  wrapper: { maxWidth: 850, alignSelf: 'center', width: '100%', marginVertical: 15 },
  title: { fontSize: 24, fontWeight: '900', color: '#1E293B', textAlign: 'center', marginBottom: 4 },
  sub: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 25, lineHeight: 18 },
  faqList: { gap: 12 },
  faqCard: { backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  faqCardOpen: { borderColor: '#FF385C', borderWidth: 1.5 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
  faqQuestion: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', flex: 1, marginRight: 10 },
  faqQuestionOpen: { color: '#FF385C' },
  faqArrow: { fontSize: 12, color: '#64748B', fontWeight: 'bold' },
  faqBody: { paddingHorizontal: 18, paddingBottom: 18, borderTopWidth: 1, borderColor: '#F1F5F9', paddingTop: 12 },
  faqAnswer: { fontSize: 13, color: '#475569', lineHeight: 22 },
  contactBox: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#E2E8F0', marginTop: 30, alignItems: 'center' },
  contactTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  contactText: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 16 },
  btnHome: { backgroundColor: '#FF385C', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  btnHomeText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 }
});