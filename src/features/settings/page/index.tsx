import {
  Bell,
  Buildings,
  Check,
  Flag,
  GearSix,
  Plus,
  Rows,
  Trash,
} from '@phosphor-icons/react';
import { useState } from 'react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import Input from '@/components/ui/input';
import SquareButton from '@/components/ui/squareButton';
import { Toggle as UiToggle } from '@/components/ui/toggle';
import FinancialTypesSettings from '@/features/finance/components/financial-types-settings';
import { RelatedResourcePanel } from '@/features/management/page';
import {
  TaskCategoriesSettings,
  TaskStatusesSettings,
} from '@/features/projects/components/task-settings';
import { useTranslation } from 'react-i18next';

type ColorItem = {
  id: number;
  name: string;
  color: string;
  default?: boolean;
  canArchive?: boolean;
  sortOrder?: number;
  type?: string;
};

type CompanySettings = {
  companyName: string;
  website: string;
  email: string;
  phoneNumber: string;
  address: string;
  renewalDueSoonDays: number;
  renewalWhatsMessageHeader: string;
  renewalWhatsMessageFooter: string;
  projectStatusNotification: boolean;
  taskStatusNotification: boolean;
};

const isHexColor = (value: string) => /^#[0-9a-fA-F]{6}$/.test(value);

const initialProjectStatuses: ColorItem[] = [
  { id: 1, name: 'New', color: '#944f30', default: true },
  { id: 2, name: 'In Progress', color: '#3f6d6a' },
  { id: 3, name: 'Delivered', color: '#34947e' },
];

const initialPriorities: ColorItem[] = [
  { id: 1, name: 'High', color: '#b04a4a' },
  { id: 2, name: 'Medium', color: '#c48a3a' },
  { id: 3, name: 'Low', color: '#3f6d6a' },
];

const initialCompany: CompanySettings = {
  companyName: 'Fifth Year',
  website: 'https://fifth-year.example',
  email: 'hello@fifth-year.example',
  phoneNumber: '+963944000000',
  address: 'Damascus',
  renewalDueSoonDays: 14,
  renewalWhatsMessageHeader: 'Hello, your renewal is due soon.',
  renewalWhatsMessageFooter: 'Thank you.',
  projectStatusNotification: true,
  taskStatusNotification: true,
};

function TextInput({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <Input
      label={label}
      value={value}
      type={type}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function LabeledToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2 border border-light-card-border bg-white p-3 text-sm dark:border-dark-card-border dark:bg-dark-card-background">
      <span>{label}</span>
      <UiToggle checked={checked} onChange={onChange} />
    </div>
  );
}

function EditableColorList({
  title,
  items,
  setItems,
  withArchive = false,
}: {
  title: string;
  items: ColorItem[];
  setItems: React.Dispatch<React.SetStateAction<ColorItem[]>>;
  withArchive?: boolean;
}) {
  const { t } = useTranslation('settings');
  const [draft, setDraft] = useState({ name: '', color: '#944f30' });
  const [error, setError] = useState('');

  const updateItem = (id: number, data: Partial<ColorItem>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
  };

  const addItem = () => {
    if (!draft.name.trim() || !isHexColor(draft.color)) {
      setError(t('name_color_required'));
      return;
    }

    setItems((current) => [
      ...current,
      {
        id: Date.now(),
        name: draft.name.trim(),
        color: draft.color,
        canArchive: withArchive ? false : undefined,
        sortOrder: withArchive ? current.length + 1 : undefined,
        type: withArchive ? 'CUSTOM' : undefined,
      },
    ]);
    setDraft({ name: '', color: '#944f30' });
    setError('');
  };

  return (
    <section className="space-y-3 rounded-2 border border-light-card-border bg-white p-4 dark:border-dark-card-border dark:bg-dark-card-background">
      <h2 className="font-semibold text-light-text-primary dark:text-dark-primary">
        {title}
      </h2>
      <div className="grid gap-2 md:grid-cols-[1fr_150px_auto]">
        <TextInput
          label={t('name')}
          value={draft.name}
          onChange={(value) =>
            setDraft((current) => ({ ...current, name: value }))
          }
        />
        <TextInput
          label={t('hex_color')}
          value={draft.color}
          onChange={(value) =>
            setDraft((current) => ({ ...current, color: value }))
          }
        />
        <PrimaryButton
          className="self-end"
          icon={<Plus size={16} />}
          onClick={addItem}
        >
          {t('add')}
        </PrimaryButton>
      </div>
      {error && <p className="text-sm text-danger-600">{error}</p>}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid items-center gap-2 rounded-2 bg-gray-light-100 p-3 dark:bg-dark-card-surface md:grid-cols-[24px_1fr_140px_140px_auto]"
          >
            <span
              className="h-5 w-5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <Input
              value={item.name}
              className="min-h-9! h-9!"
              onChange={(event) =>
                updateItem(item.id, { name: event.target.value })
              }
            />
            <Input
              value={item.color}
              className="min-h-9! h-9!"
              onChange={(event) =>
                updateItem(item.id, { color: event.target.value })
              }
            />
            {withArchive ? (
              <LabeledToggle
                label={t('can_archive')}
                checked={Boolean(item.canArchive)}
                onChange={(checked) =>
                  updateItem(item.id, { canArchive: checked })
                }
              />
            ) : (
              <span className="text-sm text-light-text-secondary dark:text-dark-secondary">
                {item.default ? t('default') : t('custom')}
              </span>
            )}
            <SquareButton
              Icon={Trash}
              disabled={item.default}
              onClick={() =>
                setItems((current) =>
                  current.filter((currentItem) => currentItem.id !== item.id)
                )
              }
              ariaLabel={
                item.default ? t('default_cannot_delete') : t('delete')
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function CompanySettingsForm({
  value,
  onChange,
}: {
  value: CompanySettings;
  onChange: (value: CompanySettings) => void;
}) {
  const { t } = useTranslation('settings');
  const setField = <K extends keyof CompanySettings>(
    key: K,
    fieldValue: CompanySettings[K]
  ) => onChange({ ...value, [key]: fieldValue });

  return (
    <section className="space-y-4 rounded-2 border border-light-card-border bg-white p-4 dark:border-dark-card-border dark:bg-dark-card-background">
      <h2 className="font-semibold text-light-text-primary dark:text-dark-primary">
        {t('company_notifications')}
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        <TextInput
          label={t('company_name')}
          value={value.companyName}
          onChange={(text) => setField('companyName', text)}
        />
        <TextInput
          label={t('website')}
          value={value.website}
          onChange={(text) => setField('website', text)}
        />
        <TextInput
          label={t('email')}
          value={value.email}
          type="email"
          onChange={(text) => setField('email', text)}
        />
        <TextInput
          label={t('phone_number')}
          value={value.phoneNumber}
          onChange={(text) => setField('phoneNumber', text)}
        />
        <TextInput
          label={t('address')}
          value={value.address}
          onChange={(text) => setField('address', text)}
        />
        <TextInput
          label={t('renewal_due_days')}
          value={value.renewalDueSoonDays}
          type="number"
          onChange={(text) => setField('renewalDueSoonDays', Number(text))}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <LabeledToggle
          label={t('project_status_notifications')}
          checked={value.projectStatusNotification}
          onChange={(checked) => setField('projectStatusNotification', checked)}
        />
        <LabeledToggle
          label={t('task_status_notifications')}
          checked={value.taskStatusNotification}
          onChange={(checked) => setField('taskStatusNotification', checked)}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <TextInput
          label={t('whatsapp_header')}
          value={value.renewalWhatsMessageHeader}
          onChange={(text) => setField('renewalWhatsMessageHeader', text)}
        />
        <TextInput
          label={t('whatsapp_footer')}
          value={value.renewalWhatsMessageFooter}
          onChange={(text) => setField('renewalWhatsMessageFooter', text)}
        />
      </div>
      <div className="rounded-2 bg-gray-light-100 p-3 text-sm text-light-text-secondary dark:bg-dark-card-surface dark:text-dark-secondary">
        {t('media_upload_note')}
      </div>
    </section>
  );
}

export default function SettingsPage() {
  const { t } = useTranslation('settings');
  const [activeTab, setActiveTab] = useState('general');
  const [projectStatuses, setProjectStatuses] = useState(() =>
    initialProjectStatuses.map((item, index) => ({
      ...item,
      name: t(['status_new', 'status_in_progress', 'status_delivered'][index]),
    }))
  );
  const [priorities, setPriorities] = useState(() =>
    initialPriorities.map((item, index) => ({
      ...item,
      name: t(['priority_high', 'priority_medium', 'priority_low'][index]),
    }))
  );
  const [company, setCompany] = useState(initialCompany);

  const tabs = [
    { id: 'general', label: t('tab_general'), icon: <GearSix size={16} /> },
    {
      id: 'bills-and-bonds',
      label: t('tab_financial_types'),
      icon: <Rows size={16} />,
    },
    {
      id: 'task-categories',
      label: t('tab_task_categories'),
      icon: <Flag size={16} />,
    },
    {
      id: 'statuses',
      label: t('tab_task_statuses'),
      icon: <Check size={16} />,
    },
    { id: 'special', label: t('tab_special'), icon: <Buildings size={16} /> },
    { id: 'login-settings', label: t('tab_login'), icon: <Bell size={16} /> },
    { id: 'hr', label: t('tab_hr'), icon: <Rows size={16} /> },
    {
      id: 'reference-data',
      label: t('tab_reference_data'),
      icon: <Rows size={16} />,
    },
  ];

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto">
      <div>
        <p className="text-sm text-light-text-secondary dark:text-dark-secondary">
          {t('eyebrow')}
        </p>
        <h1 className="text-2xl font-semibold text-light-text-primary dark:text-dark-primary">
          {t('title')}
        </h1>
      </div>

      <div className="flex gap-2 overflow-x-auto rounded-2 border border-light-card-border bg-white p-2 dark:border-dark-card-border dark:bg-dark-card-background">
        {tabs.map((tab) =>
          activeTab === tab.id ? (
            <PrimaryButton
              key={tab.id}
              icon={tab.icon}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </PrimaryButton>
          ) : (
            <SecondaryButton
              key={tab.id}
              icon={tab.icon}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </SecondaryButton>
          )
        )}
      </div>

      {activeTab === 'general' && (
        <div className="grid gap-4 xl:grid-cols-2">
          <EditableColorList
            title={t('project_statuses')}
            items={projectStatuses}
            setItems={setProjectStatuses}
          />
          <EditableColorList
            title={t('priorities')}
            items={priorities}
            setItems={setPriorities}
          />
        </div>
      )}
      {activeTab === 'bills-and-bonds' && <FinancialTypesSettings />}
      {activeTab === 'task-categories' && <TaskCategoriesSettings />}
      {activeTab === 'statuses' && <TaskStatusesSettings />}
      {activeTab === 'special' && (
        <CompanySettingsForm value={company} onChange={setCompany} />
      )}
      {activeTab === 'login-settings' && (
        <section className="rounded-2 border border-light-card-border bg-white p-4 dark:border-dark-card-border dark:bg-dark-card-background">
          <h2 className="font-semibold">{t('login_title')}</h2>
          <p className="mt-2 text-sm text-light-text-secondary dark:text-dark-secondary">
            {t('login_description')}
          </p>
        </section>
      )}
      {activeTab === 'hr' && (
        <section className="rounded-2 border border-light-card-border bg-white p-4 dark:border-dark-card-border dark:bg-dark-card-background">
          <h2 className="font-semibold">{t('hr_title')}</h2>
          <p className="mt-2 text-sm text-light-text-secondary dark:text-dark-secondary">
            {t('hr_description')}
          </p>
        </section>
      )}
      {activeTab === 'reference-data' && <ReferenceDataSettings />}
    </div>
  );
}

const referenceResources = [
  'states',
  'software-systems',
];

function ReferenceDataSettings() {
  const { t } = useTranslation('management');
  const [resource, setResource] = useState(referenceResources[0]);
  return (
    <section className="space-y-4">
      <div className="flex gap-2 overflow-x-auto border-b border-light-card-border pb-3 dark:border-dark-card-border">
        {referenceResources.map((item) =>
          item === resource ? (
            <PrimaryButton key={item} onClick={() => setResource(item)}>
              {t(`resource_${item}`)}
            </PrimaryButton>
          ) : (
            <SecondaryButton key={item} onClick={() => setResource(item)}>
              {t(`resource_${item}`)}
            </SecondaryButton>
          )
        )}
      </div>
      <RelatedResourcePanel
        key={resource}
        resourceKey={resource}
        fixedValues={{}}
        filters={{}}
      />
    </section>
  );
}
