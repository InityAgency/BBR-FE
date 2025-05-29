import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";

interface MapProps {
    latitude: number;
    longitude: number;
    address: string;
}

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

export default function Map({ latitude, longitude, address }: MapProps) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: ["places"] as const,
        language: "en",
    });

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div className="w-full h-[400px] bg-secondary animate-pulse rounded-lg" />;

    const center = {
        lat: latitude,
        lng: longitude,
    };

    return (
        <div className="w-full h-[400px] rounded-lg overflow-hidden">
            <GoogleMap
                mapContainerClassName="w-full h-full"
                center={center}
                zoom={15}
                options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                }}
            >
                <Marker
                    position={center}
                    title={address}
                />
            </GoogleMap>
        </div>
    );
} 