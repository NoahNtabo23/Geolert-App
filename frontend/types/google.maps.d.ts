declare global {
  namespace google {
    namespace maps {
      class Map {
        constructor(element: HTMLElement, options?: any);
        setCenter(latLng: LatLng): void;
        setZoom(zoom: number): void;
      }

      class Marker {
        constructor(options: any);
        setMap(map: Map | null): void;
        setPosition(latLng: LatLng): void;

         addListener(event: string, handler: (...args: any[]) => void): void;
      }

      class LatLng {
        constructor(lat: number, lng: number);
        lat(): number;
        lng(): number;
      }

      class Size {
        constructor(width: number, height: number);
      }

      namespace visualization {
        class HeatmapLayer {
          constructor(options: any);
          setMap(map: Map | null): void;
          setData(data: any[]): void;
        }
      }

      namespace places {
        class Autocomplete {
          constructor(input: HTMLInputElement, opts?: any);
          addListener(event: string, handler: () => void): void;
          getPlace(): places.PlaceResult;
        }

        interface PlaceResult {
          formatted_address?: string;
          name?: string;
          geometry?: {
            location: {
              lat(): number;
              lng(): number;
            }
          };
        }
      }
    }
  }
}

export {};
