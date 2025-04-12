"use client";

import * as React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ILocation } from "@/types/location";

// Fix for default marker icons in Leaflet
const icon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom icons for different location types
const locationIcons = {
  store: L.divIcon({
    className: "custom-div-icon",
    html: `<div class="bg-blue-500 text-white p-2 rounded-full shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  }),
  warehouse: L.divIcon({
    className: "custom-div-icon",
    html: `<div class="bg-green-500 text-white p-2 rounded-full shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  }),
  "distribution-center": L.divIcon({
    className: "custom-div-icon",
    html: `<div class="bg-purple-500 text-white p-2 rounded-full shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  }),
};

// MapController to center map on location
function MapController({
  selectedLocation,
  currentPosition,
}: {
  selectedLocation?: ILocation | null;
  currentPosition?: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  React.useEffect(() => {
    if (selectedLocation) {
      map.setView([selectedLocation.latitude, selectedLocation.longitude], 15);
    } else if (currentPosition) {
      map.setView([currentPosition.lat, currentPosition.lng], 15);
    }
  }, [selectedLocation, currentPosition, map]);

  return null;
}

// MapClickHandler to handle map click events
function MapClickHandler({
  onMapClick,
  isSelecting,
}: {
  onMapClick?: (lat: number, lng: number) => void;
  isSelecting?: boolean;
}) {
  useMapEvents({
    click: (e) => {
      if (isSelecting && onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
}

interface LocationPickerMapProps {
  location?: ILocation | null;
  onLocationSelect?: (location: ILocation) => void;
  onMapClick?: (lat: number, lng: number) => void;
  isSelecting?: boolean;
  currentPosition?: { lat: number; lng: number } | null;
  locationType?: string;
  isPicker?: boolean;
}

export function LocationPickerMap({
  location,
  onLocationSelect,
  onMapClick,
  isSelecting = false,
  currentPosition = null,
  locationType = "warehouse",
  isPicker = false,
}: LocationPickerMapProps) {
  // For editing mode always allow selection
  const allowSelection = isSelecting || isPicker;

  // Set initial marker position using location or currentPosition
  const initialPosition = React.useMemo(() => {
    if (currentPosition) {
      return [currentPosition.lat, currentPosition.lng];
    } else if (location) {
      return [location.latitude, location.longitude];
    } else {
      return [0, 0]; // Default position if no location specified
    }
  }, [currentPosition, location]);

  // State to track draggable marker position
  const [markerPosition, setMarkerPosition] = React.useState<[number, number]>(
    initialPosition as [number, number]
  );

  // Update marker position when props change
  React.useEffect(() => {
    setMarkerPosition(initialPosition as [number, number]);
  }, [initialPosition]);

  // Handle marker drag end
  const handleMarkerDragEnd = (e: L.DragEndEvent) => {
    const marker = e.target;
    const position = marker.getLatLng();
    setMarkerPosition([position.lat, position.lng]);

    if (onMapClick) {
      onMapClick(position.lat, position.lng);
    }
  };

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden relative">
      <MapContainer
        center={initialPosition as [number, number]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Show the existing location if provided and not in picker mode */}
        {location && !allowSelection && (
          <Marker
            position={[location.latitude, location.longitude]}
            icon={locationIcons[location.type] || icon}
          >
            {onLocationSelect && (
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-lg">{location.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {location.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {location.city}, {location.state} {location.postalCode}
                  </p>
                </div>
              </Popup>
            )}
          </Marker>
        )}

        {/* Draggable marker for selection mode */}
        {allowSelection && (
          <Marker
            position={markerPosition}
            draggable={true}
            eventHandlers={{
              dragend: handleMarkerDragEnd,
            }}
            icon={
              locationIcons[locationType as keyof typeof locationIcons] || icon
            }
          >
            <Popup>
              <div className="p-2">
                <p className="text-sm font-medium">Drag to adjust position</p>
                <p className="text-xs text-gray-500">
                  Latitude: {markerPosition[0].toFixed(6)}
                  <br />
                  Longitude: {markerPosition[1].toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Controllers */}
        <MapController
          selectedLocation={location}
          currentPosition={currentPosition}
        />
        <MapClickHandler onMapClick={onMapClick} isSelecting={allowSelection} />
      </MapContainer>

      {allowSelection && (
        <div className="absolute bottom-4 left-4 right-4 bg-background p-4 rounded z-[1000] text-sm">
          Click on the map to select a location or drag the marker to reposition
        </div>
      )}
    </div>
  );
}
