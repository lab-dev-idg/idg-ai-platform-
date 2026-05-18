import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, AlertCircle } from 'lucide-react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useAdvancedMarkerRef 
} from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const LOGISTICS_HUBS = [
  { 
    name: 'بەندەری ئوم قەسر', 
    lat: 30.0381, 
    lng: 47.9261, 
    description: 'Umm Qasr Port',
    type: 'port'
  },
  { 
    name: 'دەروازەی ئیبراهیم خەلیل', 
    lat: 37.1594, 
    lng: 42.5639, 
    description: 'Ibrahim Khalil Border',
    type: 'border'
  },
  { 
    name: 'فڕۆکەخانەی هەولێر', 
    lat: 36.2369, 
    lng: 43.9592, 
    description: 'Erbil Airport',
    type: 'airport'
  },
];

const HUB_COLORS: Record<string, string> = {
  port: '#0ea5e9', // Blue
  border: '#f59e0b', // Amber
  airport: '#10b981', // Green
};

function HubMarker({ hub }: { hub: typeof LOGISTICS_HUBS[0] }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: hub.lat, lng: hub.lng }}
        onClick={() => setInfoWindowShown(true)}
        title={hub.name}
      >
        <Pin 
          background={HUB_COLORS[hub.type]} 
          borderColor="#fff" 
          glyphColor="#fff"
        />
      </AdvancedMarker>
      {infoWindowShown && (
        <InfoWindow
          anchor={marker}
          onCloseClick={() => setInfoWindowShown(false)}
        >
          <div className="p-2 text-slate-800">
            <h3 className="font-bold text-sm">{hub.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{hub.description}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export function LogisticsMap() {
  if (!hasValidKey) {
    return (
      <Card className="border-none shadow-md bg-white dark:bg-slate-800">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="text-lg flex items-center gap-2 text-primary">
            <MapPin className="w-5 h-5" />
            نەخشەی دەروازەکان
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-full">
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="font-bold text-sm">Google Maps API Key Required</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Open <b>Settings</b> (⚙️ gear icon) → <b>Secrets</b> → add <code>VITE_GOOGLE_MAPS_API_KEY</code>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-md bg-white dark:bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-700">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <MapPin className="w-5 h-5" />
          نەخشەی دەروازەکان
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden relative" style={{ height: '256px' }}>
        <APIProvider apiKey={API_KEY} version="weekly">
          <Map
            defaultCenter={{ lat: 33.3152, lng: 44.3661 }}
            defaultZoom={5}
            mapId="bf51a910020fa25a" // Demo Map ID
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
            gestureHandling="greedy"
            disableDefaultUI
          >
            {LOGISTICS_HUBS.map((hub) => (
              <HubMarker key={hub.name} hub={hub} />
            ))}
          </Map>
        </APIProvider>
      </CardContent>
    </Card>
  );
}
