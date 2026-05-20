import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CompartirModal = ({ isOpen, onClose, item, presetAccessDuration, presetAllowDownload }) => {
  const navigate = useNavigate();
  
  if (!isOpen || !item) return null;

  const [search, setSearch] = useState('');
  const [canDownload, setCanDownload] = useState(presetAllowDownload !== undefined ? presetAllowDownload : true);
  const [expiration, setExpiration] = useState(presetAccessDuration || 'indefinido');

  const isProtected = presetAccessDuration !== undefined;

  // Función para expandir a vista completa
  const handleExpand = () => {
    const params = new URLSearchParams();
    if (item) params.set('archivo', item.id);
    if (search.trim()) params.set('destinatario', search.trim());
    
    navigate(`/compartir?${params.toString()}`);
  };

  const handleCopyLink = () => {
    const link = `https://tu-app.com/share/${item.id}`;
    navigator.clipboard.writeText(link);
    alert('Enlace copiado al portapapeles');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-header">
          <h3>Compartir "{item.nombre || item.name}"</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              className="expand-btn" 
              onClick={handleExpand}
              title="Expandir a vista completa"
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              ⛶
            </button>
            <button className="close-share" onClick={onClose}>&times;</button>
          </div>
        </div>

        <div className="share-body">
          {/* Aviso de archivo protegido */}
          {isProtected && (
            <div style={{
              marginBottom: '16px', padding: '12px', backgroundColor: '#fff3cd', borderRadius: '8px',
              border: '1px solid #ffc107', color: '#856404'
            }}>
              <strong>✓ Acceso configurado:</strong> {canDownload ? `Descarga permitida por ${expiration}` : `Sin descarga (${expiration})`}
            </div>
          )}

          {/* Sección de Búsqueda */}
          <div className="share-section">
            <label className="share-label">Añadir personas</label>
            <div className="search-recipient-wrapper">
              <input 
                type="text" 
                placeholder="Nombre, correo o número de teléfono..." 
                className="share-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn-primary-action">Añadir</button>
            </div>
          </div>

          {/* Configuración de Permisos */}
          <div className="share-section permissions-box">
            <div className="permission-row">
              <div className="permission-info">
                <span className="permission-title">Permitir descarga</span>
                <span className="permission-desc">El destinatario podrá guardar una copia local</span>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={canDownload} 
                  onChange={(e) => setCanDownload(e.target.checked)}
                  disabled={isProtected}
                />
                <span className="slider round"></span>
              </label>
            </div>

            {canDownload && (
              <div className="permission-row fade-in">
                <div className="permission-info">
                  <span className="permission-title">Duración del acceso a descarga</span>
                </div>
                <select 
                  className="share-select" 
                  value={expiration} 
                  onChange={(e) => setExpiration(e.target.value)}
                  disabled={isProtected}
                >
                  <option value="indefinido">Indefinido</option>
                  <option value="1h">1 hora</option>
                  <option value="1d">1 día</option>
                  <option value="7d">7 días</option>
                  <option value="30d">30 días</option>
                </select>
              </div>
            )}
            {isProtected && (
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
                * Los permisos están bloqueados por la seguridad del archivo protegido
              </p>
            )}
          </div>

          {/* Enlace para copiar */}
          <div className="share-section link-section">
            <label className="share-label">Enlace para compartir</label>
            <div className="link-copy-box">
              <input readOnly value={`http://localhost:5173/archivo/${item.id}`} />
              <button onClick={handleCopyLink}>Copiar</button>
            </div>
          </div>
        </div>

        <div className="share-footer">
          <button className="btn-secondary-outline" onClick={onClose}>Cancelar</button>
          <button className="btn-primary-action" onClick={onClose}>Listo</button>
        </div>
      </div>
    </div>
  );
};

export default CompartirModal;