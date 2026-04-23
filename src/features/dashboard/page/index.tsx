import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { Eye, PencilSimple, Trash } from '@phosphor-icons/react';
import { Table } from '@/components/common/table';
import type { Column } from '@/components/common/table';
import DeleteModal from '@/components/common/delete-modal';
import SelectInput from '@/components/ui/select/index';
import { PAGE_SIZE_OPTIONS } from '@/constants/constants';
import TableActions from '@/components/common/table/table-actions';
import type { TableColumnConfig } from '@/types/tableColumnConfig';
interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

// Dummy Data Generator
const MOCK_DATA: UserData[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'Editor' : 'Viewer',
  status: i % 4 === 0 ? 'Inactive' : 'Active',
  lastLogin: new Date(
    Date.now() - Math.floor(Math.random() * 10000000000)
  ).toLocaleDateString(),
}));

/**
 * ErrorButton component to test Sentry's error tracking.
 * This triggers a synthetic error which Sentry should capture.
 */
function ErrorButton() {
  return (
    <div className="p-4 bg-[var(--color-danger-500)]/5 border border-[var(--color-danger-500)]/20 rounded-lg mb-6">
      <h3 className="text-[var(--color-danger-500)] font-bold mb-2">
        Sentry Test Zone
      </h3>
      <p className="text-[var(--color-gray-dark-200)] text-sm mb-4">
        Click the button below to trigger a test error and check if Sentry is
        capturing it in your dashboard.
      </p>
      <button
        className="bg-[var(--color-danger-500)] text-white px-4 py-2 rounded hover:bg-[var(--color-danger-600)] transition-colors"
        onClick={() => {
          throw new Error('Sentry Test Error: Break the world!');
        }}
      >
        Trigger Test Error
      </button>
    </div>
  );
}

const Dashboard = () => {
  // Table State
  const [open, setOpen] = useState(false);

  const columnsData: TableColumnConfig[] = [
    { id: 'car', label: 'Car', visible: true },
    { id: 'logType', label: 'Car Log Type', visible: false },
    { id: 'delegate', label: 'Delegate', visible: false },
    { id: 'km', label: 'Km', visible: false },
    { id: 'date', label: 'Creation date', visible: false },
    { id: 'time', label: 'Creation time', visible: false },
  ];
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterReset = () => {
    console.log('filter reset');
  };

  const handleFilterApply = () => {
    console.log('filter apply');
  };

  const handleSettingReset = () => {
    setColumns(columnsData);
  };

  const handleSettingApply = (nextColumns?: TableColumnConfig[]) => {
    console.log('applied columns:', nextColumns ?? columns);
  };
  const [columns, setColumns] = useState(columnsData);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sort, setSort] = useState<
    { columnId: string; direction: 'asc' | 'desc' } | undefined
  >(undefined);

  // Data Slicing for Client-Side Pagination Simulation
  const filteredData = MOCK_DATA.filter(
    (item) =>
      item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const currentData = filteredData.slice(
    (pageIndex - 1) * pageSize,
    pageIndex * pageSize
  );

  const columns1: Column<UserData>[] = [
    {
      header: '#',
      accessorKey: 'id',
      className: 'w-16',
      sortable: true,
    },
    {
      header: 'Full Name',
      accessorKey: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.name}</span>
          <span className="text-xs text-[var(--color-gray-dark-400)]">
            {row.email}
          </span>
        </div>
      ),
    },
    {
      header: 'Role',
      accessorKey: 'role',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              row.role === 'Admin'
                ? 'bg-purple-500'
                : row.role === 'Editor'
                  ? 'bg-blue-500'
                  : 'bg-gray-500'
            }`}
          />
          {row.role}
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === 'Active'
              ? 'bg-[var(--color-primary-dark-500)]/20 text-[var(--color-primary-dark-500)]'
              : 'bg-[var(--color-danger-500)]/20 text-[var(--color-danger-500)]'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Last Login',
      accessorKey: 'lastLogin',
      className: 'text-[var(--color-gray-dark-200)]',
      sortable: true,
    },
    {
      header: 'Actions',
      className: 'w-32',
      render: () => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-full hover:bg-[var(--color-gray-dark-600)]/20 text-[var(--color-gray-dark-200)] hover:text-[var(--color-primary-dark-500)] transition-colors">
            <Eye size={18} />
          </button>
          <button className="p-1.5 rounded-full hover:bg-[var(--color-gray-dark-600)]/20 text-[var(--color-gray-dark-200)] hover:text-blue-500 transition-colors">
            <PencilSimple size={18} />
          </button>
          <button className="p-1.5 rounded-full hover:bg-[var(--color-gray-dark-600)]/20 text-[var(--color-gray-dark-200)] hover:text-red-500 transition-colors">
            <Trash size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-['Playfair Display'] text-[var(--color-dark-primary)]">
            Dashboard
          </h1>
          <p className="text-[var(--color-gray-dark-200)] mt-1">
            Manage your users and settings
          </p>
        </div>
        <button className="bg-[var(--color-primary-dark-500)] text-white px-4 py-2 rounded-[var(--rounded-1)] hover:bg-[var(--color-primary-dark-600)] transition-colors">
          Add New User
        </button>
      </div>

      <ErrorButton />

      <button onClick={() => setOpen(true)} className="btn-primary">
        Open Modal
      </button>

      <DeleteModal
        deleteMessage={'asdadsasdas'}
        handelDelete={() => console.log('sad')}
        open={open}
        setOpen={setOpen}
        title="Deletsadad"
      />
      <TableActions
        onChange={handleSearch}
        value={searchTerm}
        handleReset={handleFilterReset}
        handleFilter={handleFilterApply}
        handleSettingReset={handleSettingReset}
        handelApply={handleSettingApply}
        columns={columns}
        setColumns={setColumns}
        buttonChildren="Add User"
        onClick={() => console.log('Add user clicked')}
      >
        {/* Filter content goes here */}
        <div className="flex flex-col gap-4">
          <SelectInput
            label="Role"
            options={[
              { label: 'Admin', value: 'Admin' },
              { label: 'Editor', value: 'Editor' },
              { label: 'Viewer', value: 'Viewer' },
            ]}
          />

          <SelectInput
            label="Status"
            options={[
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
            ]}
          />
        </div>
      </TableActions>

      <Table
        data={currentData}
        columns={columns1}
        isLoading={false}
        sort={sort}
        onSort={(columnId, direction) => {
          setSort({ columnId, direction });
        }}
        pagination={{
          pageIndex,
          pageSize,
          totalCount: filteredData.length,
          onPageChange: setPageIndex,
          onPageSizeChange: (newSize) => {
            setPageSize(newSize);
            setPageIndex(1);
          },
          pageSizeOptions: [...PAGE_SIZE_OPTIONS],
        }}
      />
      <SelectInput
        label="Country"
        options={[
          { label: 'Germany', value: 'de' },
          { label: 'France', value: 'fr' },
        ]}
      />

      <SelectInput
        label="Skills"
        isMulti
        options={[
          {
            label: 'React',
            value: 'react',
            icon: <Trash className="w-5 h-5" />,
          },
          {
            label: 'TypeScript',
            value: 'ts',
            icon: <Trash className="w-5 h-5" />,
          },
          {
            label: 'Tailwind',
            value: 'tw',
            icon: <Trash className="w-5 h-5" />,
          },
        ]}
      />
    </div>
  );
};

export default Dashboard;
