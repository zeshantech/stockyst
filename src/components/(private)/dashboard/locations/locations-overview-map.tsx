"use client";

import * as React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  LayerGroup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ILocation } from "@/types/location";

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

// Default icon fallback
const defaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapControllerProps {
  selectedLocation?: ILocation | null;
}

function MapController({ selectedLocation }: MapControllerProps) {
  const map = useMap();

  React.useEffect(() => {
    if (selectedLocation) {
      map.setView([selectedLocation.latitude, selectedLocation.longitude], 15);
    } else if (map) {
      // Auto-fit to show all markers if no selection
      const bounds = new L.LatLngBounds([]);
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          bounds.extend(layer.getLatLng());
        }
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [selectedLocation, map]);

  return null;
}

interface LocationsOverviewMapProps {
  locations: ILocation[];
  selectedLocation?: ILocation | null;
  onLocationSelect: (location: ILocation) => void;
  typeFilter?: string;
  statusFilter?: string;
  searchQuery?: string;
}

export function LocationsOverviewMap({
  locations,
  selectedLocation,
  onLocationSelect,
  typeFilter = "all",
  statusFilter = "all",
  searchQuery = "",
}: LocationsOverviewMapProps) {
  // Filter locations based on filters
  const filteredLocations = React.useMemo(() => {
    return locations.filter((location) => {
      const matchesType = typeFilter === "all" || location.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || location.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [locations, typeFilter, statusFilter, searchQuery]);

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden relative">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LayerGroup>
          {filteredLocations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={locationIcons[location.type] || defaultIcon}
              eventHandlers={{
                click: () => onLocationSelect(location),
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
        </LayerGroup>
        <MapController selectedLocation={selectedLocation} />
      </MapContainer>
    </div>
  );
}
