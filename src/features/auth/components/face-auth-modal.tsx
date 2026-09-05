import { useEffect, useRef, useState } from 'react';
import { Camera, UserFocus } from '@phosphor-icons/react';
import Modal from '@/components/ui/dialog';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';

type FaceAuthModalProps = {
  open: boolean;
  title: string;
  description: string;
  captureText: string;
  cancelText: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onCapture: (faceDescriptor: number[]) => void;
};

type DetectedFace = {
  boundingBox: DOMRectReadOnly;
};

type FaceDetectorInstance = {
  detect: (source: CanvasImageSource) => Promise<DetectedFace[]>;
};

type FaceDetectorConstructor = new (options?: {
  fastMode?: boolean;
  maxDetectedFaces?: number;
}) => FaceDetectorInstance;

declare global {
  interface Window {
    FaceDetector?: FaceDetectorConstructor;
  }
}

const DESCRIPTOR_WIDTH = 16;
const DESCRIPTOR_HEIGHT = 8;

const getVideoDescriptor = async (video: HTMLVideoElement) => {
  const width = video.videoWidth;
  const height = video.videoHeight;
  if (!width || !height) return [];

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return [];

  context.drawImage(video, 0, 0, width, height);

  let crop = {
    x: Math.floor(width * 0.25),
    y: Math.floor(height * 0.15),
    width: Math.floor(width * 0.5),
    height: Math.floor(height * 0.7),
  };

  if (window.FaceDetector) {
    const detector = new window.FaceDetector({
      fastMode: true,
      maxDetectedFaces: 1,
    });
    const [face] = await detector.detect(canvas);
    if (face) {
      crop = {
        x: Math.max(0, Math.floor(face.boundingBox.x)),
        y: Math.max(0, Math.floor(face.boundingBox.y)),
        width: Math.min(width, Math.floor(face.boundingBox.width)),
        height: Math.min(height, Math.floor(face.boundingBox.height)),
      };
    }
  }

  const descriptorCanvas = document.createElement('canvas');
  descriptorCanvas.width = DESCRIPTOR_WIDTH;
  descriptorCanvas.height = DESCRIPTOR_HEIGHT;
  const descriptorContext = descriptorCanvas.getContext('2d', {
    willReadFrequently: true,
  });
  if (!descriptorContext) return [];

  descriptorContext.drawImage(
    canvas,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    DESCRIPTOR_WIDTH,
    DESCRIPTOR_HEIGHT
  );

  const pixels = descriptorContext.getImageData(
    0,
    0,
    DESCRIPTOR_WIDTH,
    DESCRIPTOR_HEIGHT
  ).data;

  return Array.from({ length: DESCRIPTOR_WIDTH * DESCRIPTOR_HEIGHT }, (_, index) => {
    const offset = index * 4;
    const gray =
      pixels[offset] * 0.299 +
      pixels[offset + 1] * 0.587 +
      pixels[offset + 2] * 0.114;
    return Number((gray / 255).toFixed(6));
  });
};

export default function FaceAuthModal({
  open,
  title,
  description,
  captureText,
  cancelText,
  isSubmitting = false,
  onClose,
  onCapture,
}: FaceAuthModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState('');
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const startCamera = async () => {
      setError('');
      setIsCameraReady(false);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsCameraReady(true);
        }
      } catch {
        setError(description);
      }
    };

    void startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [description, open]);

  const capture = async () => {
    if (!videoRef.current || isSubmitting) return;
    setError('');
    try {
      const descriptor = await getVideoDescriptor(videoRef.current);
      if (!descriptor.length) {
        setError(description);
        return;
      }
      onCapture(descriptor);
    } catch {
      setError(description);
    }
  };

  return (
    <Modal
      open={open}
      setOpen={(next) => !next && onClose()}
      title={title}
      contentClassName="sm:w-[640px]"
      preventAutoFocus
      footer={
        <>
          <SecondaryButton onClick={onClose}>{cancelText}</SecondaryButton>
          <PrimaryButton
            icon={<Camera size={16} />}
            disabled={!isCameraReady || isSubmitting}
            isSubmitting={isSubmitting}
            onClick={capture}
          >
            {captureText}
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-4">
        <div className="relative aspect-video overflow-hidden rounded-lg border border-light-card-border bg-gray-light-100 dark:border-dark-card-border dark:bg-dark-card-surface">
          <video
            ref={videoRef}
            muted
            playsInline
            className="h-full w-full scale-x-[-1] object-cover"
          />
          {!isCameraReady && (
            <div className="absolute inset-0 grid place-items-center text-sm text-light-text-secondary dark:text-dark-secondary">
              <UserFocus size={36} className="mb-2" />
              {description}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-danger-600">{error}</p>}
      </div>
    </Modal>
  );
}
