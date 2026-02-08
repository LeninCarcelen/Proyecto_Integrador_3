import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMapEvents
} from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-rotate';

import amarillo from '../assets/amarillo.jpg';
import azul from '../assets/azul.jpg';
import verde from '../assets/verde.jpg';
import rojo from '../assets/rojo.jpg';

function ClickAlerta({ enabled, onConfirm }) {
  useMapEvents({
    click(e) {
      if (!enabled) return;

      const aceptar = window.confirm(
        '¿Desea registrar una alerta de limpieza en este punto?'
      );

      if (aceptar) {
        onConfirm(e.latlng);
      }
    }
  });
  return null;
}

function ClickContenedor({ enabled, tipo, onAdd }) {
  useMapEvents({
    click(e) {
      if (!enabled || !tipo) return;

      onAdd(e.latlng);
    }
  });
  return null;
}

function Mapa({ rol, tipoSeleccionado, ubicaciones = [], alertas = [] }) {
  const mapRef = useRef(null);
  const isAdmin = rol === 'admin';

  const centerPUCE = [-0.209918, -78.490692];

  const campusPolygon = [
    [-0.210314, -78.493558],
    [-0.210731, -78.493552],
    [-0.211404, -78.492892],
    [-0.210809, -78.49235],
    [-0.211044, -78.490714],
    [-0.209481, -78.490255],
    [-0.208604, -78.489006],
    [-0.20814, -78.49022],
  ];

  const iconBase = {
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  };

  const iconos = {
    amarillo: new L.Icon({ iconUrl: amarillo, ...iconBase }),
    azul: new L.Icon({ iconUrl: azul, ...iconBase }),
    verde: new L.Icon({ iconUrl: verde, ...iconBase })
  };

  const alertaIcon = new L.Icon({
    iconUrl: rojo,
    ...iconBase
  });

  const [contenedores, setContenedores] = useState([]);

  const cargarContenedores = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/contenedores');
      const data = await response.json();
      console.log(' Contenedores cargados:', data.data?.length);
      setContenedores(data.data || []);
    } catch (err) {
      console.error('Error cargando contenedores:', err);
    }
  };

  useEffect(() => {
    cargarContenedores();
    const interval = setInterval(cargarContenedores, 30000);
    return () => clearInterval(interval);
  }, []);

  const agregarContenedor = async (latlng) => {
    try {
      const idUsuario = localStorage.getItem('id_usuario');
      
      console.log(' Creando contenedor:', { idUsuario, tipo: tipoSeleccionado, latlng });

      const response = await fetch('http://localhost:3000/api/contenedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: parseInt(idUsuario),
          tipo: tipoSeleccionado,
          latitud: latlng.lat,
          longitud: latlng.lng
        })
      });

      const data = await response.json();

      console.log(' Respuesta contenedor:', data);

      if (data.success) {
        alert(' Contenedor creado');
        cargarContenedores();
      } else {
        alert(' Error: ' + data.error);
      }
    } catch (err) {
      console.error(' Error:', err);
      alert(' Error: ' + err.message);
    }
  };

  const crearAlertaAPI = async (latlng) => {
    try {
      const idUsuario = localStorage.getItem('id_usuario');
      
      console.log(' Creando alerta desde mapa:', { idUsuario, latlng });

      const response = await fetch('http://localhost:3000/api/alertas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: parseInt(idUsuario),
          latitud: latlng.lat,
          longitud: latlng.lng,
          tipo: 'basura',
          descripcion: `Alerta en ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`
        })
      });

      const data = await response.json();

      console.log(' Respuesta alerta:', data);

      if (data.success) {
        alert(' Alerta creada exitosamente');
        
        setTimeout(() => {
          window.location.reload();
        }, 500);
        
      } else {
        alert(' Error: ' + data.error);
      }
    } catch (err) {
      console.error(' Error:', err);
      alert(' Error: ' + err.message);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 200);
  }, []);

  const alertasActivas = (alertas || []).filter(a => a.estado !== 'resuelta');

  return (
    <div className="map-wrapper">
      <MapContainer
        center={centerPUCE}
        zoom={18}
        minZoom={17}
        maxZoom={18}
        dragging={true}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        maxBounds={campusPolygon}
        maxBoundsViscosity={1.0}
        bearing={30}
        rotate={true}
        touchRotate={false}
        style={{ height: '100%', width: '100%' }}
        whenCreated={map => {
          mapRef.current = map;
          map.setBearing(-30);
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <ClickAlerta
          enabled={!isAdmin}
          onConfirm={crearAlertaAPI}
        />

        <ClickContenedor
          enabled={isAdmin}
          tipo={tipoSeleccionado}
          onAdd={agregarContenedor}
        />

        <Polygon
          positions={campusPolygon}
          pathOptions={{
            color: 'red',
            weight: 2,
            fillOpacity: 0.05
          }}
        />

        {contenedores && contenedores.length > 0 && contenedores.map(c => (
          <Marker
            key={c.id_contenedor}
            position={[parseFloat(c.latitud), parseFloat(c.longitud)]}
            icon={iconos[c.tipo]}
          >
            <Popup>Contenedor {c.tipo}</Popup>
          </Marker>
        ))}

        {ubicaciones && ubicaciones.length > 0 && ubicaciones.map(ub => (
          <Marker 
            key={ub._id} 
            position={[parseFloat(ub.latitud), parseFloat(ub.longitud)]} 
            icon={iconos[ub.tipo]}
          >
            <Popup>
              <strong>{ub.nombre}</strong>
              <br />
              Estado: {ub.estado}
              <br />
              Capacidad: {ub.capacidad_actual}/{ub.capacidad_total}
            </Popup>
          </Marker>
        ))}

        {alertasActivas && alertasActivas.length > 0 && alertasActivas.map(a => {
          const lat = a.latitud || (a.coordenadas && a.coordenadas.latitud);
          const lng = a.longitud || (a.coordenadas && a.coordenadas.longitud);
          
          if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
            console.warn(' Alerta sin coordenadas válidas:', a);
            return null;
          }
          
          return (
            <Marker 
              key={a._id} 
              position={[parseFloat(lat), parseFloat(lng)]} 
              icon={alertaIcon}
            >
              <Popup>
                <strong> Alerta</strong>
                <br />
                Tipo: {a.tipo_alerta || 'N/A'}
                <br />
                Urgencia: {a.urgencia || 'media'}
                <br />
                Estado: {a.estado || 'pendiente'}
                <br />
                {a.descripcion && (
                  <>
                    Descripción: {a.descripcion}
                  </>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}


export default Mapa;
