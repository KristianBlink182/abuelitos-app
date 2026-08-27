import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';

export default function AboutScreen({ onGoHome }) {
  return (
    <ScrollView style={styles.container}>
      
      {/* 1. BANNER SUPERIOR */}
      <View style={styles.topHeroBanner}>
        <View style={styles.topHeroContent}>
          <Text style={styles.topHeroTag}>PROPÓSITO Y CORAZÓN SOLIDARIO</Text>
          <Text style={styles.topHeroTitle}>Quiénes Somos y Nuestra Causa</Text>
          <Text style={styles.topHeroSub}>
            Conoce la historia, el funcionamiento y el compromiso ético y legal detrás de abuelitos.pe
          </Text>
        </View>
      </View>

      {/* 2. CONTENIDO PRINCIPAL */}
      <View style={styles.contentSection}>
        <View style={styles.wrapper}>

          {/* CARTA DEL FUNDADOR (CÁLIDA Y PERSONAL) */}
          <View style={styles.cardFundador}>
            <Text style={styles.fundadorTag}>MENSAJE DE INICIO</Text>
            <Text style={styles.saludoTitle}>Hola, soy Christian Suárez, creador de abuelitos.pe</Text>
            
            <Text style={styles.parrafo}>
              Esta iniciativa nació de una profunda inquietud al ser testigo de la realidad invisible que enfrentan miles de adultos mayores en los caseríos y comunidades más alejadas del Perú. Hombres y mujeres de la tercera edad que dedicaron su vida entera a trabajar la tierra y que hoy, en su vejez, se encuentran en situación de abandono, sin una pensión que cubra sus necesidades básicas, con dolencias crónicas de salud y viviendo en humildes viviendas rústicas de adobe.
            </Text>

            <Text style={styles.parrafo}>
              Durante las temporadas de <Text style={{ fontWeight: 'bold', color: '#1E293B' }}>heladas y friaje</Text> en la sierra sur y el altiplano (en regiones como Puno, Cusco, Huancavelica y Ayacucho), las temperaturas descienden por debajo de los -5°C. En estas condiciones extremas, dormir sin abrigo adecuado o no contar con un plato de comida caliente diario pone en riesgo directo la vida de nuestros abuelitos.
            </Text>

            <Text style={styles.parrafo}>
              Decidí crear <Text style={{ fontWeight: 'bold', color: '#FF385C' }}>abuelitos.pe</Text> para convertir la tecnología en un puente directo y transparente: un canal que una el corazón solidario de cualquier persona con la bodega de víveres más cercana al hogar del abuelito, garantizándole una alimentación digna y medicinas sin intermediarios burocráticos.
            </Text>
          </View>

          {/* CÓMO FUNCIONA EL CIRCUITO DE TRABAJO */}
          <View style={styles.sectionBlock}>
            <Text style={styles.blockTitle}>🔄 ¿Cómo Funciona el Circuito de Ayuda?</Text>
            <Text style={styles.blockSub}>Nuestro modelo opera bajo un esquema triangular auditado y fiscalizado:</Text>

            <View style={styles.stepCard}>
              <Text style={styles.stepNum}>1</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepHead}>Empadronamiento y Validación Comunal</Text>
                <Text style={styles.stepText}>
                  Los casos son postulados con DNI y fotografías reales. Antes de ser publicados, son verificados por la autoridad comunal acreditada de la zona (Teniente Gobernador, Agente Municipal o Presidente Comunal), quien da fe de la necesidad socioeconómica del adulto mayor.
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepNum}>2</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepHead}>Afiliación de la Bodega Solidaria</Text>
                <Text style={styles.stepText}>
                  Se vincula la tienda o comercio local más cercano a la vivienda del abuelito. La bodega firma un compromiso de precios comunitarios fijados y custodia los fondos de los donantes como una línea de crédito exclusiva en alimentos.
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepNum}>3</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepHead}>Donación Directa y Supervisada</Text>
                <Text style={styles.stepText}>
                  El donante transfiere su aporte vía Yape, Plin o cuenta bancaria directamente a la bodega aliada y adjunta su comprobante. Una vez confirmado el ingreso, el saldo se acredita en la ficha del abuelito.
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepNum}>4</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepHead}>Despacho con Evidencia Fotográfica</Text>
                <Text style={styles.stepText}>
                  El abuelito retira periódicamente sus productos (arroz, avena, aceite, menestras, leche o medicinas). La bodega registra la entrega subiendo una fotografía que se publica de inmediato en el Muro de Transparencia para que el donante compruebe que la ayuda llegó.
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepNum}>5</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepHead}>Visitas Presenciales y Ayuda en Mano</Text>
                <Text style={styles.stepText}>
                  Brindamos los datos de referencia distrital y el contacto de la autoridad para que familias, empresas o grupos de voluntarios puedan viajar presencialmente al caserío y entregar donaciones materiales (camas, colchones, frazadas, sillas de ruedas) en mano propia.
                </Text>
              </View>
            </View>
          </View>

          {/* MARCO LEGAL Y DESLINDE DE RESPONSABILIDAD (BLINDAJE DE LA PLATAFORMA) */}
          <View style={styles.cardLegal}>
            <Text style={styles.legalTag}>MARCO LEGAL Y CONDICIONES DE USO</Text>
            <Text style={styles.legalTitle}>🛡️ Protección Legal, Delitos y Deslinde de Responsabilidad</Text>

            <Text style={styles.legalText}>
              <Text style={{ fontWeight: 'bold' }}>1. Compromiso Estricto de Cero Lucro:</Text> abuelitos.pe es un portal tecnológico facilitador de carácter social. La plataforma NO es una entidad bancaria, NO capta fondos en cuentas propias, NO cobra comisiones por intermediación y NO genera rentabilidad económica alguna.
            </Text>

            <Text style={styles.legalText}>
              <Text style={{ fontWeight: 'bold' }}>2. Responsabilidad de la Información Declarada:</Text> Toda persona que registre o postule un caso social lo hace bajo declaración jurada. La veracidad de los datos, identidad del beneficiario y estado de necesidad corresponden exclusivamente al postulante y a la autoridad comunal que suscribe la verificación.
            </Text>

            <Text style={styles.legalText}>
              <Text style={{ fontWeight: 'bold' }}>3. Sanciones por Fraude o Información Falsa:</Text> Cualquier intento de registrar información falsa, suplantar la identidad de un adulto mayor, inventar autoridades o intentar desviar donaciones mediante cuentas no autorizadas será inmediatamente remitido a la Policía Nacional del Perú (PNP) y al Ministerio Público para las acciones penales correspondientes por los delitos de <Text style={{ fontWeight: 'bold' }}>Falsedad Ideológica y Estafa</Text> conforme al Código Penal Peruano.
            </Text>

            <Text style={styles.legalText}>
              <Text style={{ fontWeight: 'bold' }}>4. Deslinde de Responsabilidad:</Text> abuelitos.pe y sus creadores no se responsabilizan por acuerdos privados, discrepancias comerciales con las bodegas ajenas a la plataforma ni por el uso indebido que terceros pudieran dar a los datos publicados de buena fe para fines humanitarios.
            </Text>

            <Text style={styles.legalText}>
              <Text style={{ fontWeight: 'bold' }}>5. Protección de Datos (Ley N° 29733):</Text> Por salvaguarda física del adulto mayor vulnerable, no se publican coordenadas exactas de su domicilio ni números de DNI completos en acceso público.
            </Text>
          </View>

          {/* BOTÓN VOLVER */}
          <TouchableOpacity style={styles.btnVolver} onPress={onGoHome} activeOpacity={0.85}>
            <Text style={styles.btnVolverText}>← Volver al Directorio de Casos</Text>
          </TouchableOpacity>

        </View>
      </View>
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
    paddingVertical: 45,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  topHeroContent: { maxWidth: 900, width: '100%', alignSelf: 'center' },
  topHeroTag: { color: '#FF385C', fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 6 },
  topHeroTitle: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', marginBottom: 6 },
  topHeroSub: { fontSize: 14, color: '#94A3B8', maxWidth: 720, lineHeight: 22 },
  contentSection: {
    paddingVertical: 45,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    backgroundImage: Platform.OS === 'web' 
      ? 'radial-gradient(circle at 10% 20%, rgba(255, 56, 92, 0.03) 0%, transparent 40%), linear-gradient(180deg, #F8FAFC 0%, #FFFDF9 50%, #F1F5F9 100%)' 
      : undefined,
  },
  wrapper: { maxWidth: 900, width: '100%', alignSelf: 'center' },
  
  // CARTA DEL FUNDADOR
  cardFundador: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  fundadorTag: { color: '#FF385C', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 4 },
  saludoTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 14 },
  parrafo: { fontSize: 14, color: '#475569', lineHeight: 23, marginBottom: 12 },

  // BLOQUE DE PASOS
  sectionBlock: { marginBottom: 35 },
  blockTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A', marginBottom: 4 },
  blockSub: { fontSize: 13, color: '#64748B', marginBottom: 20 },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
    alignItems: 'flex-start',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  stepNum: {
    backgroundColor: '#0F172A',
    color: '#FFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 13,
    fontWeight: 'bold',
  },
  stepHead: { fontSize: 15, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  stepText: { fontSize: 13, color: '#64748B', lineHeight: 20 },

  // BLOQUE LEGAL
  cardLegal: {
    backgroundColor: '#FFFBEB',
    padding: 26,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    marginBottom: 30,
  },
  legalTag: { color: '#B45309', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 4 },
  legalTitle: { fontSize: 17, fontWeight: '900', color: '#92400E', marginBottom: 12 },
  legalText: { fontSize: 12, color: '#78350F', lineHeight: 20, marginBottom: 10 },

  btnVolver: { alignSelf: 'center', backgroundColor: '#0F172A', paddingVertical: 13, paddingHorizontal: 28, borderRadius: 10 },
  btnVolverText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 }
});