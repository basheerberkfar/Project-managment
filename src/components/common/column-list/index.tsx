/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DotsSixVertical } from '@phosphor-icons/react';
import Checkbox from '@/components/ui/checkbox';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import type { TableColumnConfig } from '@/types/tableColumnConfig';
import { FIXED_ID_COLUMN_ID } from '@/components/common/table/table-fixed-columns';

/** Column ids to hide from the settings modal (e.g. row number column) */
const HIDDEN_COLUMN_IDS_IN_MODAL = [FIXED_ID_COLUMN_ID];

type ColumnsListProps = {
  columns: TableColumnConfig[];
  onChange: (columns: TableColumnConfig[]) => void;
};

function SortableRow({
  column,
  onToggle,
}: {
  column: TableColumnConfig;
  onToggle: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const isActive = isDragging || column.visible;
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'flex items-center px-3 py-2 border-b border-dark-card-border dark:bg-dark-card-background bg-white',
        'transition-colors',
        isActive && 'bg-gray-light-100'
      )}
    >
      <div className="w-[30px] flex justify-center">
        <Checkbox
          checked={column.visible}
          onChange={() => onToggle(column.id)}
        />
      </div>

      <div className="flex-1 ps-5 text-[0.81rem] dark:text-dark-primary text-gray-light-900">
        {column.label}
      </div>

      <button
        {...attributes}
        {...listeners}
        className="w-[30px] flex justify-center cursor-grab text-gray-light-800 dark:text-gray-dark-200"
      >
        <DotsSixVertical size={20} className="[color:inherit]" />
      </button>
    </div>
  );
}

export default function ColumnsList({ columns, onChange }: ColumnsListProps) {
  const { t } = useTranslation('common');
  const sensors = useSensors(useSensor(PointerSensor));

  const fixedColumns = columns.filter((c) =>
    HIDDEN_COLUMN_IDS_IN_MODAL.includes(c.id)
  );
  const displayColumns = columns.filter(
    (c) => !HIDDEN_COLUMN_IDS_IN_MODAL.includes(c.id)
  );

  const mergeColumns = (displayOrder: TableColumnConfig[]) => [
    ...fixedColumns,
    ...displayOrder,
  ];

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = displayColumns.findIndex((c) => c.id === active.id);
    const newIndex = displayColumns.findIndex((c) => c.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;
    onChange(mergeColumns(arrayMove(displayColumns, oldIndex, newIndex)));
  };

  const toggleColumn = (id: string) => {
    onChange(
      columns.map((col) =>
        col.id === id ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const allVisible =
    displayColumns.length > 0 && displayColumns.every((c) => c.visible);
  const someVisible = displayColumns.some((c) => c.visible);

  const handleSelectAll = (checked: boolean) => {
    onChange(
      columns.map((col) =>
        HIDDEN_COLUMN_IDS_IN_MODAL.includes(col.id)
          ? col
          : { ...col, visible: checked }
      )
    );
  };

  return (
    <div className="relative max-h-[300px] overflow-y-auto overflow-x-hidden overscroll-contain border border-dark-card-border rounded-md">
      <div className="relative">
        <div className="flex items-center px-3 py-[12px] text-[0.81rem] text-dark-secondary border-b border-dark-card-border relative z-20 dark:text-dark-secondary">
          <div className="w-[30px] flex justify-center">
            <Checkbox
              checked={allVisible}
              indeterminate={someVisible && !allVisible}
              onChange={handleSelectAll}
            />
          </div>

          <div className="flex sticky top-0 start-0 items-center flex-1 ps-5">
            <span>{t('column-names')}</span>
          </div>

          <span className="w-[40px] text-center ps-[5px]">{t('order')}</span>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={displayColumns.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {displayColumns.map((column) => (
              <SortableRow
                key={column.id}
                column={column}
                onToggle={toggleColumn}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
