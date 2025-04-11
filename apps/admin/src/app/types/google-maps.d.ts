// Dodajte ovaj fajl u types/google-maps.d.ts

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element | null, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      getCenter(): LatLng;
      getZoom(): number;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setPosition(latLng: LatLng | LatLngLiteral): void;
      getPosition(): LatLng | null;
      setMap(map: Map | null): void;
      getMap(): Map | null;
      setTitle(title: string): void;
      setIcon(icon: string | Icon | Symbol): void;
      setDraggable(draggable: boolean): void;
      setAnimation(animation: Animation | null): void;
      setVisible(visible: boolean): void;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    class Geocoder {
      constructor();
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: GeocoderStatus) => void): void;
    }

    class LatLng {
      constructor(lat: number, lng: number, noWrap?: boolean);
      lat(): number;
      lng(): number;
      equals(other: LatLng): boolean;
      toString(): string;
      toUrlValue(precision?: number): string;
      toJSON(): LatLngLiteral;
    }

    class Size {
      constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
      equals(other: Size): boolean;
      width: number;
      height: number;
    }

    class Point {
      constructor(x: number, y: number);
      equals(other: Point): boolean;
      x: number;
      y: number;
    }

    namespace event {
      function addListener(instance: object, eventName: string, handler: Function): MapsEventListener;
      function addDomListener(instance: object, eventName: string, handler: Function, capture?: boolean): MapsEventListener;
      function clearInstanceListeners(instance: object): void;
      function removeListener(listener: MapsEventListener): void;
      function trigger(instance: any, eventName: string, ...args: any[]): void;
    }

    // Interfaces
    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string | MapTypeId;
      disableDefaultUI?: boolean;
      disableDoubleClickZoom?: boolean;
      draggable?: boolean;
      fullscreenControl?: boolean;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      zoomControl?: boolean;
      styles?: Array<MapTypeStyle>;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
      draggable?: boolean;
      animation?: Animation;
      visible?: boolean;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface Icon {
      url?: string;
      size?: Size;
      origin?: Point;
      anchor?: Point;
      scaledSize?: Size;
    }

    interface Symbol {
      path: SymbolPath | string;
      fillColor?: string;
      fillOpacity?: number;
      scale?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
    }

    interface GeocoderRequest {
      address?: string;
      location?: LatLng | LatLngLiteral;
      bounds?: LatLngBounds | LatLngBoundsLiteral;
      componentRestrictions?: GeocoderComponentRestrictions;
      region?: string;
      placeId?: string;
    }

    interface GeocoderComponentRestrictions {
      administrativeArea?: string;
      country?: string | string[];
      locality?: string;
      postalCode?: string;
      route?: string;
    }

    interface GeocoderResult {
      address_components: GeocoderAddressComponent[];
      formatted_address: string;
      geometry: GeocoderGeometry;
      place_id: string;
      plus_code?: { compound_code: string; global_code: string };
      types: string[];
      partial_match?: boolean;
      postcode_localities?: string[];
    }

    interface GeocoderAddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    interface GeocoderGeometry {
      location: LatLng;
      location_type?: GeocoderLocationType;
      viewport: LatLngBounds;
      bounds?: LatLngBounds;
    }

    interface LatLngBounds {
      contains(latLng: LatLng | LatLngLiteral): boolean;
      equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
      extend(point: LatLng | LatLngLiteral): LatLngBounds;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
      isEmpty(): boolean;
      toJSON(): LatLngBoundsLiteral;
      toSpan(): LatLng;
      toString(): string;
      toUrlValue(precision?: number): string;
      union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    interface MapTypeStyle {
      elementType?: MapTypeStyleElementType;
      featureType?: MapTypeStyleFeatureType;
      stylers: MapTypeStyler[];
    }

    interface MapsEventListener {
      remove(): void;
    }

    // Enums
    enum MapTypeId {
      HYBRID = "hybrid",
      ROADMAP = "roadmap",
      SATELLITE = "satellite",
      TERRAIN = "terrain"
    }

    enum SymbolPath {
      BACKWARD_CLOSED_ARROW = 3,
      BACKWARD_OPEN_ARROW = 4,
      CIRCLE = 0,
      FORWARD_CLOSED_ARROW = 1,
      FORWARD_OPEN_ARROW = 2
    }

    enum Animation {
      BOUNCE = 1,
      DROP = 2
    }

    type GeocoderLocationType = "APPROXIMATE" | "GEOMETRIC_CENTER" | "RANGE_INTERPOLATED" | "ROOFTOP";
    type GeocoderStatus = "ERROR" | "INVALID_REQUEST" | "OK" | "OVER_QUERY_LIMIT" | "REQUEST_DENIED" | "UNKNOWN_ERROR" | "ZERO_RESULTS";
    type MapTypeStyleFeatureType = "administrative" | "administrative.country" | "administrative.land_parcel" | "administrative.locality" | "administrative.neighborhood" | "administrative.province" | "all" | "landscape" | "landscape.man_made" | "landscape.natural" | "landscape.natural.landcover" | "landscape.natural.terrain" | "poi" | "poi.attraction" | "poi.business" | "poi.government" | "poi.medical" | "poi.park" | "poi.place_of_worship" | "poi.school" | "poi.sports_complex" | "road" | "road.arterial" | "road.highway" | "road.highway.controlled_access" | "road.local" | "transit" | "transit.line" | "transit.station" | "transit.station.airport" | "transit.station.bus" | "transit.station.rail" | "water";
    type MapTypeStyleElementType = "all" | "geometry" | "geometry.fill" | "geometry.stroke" | "labels" | "labels.icon" | "labels.text" | "labels.text.fill" | "labels.text.stroke";
    
    interface MapTypeStyler {
      color?: string;
      gamma?: number;
      hue?: string;
      invert_lightness?: boolean;
      lightness?: number;
      saturation?: number;
      visibility?: string;
      weight?: number;
    }
  }
}

// Deklaracija za @googlemaps/js-api-loader
declare module '@googlemaps/js-api-loader' {
  export interface LoaderOptions {
    apiKey: string;
    version?: string;
    libraries?: string[];
    language?: string;
    region?: string;
    retries?: number;
    mapIds?: string[];
    nonce?: string;
    authReferrerPolicy?: string;
    id?: string;
  }

  export class Loader {
    constructor(options: LoaderOptions);
    load(): Promise<typeof google>;
    loadCallback(fn: (e: Error | null) => void): void;
  }
}