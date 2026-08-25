/* eslint-disable react-hooks/set-state-in-effect */
import { Crosshair, MapPin } from '@phosphor-icons/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import type {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  UseFormSetValue,
} from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PrimaryButton from '@/components/ui/button/primary-button';

const DEFAULT_CENTER = {
  lat: 33.5138,
  lng: 36.2765,
};

const DEFAULT_ZOOM = 13;
const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '320px',
};

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  'AIzaSyBsjM8ccRmrjWxaels9EsAEX5lIeoWbBEA';

type LocationPickerMapProps<T extends FieldValues> = {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  latitudeName: FieldPath<T>;
  longitudeName: FieldPath<T>;
  className?: string;
  readOnly?: boolean;
};

export default function LocationPickerMap<T extends FieldValues>({
  control,
  setValue,
  latitudeName,
  longitudeName,
  className,
  readOnly = false,
}: LocationPickerMapProps<T>) {
  const { t, i18n } = useTranslation(['clients', 'common']);
  const watchedLatitude = useWatch({ control, name: latitudeName });
  const watchedLongitude = useWatch({ control, name: longitudeName });
  const [resolvedCenter, setResolvedCenter] = useState(DEFAULT_CENTER);
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'client-location-picker-google-map',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    language: i18n.language === 'ar' ? 'ar' : 'en',
  });

  const selectedPosition = useMemo(() => {
    if (
      typeof watchedLatitude === 'number' &&
      !Number.isNaN(watchedLatitude) &&
      typeof watchedLongitude === 'number' &&
      !Number.isNaN(watchedLongitude)
    ) {
      return {
        lat: watchedLatitude,
        lng: watchedLongitude,
      };
    }

    return null;
  }, [watchedLatitude, watchedLongitude]);

  const updateCoords = useCallback(
    (coords: { lat: number; lng: number }) => {
      setValue(latitudeName, coords.lat as PathValue<T, FieldPath<T>>, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(longitudeName, coords.lng as PathValue<T, FieldPath<T>>, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setResolvedCenter(coords);
    },
    [latitudeName, longitudeName, setValue]
  );

  useEffect(() => {
    if (selectedPosition) {
      setResolvedCenter(selectedPosition);
      return;
    }

    if (readOnly) {
      setResolvedCenter(DEFAULT_CENTER);
      return;
    }

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setResolvedCenter(DEFAULT_CENTER);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        updateCoords(coords);
        setIsLocating(false);
      },
      () => {
        setResolvedCenter(DEFAULT_CENTER);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, [readOnly, selectedPosition, updateCoords]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    mapRef.current.panTo(resolvedCenter);
    if (!selectedPosition && !readOnly) {
      mapRef.current.setZoom(DEFAULT_ZOOM);
    }
  }, [isLoaded, readOnly, resolvedCenter, selectedPosition]);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      clickableIcons: false,
      disableDefaultUI: false,
      fullscreenControl: !readOnly,
      mapTypeControl: false,
      rotateControl: false,
      scaleControl: false,
      scrollwheel: !readOnly,
      streetViewControl: false,
      zoomControl: true,
      draggable: !readOnly,
      keyboardShortcuts: !readOnly,
      gestureHandling: readOnly ? 'none' : 'greedy',
    }),
    [readOnly]
  );

  const renderMapFallback = (message: string) => (
    <div className="flex h-[320px] w-full items-center justify-center bg-gray-light-100 px-4 text-center text-sm text-gray-light-800 dark:bg-dark-card-surface dark:text-gray-dark-300">
      {message}
    </div>
  );

  return (
    <div className={className}>
      {!readOnly ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-light-700 dark:text-gray-dark-500">
            <MapPin size={18} />
            <span>{t('click_map_to_select')}</span>
          </div>
          <PrimaryButton
            type="button"
            icon={<Crosshair size={12} weight="bold" />}
            IconSize={16}
            onClick={() => {
              if (typeof navigator === 'undefined' || !navigator.geolocation) {
                return;
              }

              setIsLocating(true);
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  updateCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  });
                  setIsLocating(false);
                },
                () => setIsLocating(false),
                {
                  enableHighAccuracy: true,
                  timeout: 10000,
                }
              );
            }}
            isSubmitting={isLocating}
            disabled={isLocating}
          >
            {t('use_current_location')}
          </PrimaryButton>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-gray-light-500 dark:border-dark-card-border">
        {!GOOGLE_MAPS_API_KEY || loadError ? (
          renderMapFallback(t('map_coming_soon'))
        ) : !isLoaded ? (
          renderMapFallback(t('loading'))
        ) : (
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={resolvedCenter}
            zoom={DEFAULT_ZOOM}
            options={mapOptions}
            onLoad={(map) => {
              mapRef.current = map;
            }}
            onUnmount={() => {
              mapRef.current = null;
            }}
            onClick={(event) => {
              if (readOnly) return;

              const lat = event.latLng?.lat();
              const lng = event.latLng?.lng();

              if (lat == null || lng == null) return;

              updateCoords({ lat, lng });
            }}
          >
            {selectedPosition ? <Marker position={selectedPosition} /> : null}
          </GoogleMap>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-light-500 px-4 py-3 dark:border-dark-card-border">
          <div className="text-xs text-gray-light-700 dark:text-gray-dark-500">
            {t('latitude')}
          </div>
          <div
            dir="ltr"
            className="mt-1 text-sm font-medium text-gray-light-900 dark:text-dark-primary"
          >
            {selectedPosition?.lat?.toFixed(6) ?? '-'}
          </div>
        </div>
        <div className="rounded-xl border border-gray-light-500 px-4 py-3 dark:border-dark-card-border">
          <div className="text-xs text-gray-light-700 dark:text-gray-dark-500">
            {t('longitude')}
          </div>
          <div
            dir="ltr"
            className="mt-1 text-sm font-medium text-gray-light-900 dark:text-dark-primary"
          >
            {selectedPosition?.lng?.toFixed(6) ?? '-'}
          </div>
        </div>
      </div>
    </div>
  );
}
