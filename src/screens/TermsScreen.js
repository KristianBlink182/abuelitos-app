import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function TermsScreen({ onGoHome }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        <TouchableOpacity style={styles.btnVolver} onPress={onGoHome}>
          <Text style={styles.btnVolverText}>← Volver al Inicio</Text>
        </TouchableOpacity>

        <Text style={styles.title}>📜 Términos, Condiciones y Transparencia Legal</Text>
        <Text style={styles.sub}>abuelitos.pe — Plataforma Social Comunitaria para el Perú</Text>

        <View style={styles.box}>
          <Text style={styles.boxTitle}>1. Naturaleza del Proyecto y Modelo Triangular</Text>
          <Text style={styles.paragraph}>
            abuelitos.pe es una plataforma tecnológica sin fines de lucro intermediaria de ayuda comunitaria. Nuestro objetivo es conectar a donantes solidarios con bodegas comerciales y autoridades comunales acreditadas (Tenientes Gobernadores, Agentes Municipales y Presidentes Comunales) para asegurar que el 100% de los fondos se transformen en alimentos de primera necesidad para adultos mayores en extrema vulnerabilidad.
          </Text>

          <Text style={styles.boxTitle}>2. Destino de los Fondos y Despacho en Bodegas</Text>
          <Text style={styles.paragraph}>
            Las transferencias realizadas mediante Yape, Plin o transferencias bancarias se dirigen directamente a la cuenta de la Bodega Solidaria Aliada de la comunidad. Dicho dinero se custodia como "Saldo Solidario en Alimentos" a favor del beneficiario y únicamente se descarga mediante la entrega física de canastas con constancia fotográfica.
          </Text>

          <Text style={styles.boxTitle}>3. Protección de Datos Personales (Ley N° 29733 de Perú)</Text>
          <Text style={styles.paragraph}>
            En cumplimiento de la Ley de Protección de Datos Personales (Ley N° 29733), la información de los donantes y beneficiarios es tratada con absoluta reserva. Por seguridad física del adulto mayor vulnerable, la plataforma no divulga coordenadas exactas de viviendas, limitándose a mostrar referencias distritales y comunales.
          </Text>

          <Text style={styles.boxTitle}>4. Protocolo Antifraude y Fiscalización</Text>
          <Text style={styles.paragraph}>
            Ningún caso es publicado sin el visado de una autoridad comunal reconocida. Si se detecta un intento de registro falso o cobro indebido por parte de un comercio, la autoridad local procede a la inhabilitación inmediata del punto y al traslado del saldo a una nueva bodega acreditada.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  wrapper: { maxWidth: 850, alignSelf: 'center', width: '100%', marginVertical: 15 },
  btnVolver: { alignSelf: 'flex-start', marginBottom: 16, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: '#E2E8F0', borderRadius: 8 },
  btnVolverText: { fontWeight: 'bold', color: '#4A5568' },
  title: { fontSize: 24, fontWeight: '900', color: '#1E293B', marginBottom: 4 },
  sub: { fontSize: 13, color: '#64748B', marginBottom: 20 },
  box: { backgroundColor: '#FFF', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  boxTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginTop: 14, marginBottom: 6 },
  paragraph: { fontSize: 13, color: '#475569', lineHeight: 22 }
});