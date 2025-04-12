"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { IconMapPin } from "@tabler/icons-react";
import { ILocation } from "@/types/location";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

interface LocationMapProps {
  locations: ILocation[];
  selectedLocation: ILocation | null;
  onLocationSelect: (location: ILocation) => void;
}

export function LocationMap({
  locations,
  selectedLocation,
  onLocationSelect,
}: LocationMapProps) {
  const mapRef = React.useRef<L.Map>(null);

  // Center the map on the selected location or first location
  React.useEffect(() => {
    if (mapRef.current && (selectedLocation || locations.length > 0)) {
      const location = selectedLocation || locations[0];
      mapRef.current.setView([location.latitude, location.longitude], 13);
    }
  }, [selectedLocation, locations]);

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "100%", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={icon}
          eventHandlers={{
            click: () => onLocationSelect(location),
          }}
        >
          <Popup>
            <div className="space-y-1">
              <h3 className="font-semibold">{location.name}</h3>
              <p className="text-sm text-muted-foreground">
                {location.address}, {location.city}, {location.state}{" "}
                {location.postalCode}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    location.status === "active" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm capitalize">{location.status}</span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
