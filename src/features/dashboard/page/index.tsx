import {
  Briefcase,
  ChartDonut,
  ChatsCircle,
  CurrencyDollar,
  Receipt,
  TrendUp,
  UsersThree,
  WarningCircle,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useClientsQuery } from '@/services/clients';
import { useUsersQuery } from '@/features/users/service';
import { useBillsQuery, useBondsQuery } from '@/features/finance/service';
import {
  useProjectsQuery,
  type ProjectDto,
  type ProjectStatus,
} from '@/features/projects/service';
import { useResourceListQuery } from '@/features/management/service';

type MetricTone = 'teal' | 'amber' | 'rose' | 'indigo';

type MonthFinance = {
  label: string;
  billed: number;
  collected: number;
};

const projectStatuses: ProjectStatus[] = [
  'New',
  'InProgress',
  'Completed',
  'OnHold',
  'Cancelled',
];

const statusColors: Record<ProjectStatus, string> = {
  New: '#7c5cff',
  InProgress: '#0f9f8f',
  Completed: '#22a06b',
  OnHold: '#d99a21',
  Cancelled: '#d24b4b',
};

const toneClasses: Record<MetricTone, string> = {
  teal: 'bg-[#e8fbf8] text-[#08796f] dark:bg-[#0f2f2c] dark:text-[#7ce0d4]',
  amber: 'bg-[#fff4dc] text-[#9b650d] dark:bg-[#3b2b12] dark:text-[#f4c76f]',
  rose: 'bg-[#ffe9e9] text-[#b13737] dark:bg-[#3d1d1d] dark:text-[#ff9c9c]',
  indigo: 'bg-[#ecebff] text-[#5141b8] dark:bg-[#242047] dark:text-[#b8b0ff]',
};

export default function Dashboard() {
  const { t, i18n } = useTranslation('dashboard');
  const projectsQuery = useProjectsQuery({ Page: 1, PageSize: 1000 });
  const billsQuery = useBillsQuery({ Page: 1, PageSize: 1000 });
  const bondsQuery = useBondsQuery({ Page: 1, PageSize: 1000 });
  const clientsQuery = useClientsQuery({ page: 1, pageSize: 1 });
  const usersQuery = useUsersQuery({ page: 1, pageSize: 1000 });
  const chatsQuery = useResourceListQuery('Chats', { Page: 1, PageSize: 1 });

  const projects = useMemo(
    () => projectsQuery.data?.items ?? [],
    [projectsQuery.data?.items]
  );
  const bills = useMemo(
    () => billsQuery.data?.items ?? [],
    [billsQuery.data?.items]
  );
  const bonds = useMemo(
    () => bondsQuery.data?.items ?? [],
    [bondsQuery.data?.items]
  );
  const users = usersQuery.data?.items ?? [];

  const projectTotal = projectsQuery.data?.totalCount ?? projects.length;
  const clientTotal =
    clientsQuery.data?.pagination.totalCount ??
    clientsQuery.data?.items.length ??
    0;
  const usersTotal = usersQuery.data?.pagination.totalCount ?? users.length;
  const activeUsers = users.filter((user) => user.isActive).length;
  const chatsTotal = chatsQuery.data?.totalCount ?? 0;
  const totalBilled = bills.reduce((sum, bill) => sum + bill.total, 0);
  const totalCollected = bonds.reduce((sum, bond) => sum + bond.total, 0);
  const projectValue = projects.reduce(
    (sum, project) => sum + project.totalAmount,
    0
  );
  const remaining = Math.max(totalBilled - totalCollected, 0);
  const statusCounts = projectStatuses.map((status) => ({
    status,
    count: projects.filter((project) => project.status === status).length,
  }));
  const completedCount =
    statusCounts.find((item) => item.status === 'Completed')?.count ?? 0;
  const movingCount =
    statusCounts.find((item) => item.status === 'InProgress')?.count ?? 0;
  const unpaidProjectCount = projects.filter(
    (project) => project.remainingAmount > 0
  ).length;
  const completionRate = projectTotal
    ? Math.round((completedCount / projectTotal) * 100)
    : 0;
  const monthlyFinance = useMemo(
    () => buildMonthlyFinance(bills, bonds, i18n.language),
    [bills, bonds, i18n.language]
  );
  const recentProjects = useMemo(
    () =>
      [...projects]
        .sort((left, right) =>
          String(right.createdAt).localeCompare(String(left.createdAt))
        )
        .slice(0, 5),
    [projects]
  );
  const loading =
    projectsQuery.isLoading ||
    billsQuery.isLoading ||
    bondsQuery.isLoading ||
    clientsQuery.isLoading ||
    usersQuery.isLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col gap-5 overflow-y-auto"
    >
      {loading && (
        <p className="text-sm text-light-text-secondary dark:text-dark-secondary">
          {t('loading')}
        </p>
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<Briefcase size={22} />}
          label={t('projects')}
          value={formatNumber(projectTotal, i18n.language)}
          hint={`${completionRate}% ${t('completion_rate')}`}
          tone="indigo"
        />
        <MetricCard
          icon={<CurrencyDollar size={22} />}
          label={t('project_value')}
          value={formatCurrency(projectValue, i18n.language)}
          hint={t('open_projects')}
          tone="teal"
        />
        <MetricCard
          icon={<UsersThree size={22} />}
          label={t('clients')}
          value={formatNumber(clientTotal, i18n.language)}
          hint={`${activeUsers}/${usersTotal} ${t('active_users')}`}
          tone="amber"
        />
        <MetricCard
          icon={<Receipt size={22} />}
          label={t('remaining')}
          value={formatCurrency(remaining, i18n.language)}
          hint={`${formatNumber(chatsTotal, i18n.language)} ${t('chats:chats')}`}
          tone="rose"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel title={t('monthly_finance')} icon={<TrendUp size={20} />}>
          <BarChart
            data={monthlyFinance}
            billedLabel={t('billed')}
            collectedLabel={t('collected')}
          />
        </Panel>
        <Panel title={t('status_mix')} icon={<ChartDonut size={20} />}>
          <DonutChart
            data={statusCounts}
            centerLabel={t('projects')}
            label={(status) => t(`projects:api_status_${status}`)}
          />
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel title={t('project_health')} icon={<WarningCircle size={20} />}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <InsightCard
              title={t('risk_watch')}
              body={t('risk_copy', { count: unpaidProjectCount })}
              value={formatCurrency(remaining, i18n.language)}
            />
            <InsightCard
              title={t('momentum')}
              body={t('momentum_copy', { count: movingCount })}
              value={`${completionRate}%`}
            />
          </div>
        </Panel>

        <Panel title={t('pipeline')} icon={<ChatsCircle size={20} />}>
          <div className="space-y-3">
            {statusCounts.map((item) => (
              <PipelineRow
                key={item.status}
                label={t(`projects:api_status_${item.status}`)}
                count={item.count}
                total={Math.max(projectTotal, 1)}
                color={statusColors[item.status]}
              />
            ))}
          </div>
        </Panel>
      </section>

      <Panel title={t('recent_projects')} icon={<Briefcase size={20} />}>
        <RecentProjectsTable projects={recentProjects} />
      </Panel>
    </motion.div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
  tone: MetricTone;
}) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      className="rounded-lg border border-light-card-border bg-white p-4 shadow-sm dark:border-dark-card-border dark:bg-dark-card-background"
    >
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${toneClasses[tone]}`}
      >
        {icon}
      </div>
      <p className="text-sm text-light-text-secondary dark:text-dark-secondary">
        {label}
      </p>
      <p className="mt-1 truncate text-2xl font-semibold text-light-text-primary dark:text-dark-primary">
        {value}
      </p>
      <p className="mt-2 text-xs text-light-text-secondary dark:text-dark-secondary">
        {hint}
      </p>
    </motion.article>
  );
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-light-card-border bg-white p-4 shadow-sm dark:border-dark-card-border dark:bg-dark-card-background">
      <div className="mb-4 flex items-center gap-2 text-light-text-primary dark:text-dark-primary">
        <span className="text-primary-light-500 dark:text-primary-dark-300">
          {icon}
        </span>
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function BarChart({
  data,
  billedLabel,
  collectedLabel,
}: {
  data: MonthFinance[];
  billedLabel: string;
  collectedLabel: string;
}) {
  const max = Math.max(
    1,
    ...data.flatMap((item) => [item.billed, item.collected])
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4 text-xs text-light-text-secondary dark:text-dark-secondary">
        <Legend color="#0f9f8f" label={billedLabel} />
        <Legend color="#d99a21" label={collectedLabel} />
      </div>
      <div className="grid h-[260px] grid-cols-6 items-end gap-3">
        {data.map((item) => (
          <div key={item.label} className="flex h-full min-w-0 flex-col">
            <div className="flex flex-1 items-end justify-center gap-1">
              <div
                className="w-full max-w-[22px] rounded-t bg-[#0f9f8f]"
                style={{ height: `${Math.max(4, (item.billed / max) * 100)}%` }}
              />
              <div
                className="w-full max-w-[22px] rounded-t bg-[#d99a21]"
                style={{
                  height: `${Math.max(4, (item.collected / max) * 100)}%`,
                }}
              />
            </div>
            <p className="mt-2 truncate text-center text-xs text-light-text-secondary dark:text-dark-secondary">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutChart({
  data,
  centerLabel,
  label,
}: {
  data: { status: ProjectStatus; count: number }[];
  centerLabel: string;
  label: (status: ProjectStatus) => string;
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const segments = data.map((item, index) => {
    const previousTotal = data
      .slice(0, index)
      .reduce((sum, previous) => sum + previous.count, 0);
    const segment = total ? (item.count / total) * 100 : 0;

    return {
      ...item,
      dash: `${segment} ${100 - segment}`,
      offset: 25 - (total ? (previousTotal / total) * 100 : 0),
    };
  });

  return (
    <div className="grid gap-4 sm:grid-cols-[180px_1fr] xl:grid-cols-1 2xl:grid-cols-[180px_1fr]">
      <svg viewBox="0 0 120 120" className="mx-auto h-[180px] w-[180px]">
        <circle
          cx="60"
          cy="60"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="16"
          className="text-gray-light-200 dark:text-dark-card-surface"
        />
        {segments.map((item) => (
          <circle
            key={item.status}
            cx="60"
            cy="60"
            r="42"
            fill="none"
            stroke={statusColors[item.status]}
            strokeWidth="16"
            pathLength="100"
            strokeDasharray={item.dash}
            strokeDashoffset={item.offset}
            strokeLinecap="round"
          />
        ))}
        <text
          x="60"
          y="56"
          textAnchor="middle"
          className="fill-light-text-primary text-lg font-semibold dark:fill-dark-primary"
        >
          {total}
        </text>
        <text
          x="60"
          y="72"
          textAnchor="middle"
          className="fill-light-text-secondary text-[9px] dark:fill-dark-secondary"
        >
          {centerLabel}
        </text>
      </svg>
      <div className="space-y-2 self-center">
        {data.map((item) => (
          <div
            key={item.status}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <Legend
              color={statusColors[item.status]}
              label={label(item.status)}
            />
            <span className="font-semibold">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PipelineRow({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percent = Math.round((count / total) * 100);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="font-semibold">{count}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-light-200 dark:bg-dark-card-surface">
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function InsightCard({
  title,
  body,
  value,
}: {
  title: string;
  body: string;
  value: string;
}) {
  return (
    <article className="rounded-lg bg-gray-light-100 p-4 dark:bg-dark-card-surface">
      <p className="text-sm font-semibold text-light-text-primary dark:text-dark-primary">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-light-text-secondary dark:text-dark-secondary">
        {body}
      </p>
      <p className="mt-4 text-xl font-semibold">{value}</p>
    </article>
  );
}

function RecentProjectsTable({ projects }: { projects: ProjectDto[] }) {
  const { t, i18n } = useTranslation('dashboard');

  if (!projects.length) {
    return (
      <p className="py-8 text-center text-sm text-light-text-secondary dark:text-dark-secondary">
        {t('no_projects')}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-sm">
        <thead>
          <tr className="text-start text-xs text-light-text-secondary dark:text-dark-secondary">
            <th className="px-3 py-2 text-start">{t('projects')}</th>
            <th className="px-3 py-2 text-start">{t('client')}</th>
            <th className="px-3 py-2 text-start">{t('status')}</th>
            <th className="px-3 py-2 text-start">{t('paid')}</th>
            <th className="px-3 py-2 text-start">{t('remain')}</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              className="bg-gray-light-100 dark:bg-dark-card-surface"
            >
              <td className="rounded-s-lg px-3 py-3 font-medium">
                {project.name ?? '-'}
              </td>
              <td className="px-3 py-3 text-light-text-secondary dark:text-dark-secondary">
                {project.clientName ?? '-'}
              </td>
              <td className="px-3 py-3">
                <span
                  className="inline-flex rounded-full px-2 py-1 text-xs font-medium text-white"
                  style={{ backgroundColor: statusColors[project.status] }}
                >
                  {t(`projects:api_status_${project.status}`)}
                </span>
              </td>
              <td className="px-3 py-3">
                {formatCurrency(project.paidAmount, i18n.language)}
              </td>
              <td className="rounded-e-lg px-3 py-3">
                {formatCurrency(project.remainingAmount, i18n.language)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="truncate">{label}</span>
    </span>
  );
}

const buildMonthlyFinance = (
  bills: { total: number; createdAt: string }[],
  bonds: { total: number; date: string }[],
  language: string
): MonthFinance[] => {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    return {
      key,
      label: new Intl.DateTimeFormat(language === 'ar' ? 'ar-SY' : 'en-US', {
        month: 'short',
      }).format(date),
      billed: 0,
      collected: 0,
    };
  });
  const byKey = new Map(months.map((item) => [item.key, item]));

  bills.forEach((bill) => {
    const date = new Date(bill.createdAt);
    const month = byKey.get(`${date.getFullYear()}-${date.getMonth()}`);
    if (month) month.billed += bill.total;
  });
  bonds.forEach((bond) => {
    const date = new Date(bond.date);
    const month = byKey.get(`${date.getFullYear()}-${date.getMonth()}`);
    if (month) month.collected += bond.total;
  });

  return months;
};

const formatCurrency = (value: number, language = 'en') =>
  new Intl.NumberFormat(language === 'ar' ? 'ar-SY' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value: number, language = 'en') =>
  new Intl.NumberFormat(language === 'ar' ? 'ar-SY' : 'en-US').format(value);
