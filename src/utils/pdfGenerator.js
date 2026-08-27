import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export const generarFichaPDF = async (abuelito) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; color: #1e293b; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #ff385c; padding-bottom: 15px; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: 900; color: #1e293b; }
        .logo span { color: #ff385c; }
        .badge { background-color: #fee2e2; color: #991b1b; padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; }
        .profile-section { display: flex; gap: 20px; margin-bottom: 20px; }
        .photo { width: 150px; height: 150px; object-fit: cover; border-radius: 10px; border: 2px solid #e2e8f0; }
        .info h1 { font-size: 20px; margin: 0 0 5px 0; color: #0f172a; }
        .info p { margin: 3px 0; font-size: 13px; color: #475569; }
        .box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
        .box-title { font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 8px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
        .highlight { background-color: #f0fdf4; border: 1px solid #bbf7d0; }
        .highlight .box-title { color: #166534; border-color: #bbf7d0; }
        .warning { background-color: #fff7ed; border: 1px solid #fed7aa; }
        .warning .box-title { color: #9a3412; border-color: #fed7aa; }
        .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🇵🇪 abuelitos<span>.pe</span></div>
        <div class="badge">EXPEDIENTE SOCIAL OFICIAL</div>
      </div>

      <div class="profile-section">
        <img src="${abuelito.foto_url}" class="photo" />
        <div class="info">
          <h1>${abuelito.nombre_completo}</h1>
          <p><strong>Edad:</strong> ${abuelito.edad} años</p>
          <p><strong>DNI:</strong> ${abuelito.dni}</p>
          <p><strong>Ubicación:</strong> ${abuelito.caserio}, ${abuelito.distrito} - ${abuelito.provincia} (${abuelito.departamento})</p>
          <p><strong>Condición:</strong> Extrema Vulnerabilidad y Pobreza</p>
        </div>
      </div>

      <div class="box">
        <div class="box-title">📖 DIAGNÓSTICO Y SITUACIÓN DE VIDA</div>
        <p style="font-size: 13px; color: #334155;">${abuelito.historia_biografia}</p>
      </div>

      <div class="box">
        <div class="box-title">📋 NECESIDADES PRIORITARIAS DE APOYO</div>
        <p style="font-size: 13px; color: #334155;">✓ ${abuelito.necesidades_urgentes}</p>
        <p style="font-size: 13px; color: #334155;">✓ Canasta básica mensual de alimentos no perecibles.</p>
      </div>

      <div class="box highlight">
        <div class="box-title">🛡️ AUTORIDAD COMUNAL RESPONSABLE DE LA VALIDACIÓN</div>
        <p style="font-size: 13px; margin: 3px 0;"><strong>Autoridad:</strong> ${abuelito.autoridad_nombre} (${abuelito.autoridad_cargo})</p>
        <p style="font-size: 13px; margin: 3px 0;"><strong>Contacto Directo:</strong> ${abuelito.autoridad_telefono}</p>
        <p style="font-size: 11px; color: #166534; font-style: italic; margin-top: 6px;">* Esta autoridad comunal certifica la veracidad de la situación socioeconómica.</p>
      </div>

      <div class="box warning">
        <div class="box-title">🏪 BODEGA SOLIDARIA ASIGNADA PARA ENVÍO DE VÍVERES</div>
        <p style="font-size: 13px; margin: 3px 0;"><strong>Comercio:</strong> ${abuelito.bodega_nombre} (${abuelito.bodega_dueno})</p>
        <p style="font-size: 13px; margin: 3px 0;"><strong>Dirección:</strong> ${abuelito.bodega_direccion}</p>
        <p style="font-size: 14px; margin: 6px 0; font-weight: bold; color: #c2410c;">📱 Yape / Plin Oficial: ${abuelito.bodega_yape}</p>
        <p style="font-size: 13px; margin: 3px 0;"><strong>${abuelito.bodega_banco}:</strong> ${abuelito.bodega_cuenta}</p>
      </div>

      <div class="footer">
        Ficha generada desde <strong>abuelitos.pe</strong> — Plataforma solidaria transparente para el Perú profundo.
      </div>
    </body>
    </html>
  `;

  try {
    if (Platform.OS === 'web') {
      await Print.printAsync({ html: htmlContent });
    } else {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    }
  } catch (error) {
    alert('Error al generar el PDF.');
  }
};