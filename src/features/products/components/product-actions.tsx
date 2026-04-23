import { Eye, PencilSimpleLine, Trash } from '@phosphor-icons/react';
import type { ProductDto } from '@/features/products/service/products.types';
import { useTranslation } from 'react-i18next';

interface ProductActionsProps {
  product: ProductDto;
  onView?: (product: ProductDto) => void;
  onEdit?: (product: ProductDto) => void;
  onDelete?: (product: ProductDto) => void;
}

export const ProductActions = ({
  product,
  onView,
  onEdit,
  onDelete,
}: ProductActionsProps) => {
  const { t } = useTranslation('products');
  return (
    <div className="flex items-center gap-3">
      {onView && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(product);
          }}
          className="text-gray-light-600 hover:text-primary-dark-500 transition-colors cursor-pointer"
          title={t('view')}
        >
          <Eye size={18} />
        </button>
      )}
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(product);
          }}
          className="text-gray-light-600 hover:text-primary-dark-500 transition-colors cursor-pointer"
          title={t('edit')}
        >
          <PencilSimpleLine size={18} />
        </button>
      )}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product);
          }}
          className="text-gray-light-600 hover:text-red-500 transition-colors cursor-pointer"
          title={t('delete')}
        >
          <Trash size={18} />
        </button>
      )}
    </div>
  );
};
