'use client'

import { useMapEvents, CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

type Coordinates = { latitude: number; longitude: number }

function MapClickHandler({ onChange }: { onChange: (coordinates: Coordinates) => void }) {
  useMapEvents({
    click(event) {
      onChange({ latitude: event.latlng.lat, longitude: event.latlng.lng })
    },
  })
  return null
}

export default function DestinationPicker({ value, onChange }: { value: Coordinates | null; onChange: (coordinates: Coordinates) => void }) {
  const defaultPosition: [number, number] = [-6.4025, 106.7942]
  const selectedPosition: [number, number] | null = value ? [value.latitude, value.longitude] : null

  return (
    <MapContainer center={selectedPosition ?? defaultPosition} zoom={13} className="h-72 w-full rounded-lg">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onChange={onChange} />
      {selectedPosition && (
        <CircleMarker center={selectedPosition} radius={10} pathOptions={{ color: '#166534', fillColor: '#22c55e', fillOpacity: 1 }}>
          <Tooltip permanent direction="top">Tujuan pengantaran</Tooltip>
        </CircleMarker>
      )}
    </MapContainer>
  )
}
