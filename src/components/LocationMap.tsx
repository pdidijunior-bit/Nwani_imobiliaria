import React from "react";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { OFFICIAL_ADDRESS } from "../constants/config";

interface LocationMapProps {
  address?: string;
  latitude?: number;
  longitude?: number;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  address = OFFICIAL_ADDRESS.full,
  latitude = OFFICIAL_ADDRESS.latitude,
  longitude = OFFICIAL_ADDRESS.longitude,
}) => {
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <div id="location-map-container" className="rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 relative">
      {/* Visual map preview canvas */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-stone-900 overflow-hidden flex items-center justify-center">
        {/* Stylized dark map grid with topographic / architectural lines */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Street abstract patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#d97706" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="0" y1="65%" x2="100%" y2="55%" stroke="#d97706" strokeWidth="3" />
          <line x1="30%" y1="0" x2="35%" y2="100%" stroke="#d97706" strokeWidth="2" strokeDasharray="8 6" />
          <line x1="68%" y1="0" x2="62%" y2="100%" stroke="#d97706" strokeWidth="3" />
          <circle cx="50%" cy="50%" r="90" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4" fill="none" />
          <circle cx="50%" cy="50%" r="140" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.2" fill="none" />
        </svg>

        {/* Central Map Pin at Maianga, Luanda */}
        <div className="relative z-10 flex flex-col items-center animate-bounce">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <MapPin className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
          <div className="mt-2 px-3 py-1 rounded-full bg-stone-950/90 border border-amber-500/40 text-[11px] font-bold text-amber-300 shadow-md">
            Sede Nwani Imóveis
          </div>
        </div>

        {/* Coordinates badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-stone-950/80 backdrop-blur-md border border-stone-800 text-[11px] font-mono text-stone-300">
          Coordenadas: {latitude}, {longitude}
        </div>
      </div>

      {/* Map Details bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-stone-800/80 bg-stone-950">
        <div className="flex items-start gap-3">
          <Navigation className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-stone-200 block uppercase tracking-wider">Localização Oficial</span>
            <span className="text-sm text-stone-300">{address}</span>
            <span className="text-xs text-stone-400 block mt-0.5">Maianga • Luanda • Angola</span>
          </div>
        </div>

        <a
          id="btn-open-google-maps"
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all shadow-sm"
        >
          <span>Abrir no Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
