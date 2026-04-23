import React, { useState } from 'react';
import clsx from 'clsx';
import { Eye, Star, Image as ImageIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/ui/dialog';

export type ProductImage = {
  id: string;
  url: string;
  isMain?: boolean;
};

interface ImagePreviewProps {
  images?: ProductImage[];
  label?: string;
  className?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  images = [],
  label,
  className,
}) => {
  const { t } = useTranslation('products');
  const labelText = label ?? (t('product_image') || 'Product Images');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return (
      <div
        className={clsx(
          'bg-white dark:bg-(--color-dark-surface-base) border border-gray-light-500 dark:border-dark-card-border rounded-xl p-6 transition-all duration-200',
          className
        )}
      >
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-light-500 dark:border-dark-card-border rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-gray-light-200 dark:bg-dark-card-surface flex items-center justify-center mb-4">
            <ImageIcon
              size={32}
              className="text-gray-light-700 dark:text-gray-dark-500"
            />
          </div>
          <h4 className="text-gray-light-900 dark:text-dark-primary font-semibold mb-1">
            {t('no_product_image')}
          </h4>
          <p className="text-sm text-gray-light-700 dark:text-gray-dark-500">
            {t('no_product_image_description')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'bg-white dark:bg-(--color-dark-surface-base) border border-gray-light-500 dark:border-dark-card-border rounded-xl p-6 transition-all duration-200',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-semibold text-gray-light-900 dark:text-dark-primary">
          {labelText}
        </h3>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative group bg-gray-light-100 dark:bg-dark-card-surface border border-gray-light-500 dark:border-dark-card-border rounded-xl overflow-hidden aspect-square flex flex-col pt-3"
          >
            {/* Image Preview Container */}
            <div className="flex-1 relative flex items-center justify-center p-4">
              <img
                src={img.url}
                alt={'Product Image'}
                className="max-w-full max-h-full object-contain drop-shadow-md"
              />
            </div>

            {/* Actions Footer - Appearing on hover or always visible? 
                User image shows buttons at bottom. 
                Let's put them in a visible footer area or overlay at bottom. 
                The user mockup shows them neatly at the bottom center/right.
            */}
            <div className="px-4 pb-3 flex items-center justify-center gap-2 mt-auto">
              <button
                onClick={() => setSelectedImage(img.url)}
                className="p-1.5 rounded-lg bg-white dark:bg-dark-surface-base border border-gray-light-500 dark:border-dark-card-border text-gray-light-700 dark:text-gray-dark-500 hover:text-(--color-primary) hover:border-(--color-primary) transition-all"
                title={t('view') || 'View'}
              >
                <Eye size={16} />
              </button>
              {img.isMain && (
                <div
                  className="p-1.5 rounded-lg bg-warning-500/10 border border-warning-500 text-warning-500"
                  title={t('main_image') || 'Main Image'}
                >
                  <Star size={16} weight="fill" />
                </div>
              )}
              {!img.isMain && (
                <div className="p-1.5 rounded-lg bg-white dark:bg-dark-surface-base border border-gray-light-500 dark:border-dark-card-border text-gray-light-700 dark:text-gray-dark-500">
                  <Star size={16} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Modal for Viewing */}
      <Modal
        open={!!selectedImage}
        setOpen={() => setSelectedImage(null)}
        title={t('view_image')}
        contentClassName="max-w-[95vw] w-[min(1200px,95vw)]"
      >
        <div className="flex items-center justify-center p-4 bg-black/5 rounded-lg min-h-[70vh]">
          <img
            src={selectedImage || ''}
            alt="Full Preview"
            className="max-h-[85vh] max-w-full w-full object-contain"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ImagePreview;
