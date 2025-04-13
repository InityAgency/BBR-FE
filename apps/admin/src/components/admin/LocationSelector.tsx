import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

type Libraries = ("places" | "drawing" | "geometry" | "localContext" | "visualization")[];
const libraries: Libraries = ["places"];

interface LocationSelectorProps {
  value: {
    address: string;
    latitude: string;
    longitude: string;
  };
  onChange: (location: { address: string; latitude: string; longitude: string }) => void;
  error?: string;
}

export default function LocationSelector({ value, onChange, error }: LocationSelectorProps) {
  const [address, setAddress] = useState(value.address || "");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: parseFloat(value.latitude) || 44.787197,
    lng: parseFloat(value.longitude) || 20.457273,
  });
  
  const inputRef = useRef<HTMLInputElement>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
    language: "en",
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Initialize Autocomplete on component load
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;
    
    // Use Autocomplete instead of PlaceAutocompleteElement
    const autocompleteInstance = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ["address_components", "formatted_address", "geometry", "name"],
    });
    
    setAutocomplete(autocompleteInstance);
    
    // Prevent form submission on Enter key
    inputRef.current.addEventListener("keydown", (e) => {
      if (e.key === "Enter") e.preventDefault();
    });
    
    return () => {
      if (autocompleteInstance) {
        google.maps.event.clearInstanceListeners(autocompleteInstance);
      }
    };
  }, [isLoaded]);

  // Add place_changed event listener to autocomplete
  useEffect(() => {
    if (!autocomplete) return;
    
    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      
      if (!place.geometry || !place.geometry.location) {
        console.error("Autocomplete's returned place contains no geometry");
        return;
      }
      
      const newAddress = place.formatted_address || "";
      setAddress(newAddress);
      
      const newPosition = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      
      setMarkers([newPosition]);
      setCenter(newPosition);
      
      onChange({
        address: newAddress,
        latitude: newPosition.lat.toString(),
        longitude: newPosition.lng.toString(),
      });
      
      if (map) {
        map.setCenter(place.geometry.location);
        map.setZoom(16);
      }
    });
    
    return () => {
      if (listener) {
        google.maps.event.removeListener(listener);
      }
    };
  }, [autocomplete, map, onChange]);

  // Rest of your code remains unchanged
  useEffect(() => {
    if (value.latitude && value.longitude) {
      const lat = parseFloat(value.latitude);
      const lng = parseFloat(value.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMarkers([{ lat, lng }]);
        setCenter({ lat, lng });
      }
    }
  }, [value.latitude, value.longitude]);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      const clickedPos = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };

      setMarkers([clickedPos]);
      setCenter(clickedPos);

      if (isLoaded && google.maps.Geocoder) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: clickedPos }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const newAddress = results[0].formatted_address;
            setAddress(newAddress);
            onChange({
              address: newAddress,
              latitude: clickedPos.lat.toString(),
              longitude: clickedPos.lng.toString(),
            });
          } else {
            console.error("Geocoder failed due to: " + status);
          }
        });
      }
    },
    [onChange, isLoaded]
  );

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <Skeleton className="w-full h-64 rounded-md" />;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          ref={inputRef}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
          className="pr-10"
        />
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="h-64 rounded-md overflow-hidden">
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={center}
          zoom={15}
          onLoad={onMapLoad}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              draggable={true}
              onDragEnd={(e) => {
                if (!e.latLng) return;
                
                const newPos = {
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                };
                
                setMarkers([newPos]);
                
                if (isLoaded && google.maps.Geocoder) {
                  const geocoder = new google.maps.Geocoder();
                  geocoder.geocode({ location: newPos }, (results, status) => {
                    if (status === "OK" && results && results[0]) {
                      const newAddress = results[0].formatted_address;
                      setAddress(newAddress);
                      onChange({
                        address: newAddress,
                        latitude: newPos.lat.toString(),
                        longitude: newPos.lng.toString(),
                      });
                    }
                  });
                }
              }}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}