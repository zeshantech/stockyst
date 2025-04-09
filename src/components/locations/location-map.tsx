"use client";

import * as React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  LayerGroup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ILocation } from "@/types/location";
import * as iconsReact from "@tabler/icons-react";

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
    html: `<div class="bg-blue-500 text-white p-2 rounded-full shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  }),
  warehouse: L.divIcon({
    className: "custom-div-icon",
    html: `<div class="bg-green-500 text-white p-2 rounded-full shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  }),
  "distribution-center": L.divIcon({
    className: "custom-div-icon",
    html: `<div class="bg-purple-500 text-white p-2 rounded-full shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  }),
};

interface LocationMapProps {
  locations: ILocation[];
  selectedLocation?: ILocation | null;
  onLocationSelect?: (location: ILocation) => void;
  onMapClick?: (lat: number, lng: number) => void;
  isSelecting?: boolean;
  typeFilter?: string;
  statusFilter?: string;
  searchQuery?: string;
  isEditMode?: boolean;
  currentPosition?: { lat: number; lng: number } | null;
}

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

export function LocationMap({
  locations,
  selectedLocation,
  onLocationSelect,
  onMapClick,
  isSelecting = false,
  typeFilter = "all",
  statusFilter = "all",
  searchQuery = "",
  isEditMode = false,
  currentPosition = null,
}: LocationMapProps) {
  const [map, setMap] = React.useState<L.Map | null>(null);

  // Filter locations based on filters
  const filteredLocations = React.useMemo(() => {
    return locations.filter((location) => {
      const matchesType = typeFilter === "all" || location.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || location.status === statusFilter;
      const matchesSearch =
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [locations, typeFilter, statusFilter, searchQuery]);

  // Calculate bounds to fit all markers
  const bounds = React.useMemo(() => {
    const positions: [number, number][] = [];

    // Add existing locations
    filteredLocations.forEach((loc) => {
      positions.push([loc.latitude, loc.longitude]);
    });

    // Add selected location if exists
    if (selectedLocation) {
      positions.push([selectedLocation.latitude, selectedLocation.longitude]);
    }

    // Add current position if exists
    if (currentPosition) {
      positions.push([currentPosition.lat, currentPosition.lng]);
    }

    if (positions.length === 0) return null;
    return L.latLngBounds(positions);
  }, [filteredLocations, selectedLocation, currentPosition]);

  React.useEffect(() => {
    if (map && bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden relative">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        whenReady={() => setMap(map)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LayerGroup>
          {/* Show existing locations */}
          {filteredLocations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={locationIcons[location.type]}
              eventHandlers={{
                click: () => onLocationSelect?.(location),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[250px]">
                  <h3 className="font-bold text-lg">{location.name}</h3>
                  <p className="text-sm text-gray-600">{location.address}</p>
                  <p className="text-sm text-gray-600">
                    {location.city}, {location.state} {location.postalCode}
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold">Type:</span>{" "}
                      <span className="capitalize">
                        {location.type.replace("-", " ")}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          location.status === "active"
                            ? "bg-green-100 text-green-800"
                            : location.status === "inactive"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {location.status}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Capacity:</span>{" "}
                      {location.capacity}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Current Stock:</span>{" "}
                      {location.currentStock}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Manager:</span>{" "}
                      {location.manager}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Show selected location */}
          {selectedLocation && (
            <Marker
              position={[selectedLocation.latitude, selectedLocation.longitude]}
              icon={locationIcons[selectedLocation.type]}
            />
          )}

          {/* Show current position (for add/edit) */}
          {currentPosition && (
            <Marker
              position={[currentPosition.lat, currentPosition.lng]}
              icon={icon}
            />
          )}
        </LayerGroup>
        <MapController
          selectedLocation={selectedLocation}
          currentPosition={currentPosition}
        />
        <MapClickHandler onMapClick={onMapClick} isSelecting={isSelecting} />
      </MapContainer>
    </div>
  );
}
