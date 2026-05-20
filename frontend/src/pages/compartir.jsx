import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PrivateLayout from '../components/PrivateLayout'

// Función para obtener archivos disponibles
const fetchAvailableFiles = async () => {
  try {
    return [
      { id: 'f-1', name: 'Documento_Proyecto.pdf', type: 'file', icon: '📄', size: '2.4 MB', owner: 'Tú', security: 'public' },
      { id: 'f-2', name: 'Llaves_Acceso_BD.txt', type: 'file', icon: '📝', size: '1.2 KB', owner: 'Tú', security: 'encrypted' },
      { id: 'f-3', name: 'Presentacion_Final.pptx', type: 'file', icon: '📊', size: '15.8 MB', owner: 'Tú', security: 'public' },
      { id: 'f-4', name: 'Foto_Perfil.jpg', type: 'file', icon: '🖼️', size: '3.2 MB', owner: 'Tú', security: 'public' },
      { id: 'f-5', name: 'Contrato_Confidencial.docx', type: 'file', icon: '📋', size: '890 KB', owner: 'Tú', security: 'password' },
      { id: 'f-6', name: 'Backup_Datos.zip', type: 'file', icon: '📦', size: '45.2 MB', owner: 'Tú', security: 'encrypted' }
    ];
  } catch (error) {
    throw error;
  }
}

export default function CompartirArchivo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Estados principales
  const [destinatario, setDestinatario] = useState(searchParams.get('destinatario') || '');
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [archivosDisponibles, setArchivosDisponibles] = useState([]);
  const [busquedaArchivo, setBusquedaArchivo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estados de permisos (igual que CompartirModal)
  const [canDownload, setCanDownload] = useState(true);
  const [expiration, setExpiration] = useState('indefinido');

  // Cargar archivos disponibles
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const files = await fetchAvailableFiles();
        setArchivosDisponibles(files);

        // Si viene un archivo preseleccionado por URL
        const archivoId = searchParams.get('archivo');
        if (archivoId) {
          const archivo = files.find(f => f.id === archivoId);
          if (archivo) setArchivoSeleccionado(archivo);
        }

        // Si viene un destinatario preseleccionado por URL
        const destinatarioParam = searchParams.get('destinatario');
        if (destinatarioParam) {
          setDestinatario(destinatarioParam);
        }
      } catch (error) {
        console.error('Error cargando archivos:', error);
      }
    };
    loadFiles();
  }, [searchParams]);

  // Filtrar archivos por búsqueda
  const archivosFiltrados = archivosDisponibles.filter(archivo =>
    archivo.name.toLowerCase().includes(busquedaArchivo.toLowerCase())
  );

  // Función para seleccionar archivo
  const handleSelectArchivo = (archivo) => {
    setArchivoSeleccionado(archivo);
  };

  // Función para compartir
  const handleShare = async () => {
    if (!destinatario.trim()) {
      alert('Por favor ingresa un destinatario');
      return;
    }
    if (!archivoSeleccionado) {
      alert('Por favor selecciona un archivo');
      return;
    }

    setIsLoading(true);
    try {
      // Simulación de envío
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert(`Archivo "${archivoSeleccionado.name}" compartido con ${destinatario} exitosamente!`);
      navigate('/dashboard');
    } catch (error) {
      alert('Error al compartir el archivo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PrivateLayout>
      <div style={{ padding: '20px' }}>
        <h1>Compartir Archivo</h1>
        <p>Selecciona un destinatario y el archivo que deseas compartir.</p>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Destinatario</h3>
          <input
            type="text"
            placeholder="usuario@ejemplo.com"
            value={destinatario}
            onChange={(e) => setDestinatario(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>Seleccionar Archivo</h3>
          <div>
            {archivosDisponibles.map(archivo => (
              <div key={archivo.id} style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '10px' }}>
                <span>{archivo.icon}</span>
                <span>{archivo.name}</span>
                <button onClick={() => handleSelectArchivo(archivo)}>Seleccionar</button>
              </div>
            ))}
          </div>
        </div>

        {archivoSeleccionado && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e8f5e8' }}>
            <p>Archivo seleccionado: {archivoSeleccionado.name}</p>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <button onClick={handleShare} disabled={!destinatario.trim() || !archivoSeleccionado}>
            Compartir Archivo
          </button>
        </div>
      </div>
    </PrivateLayout>
  )
}