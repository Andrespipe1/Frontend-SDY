import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import axios from "axios";
const loadLogo = async () => {
    try {
  
      const logo = await import('./../assets/LogoF.png');
      return logo.default;
    } catch (e) {
      throw new Error('No se pudo cargar el logo');
    }
  };
  export const generatePatientReport = async (paciente, token) => {
    try {
      const pacienteId = paciente._id;

      // Obtener datos del historial
      const [parametrosRes, comidasRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/paciente/parametro/${pacienteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/paciente/comidas/${pacienteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const parametros = parametrosRes.data.parametros || [];
      const comidas = comidasRes.data.comidas || [];

      // Crear el PDF
      const doc = new jsPDF();
      
      // Configuración inicial
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const logoWidth = 30;
      const logoHeight = 30;
      
      // Agregar logo
      try {
        const logoUrl = await loadLogo();
        doc.addImage(logoUrl, 'PNG', margin, margin, logoWidth, logoHeight);
      } catch (e) {
        console.log("No se pudo cargar el logo, continuando sin él");
      }
      
      // Encabezado
      doc.setFontSize(22);
      doc.setTextColor(40, 180, 130);
      doc.text('SALUDIFY', margin + logoWidth + 10, margin + 15);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Historial Digital', margin + logoWidth + 10, margin + 22);
      
      // Línea decorativa
      doc.setDrawColor(40, 180, 130);
      doc.setLineWidth(0.5);
      doc.line(margin, margin + logoHeight + 5, pageWidth - margin, margin + logoHeight + 5);
      
      // Información del paciente
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`Paciente: ${paciente.nombre} ${paciente.apellido}`, margin, margin + logoHeight + 20);
      doc.text(`Edad: ${paciente.edad} años`, margin, margin + logoHeight + 30);
      doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, margin, margin + logoHeight + 40);
      
      // Parámetros
      doc.setFontSize(16);
      doc.setTextColor(40, 180, 130);
      doc.text('Parámetros Clínicos', margin, margin + logoHeight + 60);
      
      if (parametros.length > 0) {
        const parametrosData = parametros.map((p) => [
          new Date(p.createdAt).toLocaleDateString(),
          `${p.peso} kg`,
          `${p.estatura} cm`,
          p.nivelActividadFisica,
          p.enfermedad || 'N/A',
          p.discapacidad || 'N/A',
        ]);
        
        autoTable(doc, {
          head: [['Fecha', 'Peso', 'Estatura', 'Actividad Física', 'Enfermedad', 'Discapacidad']],
          body: parametrosData,
          startY: margin + logoHeight + 65,
          headStyles: {
            fillColor: [40, 180, 130],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240]
          },
          margin: { left: margin }
        });
      } else {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('No hay parámetros registrados.', margin, margin + logoHeight + 70);
      }
      
      // Comidas
      const comidasY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : margin + logoHeight + 80;
      
      doc.setFontSize(16);
      doc.setTextColor(40, 180, 130);
      doc.text('Registro de Comidas', margin, comidasY);
      
      if (comidas.length > 0) {
        const comidasData = comidas.map((c) => [
          new Date(c.createdAt).toLocaleDateString(),
          c.tipoComida,
          c.descripcion,
        ]);
        
        autoTable(doc, {
          head: [['Fecha', 'Tipo de Comida', 'Descripción']],
          body: comidasData,
          startY: comidasY + 5,
          headStyles: {
            fillColor: [40, 180, 130],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240]
          },
          margin: { left: margin },
          columnStyles: {
            2: { cellWidth: 'auto' }
          }
        });
      } else {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('No hay comidas registradas.', margin, comidasY + 10);
      }
      
      // Pie de página
      const footerY = doc.internal.pageSize.getHeight() - 15;
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('© Saludify - Todos los derechos reservados', pageWidth/2, footerY, { align: 'center' });

      return doc;
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      throw error;
    }

      
  }

