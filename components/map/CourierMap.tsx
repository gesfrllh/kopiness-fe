'use client'

import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

type CourierMapProps = {
  latitude: number
  longitude: number
  destination?: { latitude: number; longitude: number; address: string }
}

export default function CourierMap({ latitude, longitude, destination }: CourierMapProps) {
  const position: [number, number] = [latitude, longitude]
  const destinationPosition: [number, number] | undefined = destination
    ? [destination.latitude, destination.longitude]
    : undefined

  return (
    <MapContainer center={position} zoom={15} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker center={position} radius={10} pathOptions={{ color: '#5A2D0C', fillColor: '#BD6230', fillOpacity: 1 }}>
        <Tooltip permanent direction="top">Lokasi kurir</Tooltip>
      </CircleMarker>
      {destinationPosition && (
        <>
          <CircleMarker center={destinationPosition} radius={8} pathOptions={{ color: '#166534', fillColor: '#22c55e', fillOpacity: 1 }}>
            <Tooltip permanent direction="top">Tujuan: {destination!.address}</Tooltip>
          </CircleMarker>
          <Polyline positions={[position, destinationPosition]} pathOptions={{ color: '#BD6230', dashArray: '8 8' }} />
        </>
      )}
    </MapContainer>
  )
}
