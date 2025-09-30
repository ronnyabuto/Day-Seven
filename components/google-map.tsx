"use client"

import { useEffect, useRef } from "react"

interface GoogleMapProps {
  className?: string
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export function GoogleMap({ className = "" }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap()
        return
      }

      // Create the script element
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap`
      script.async = true
      script.defer = true

      // Define the callback function
      window.initMap = initializeMap

      document.head.appendChild(script)
    }

    const initializeMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return

      // Kilimani, Nairobi coordinates
      const kilimaniLocation = { lat: -1.2921, lng: 36.7853 }

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: kilimaniLocation,
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ color: "#f5f5f5" }],
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#666666" }],
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [{ color: "#e8e8e8" }],
          },
          {
            featureType: "road",
            elementType: "geometry.fill",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "poi",
            elementType: "geometry.fill",
            stylers: [{ color: "#f0f0f0" }],
          },
        ],
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      // Add a custom marker
      new window.google.maps.Marker({
        position: kilimaniLocation,
        map: map,
        title: "Day Seven - Kilimani",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#8B5A3C",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      })

      mapInstanceRef.current = map
    }

    loadGoogleMaps()

    return () => {
      // Cleanup
      if (window.initMap) {
        delete window.initMap
      }
    }
  }, [])

  return (
    <div className={`w-full h-full rounded-lg overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full min-h-[300px]" />
      <div className="absolute inset-0 bg-muted/20 flex items-center justify-center text-muted-foreground text-sm">
        <p>Loading map... (Add your Google Maps API key)</p>
      </div>
    </div>
  )
}
