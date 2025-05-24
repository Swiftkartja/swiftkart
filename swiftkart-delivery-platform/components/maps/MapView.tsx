import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Platform, Image, Dimensions, ActivityIndicator } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import { MapMarker, Route } from '@/types';
import { MapPin, Navigation } from 'lucide-react-native';
import * as Location from 'expo-location';
import WebView from 'react-native-webview';

interface MapViewProps {
  markers?: MapMarker[];
  route?: Route;
  showUserLocation?: boolean;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  style?: any;
  onMarkerPress?: (marker: MapMarker) => void;
  onMapReady?: () => void;
  interactive?: boolean;
}

// Import environment configuration
import ENV from '@/config/env';

// Google Maps API Key from environment variables
const GOOGLE_MAPS_API_KEY = ENV.GOOGLE_MAPS_API_KEY;

export const MapView: React.FC<MapViewProps> = ({
  markers = [],
  route,
  showUserLocation = true,
  initialRegion,
  style,
  onMarkerPress,
  onMapReady,
  interactive = true,
}) => {
  const { colors } = useThemeStore();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get user location
  useEffect(() => {
    if (showUserLocation) {
      (async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setError('Permission to access location was denied');
            setIsLoading(false);
            return;
          }
          
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } catch (err) {
          console.error('Error getting location:', err);
          setError('Could not get your location');
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setIsLoading(false);
    }
  }, [showUserLocation]);
  
  // For web, we'll use a static map or an iframe with Google Maps
  if (Platform.OS === 'web') {
    // If we have markers or a route, create a static Google Maps URL
    if ((markers && markers.length > 0) || route) {
      let mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x400&key=${GOOGLE_MAPS_API_KEY}`;
      
      // Add markers
      markers.forEach((marker, index) => {
        const color = getMarkerColorForUrl(marker.type);
        mapUrl += `&markers=color:${color}|label:${index + 1}|${marker.coordinate.latitude},${marker.coordinate.longitude}`;
      });
      
      // Add user location if available
      if (showUserLocation && userLocation) {
        mapUrl += `&markers=color:blue|label:U|${userLocation.latitude},${userLocation.longitude}`;
      }
      
      // Add route if available
      if (route) {
        mapUrl += `&path=color:0x0000ff|weight:5|${route.origin.latitude},${route.origin.longitude}|${route.destination.latitude},${route.destination.longitude}`;
      }
      
      // Set center if initialRegion is provided
      if (initialRegion) {
        mapUrl += `&center=${initialRegion.latitude},${initialRegion.longitude}`;
        mapUrl += `&zoom=14`;
      }
      
      return (
        <View style={[styles.container, style, { backgroundColor: colors.subtle }]}>
          <Image
            source={{ uri: mapUrl }}
            style={styles.staticMapImage}
            resizeMode="cover"
            onLoad={() => onMapReady && onMapReady()}
          />
          {route && (
            <View style={styles.routeInfoWeb}>
              <Text style={[styles.routeText, { color: colors.text, backgroundColor: colors.card + 'E6' }]}>
                {route.distance ? `Distance: ${route.distance} km` : 'Distance: Calculating...'}
                {route.duration ? ` • Duration: ${route.duration} min` : ''}
              </Text>
            </View>
          )}
        </View>
      );
    }
    
    // Fallback to a placeholder
    return (
      <View style={[styles.container, style, { backgroundColor: colors.subtle }]}>
        <View style={styles.staticMapContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
            style={styles.staticMapImage}
            resizeMode="cover"
          />
          <View style={styles.staticMapOverlay}>
            <Text style={styles.staticMapText}>
              Interactive map will be available in the mobile app
            </Text>
          </View>
        </View>
      </View>
    );
  }
  
  // For mobile, we'll use a WebView with Google Maps
  if (interactive && GOOGLE_MAPS_API_KEY) {
    // Create a center point for the map
    let center = initialRegion 
      ? { lat: initialRegion.latitude, lng: initialRegion.longitude }
      : userLocation 
        ? { lat: userLocation.latitude, lng: userLocation.longitude }
        : markers.length > 0 
          ? { lat: markers[0].coordinate.latitude, lng: markers[0].coordinate.longitude }
          : { lat: 18.0179, lng: -76.8099 }; // Default to Jamaica
    
    // Create HTML for the map
    const mapHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <style>
            body, html, #map {
              height: 100%;
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            let map;
            let markers = [];
            let directionsService;
            let directionsRenderer;
            
            function initMap() {
              map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: ${center.lat}, lng: ${center.lng} },
                zoom: 14,
                disableDefaultUI: true,
                zoomControl: true
              });
              
              directionsService = new google.maps.DirectionsService();
              directionsRenderer = new google.maps.DirectionsRenderer({
                map: map,
                suppressMarkers: true
              });
              
              // Add markers
              ${markers.map((marker, index) => `
                const marker${index} = new google.maps.Marker({
                  position: { lat: ${marker.coordinate.latitude}, lng: ${marker.coordinate.longitude} },
                  map: map,
                  title: "${marker.title}",
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: "${getMarkerColor(marker.type)}",
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: "#FFFFFF",
                    scale: 10
                  }
                });
                
                const infowindow${index} = new google.maps.InfoWindow({
                  content: "<div><strong>${marker.title}</strong>${marker.description ? '<br>' + marker.description : ''}</div>"
                });
                
                marker${index}.addListener('click', function() {
                  infowindow${index}.open(map, marker${index});
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'markerPress',
                    markerId: "${marker.id}"
                  }));
                });
                
                markers.push(marker${index});
              `).join('')}
              
              // Add user location if available
              ${showUserLocation && userLocation ? `
                const userMarker = new google.maps.Marker({
                  position: { lat: ${userLocation.latitude}, lng: ${userLocation.longitude} },
                  map: map,
                  title: "Your Location",
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: "#4285F4",
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: "#FFFFFF",
                    scale: 10
                  }
                });
              ` : ''}
              
              // Add route if available
              ${route ? `
                const request = {
                  origin: { lat: ${route.origin.latitude}, lng: ${route.origin.longitude} },
                  destination: { lat: ${route.destination.latitude}, lng: ${route.destination.longitude} },
                  travelMode: google.maps.TravelMode.DRIVING
                };
                
                directionsService.route(request, function(result, status) {
                  if (status === 'OK') {
                    directionsRenderer.setDirections(result);
                    
                    // Calculate and display route info
                    const route = result.routes[0];
                    let distance = 0;
                    let duration = 0;
                    
                    for (let i = 0; i < route.legs.length; i++) {
                      distance += route.legs[i].distance.value;
                      duration += route.legs[i].duration.value;
                    }
                    
                    // Convert to km and minutes
                    distance = (distance / 1000).toFixed(1);
                    duration = Math.round(duration / 60);
                    
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'routeInfo',
                      distance: distance,
                      duration: duration
                    }));
                  }
                });
              ` : ''}
              
              // Notify React Native that the map is ready
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'mapReady'
              }));
            }
          </script>
          <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap" async defer></script>
        </body>
      </html>
    `;
    
    // Handle messages from the WebView
    const handleMessage = (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        
        if (data.type === 'mapReady' && onMapReady) {
          onMapReady();
        } else if (data.type === 'markerPress' && onMarkerPress) {
          const marker = markers.find(m => m.id === data.markerId);
          if (marker) {
            onMarkerPress(marker);
          }
        } else if (data.type === 'routeInfo' && route) {
          // Update route info if needed
          console.log('Route info:', data);
        }
      } catch (error) {
        console.error('Error parsing WebView message:', error);
      }
    };
    
    return (
      <View style={[styles.container, style]}>
        {isLoading ? (
          <View style={[styles.loadingContainer, { backgroundColor: colors.subtle }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>Loading map...</Text>
          </View>
        ) : error ? (
          <View style={[styles.errorContainer, { backgroundColor: colors.subtle }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        ) : (
          <WebView
            source={{ html: mapHTML }}
            style={styles.webview}
            onMessage={handleMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={[styles.loadingContainer, { backgroundColor: colors.subtle }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.text }]}>Loading map...</Text>
              </View>
            )}
          />
        )}
        
        {route && (
          <View style={styles.routeInfo}>
            <Text style={[styles.routeInfoText, { color: colors.text, backgroundColor: colors.card + 'E6' }]}>
              {route.distance ? `Distance: ${route.distance} km` : 'Distance: Calculating...'}
              {route.duration ? ` • Duration: ${route.duration} min` : ''}
            </Text>
          </View>
        )}
      </View>
    );
  }
  
  // Fallback to a placeholder map for mobile
  return (
    <View style={[styles.container, style, { backgroundColor: colors.subtle }]}>
      <View style={styles.mapPlaceholder}>
        <Navigation size={48} color={colors.primary} />
        <Text style={[styles.placeholderTitle, { color: colors.text }]}>
          Map View
        </Text>
        <Text style={[styles.placeholderText, { color: colors.muted }]}>
          Google Maps will be integrated here
        </Text>
        
        {markers.length > 0 && (
          <View style={styles.markersInfo}>
            <Text style={[styles.markersTitle, { color: colors.text }]}>
              Map Markers:
            </Text>
            {markers.map((marker, index) => (
              <View key={marker.id} style={styles.markerItem}>
                <MapPin size={16} color={getMarkerColor(marker.type, colors)} />
                <Text style={[styles.markerText, { color: colors.text }]}>
                  {marker.title}
                </Text>
              </View>
            ))}
          </View>
        )}
        
        {route && (
          <View style={styles.routeInfo}>
            <Text style={[styles.routeTitle, { color: colors.text }]}>
              Route Information:
            </Text>
            <Text style={[styles.routeText, { color: colors.muted }]}>
              {route.distance ? `Distance: ${route.distance} km` : 'Distance: Calculating...'}
            </Text>
            <Text style={[styles.routeText, { color: colors.muted }]}>
              {route.duration ? `Duration: ${route.duration} min` : 'Duration: Calculating...'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

// Helper function to get marker color based on type
const getMarkerColor = (type: string, colors?: any): string => {
  if (colors) {
    switch (type) {
      case 'pickup':
        return colors.success;
      case 'dropoff':
        return colors.error;
      case 'rider':
        return colors.primary;
      case 'vendor':
        return colors.warning;
      case 'customer':
        return colors.info;
      default:
        return colors.muted;
    }
  } else {
    // Default colors for Google Maps
    switch (type) {
      case 'pickup':
        return '#4CAF50'; // Green
      case 'dropoff':
        return '#F44336'; // Red
      case 'rider':
        return '#2196F3'; // Blue
      case 'vendor':
        return '#FF9800'; // Orange
      case 'customer':
        return '#9C27B0'; // Purple
      default:
        return '#757575'; // Grey
    }
  }
};

// Helper function to get marker color for URL
const getMarkerColorForUrl = (type: string): string => {
  switch (type) {
    case 'pickup':
      return 'green';
    case 'dropoff':
      return 'red';
    case 'rider':
      return 'blue';
    case 'vendor':
      return 'orange';
    case 'customer':
      return 'purple';
    default:
      return 'gray';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'center',
  },
  markersInfo: {
    marginTop: 24,
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 300,
  },
  markersTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  markerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  markerText: {
    fontSize: 14,
    marginLeft: 8,
  },
  routeInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 8,
    padding: 8,
  },
  routeInfoWeb: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  routeText: {
    fontSize: 14,
    marginBottom: 4,
  },
  routeInfoText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  staticMapContainer: {
    flex: 1,
    position: 'relative',
  },
  staticMapImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  staticMapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  staticMapText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});