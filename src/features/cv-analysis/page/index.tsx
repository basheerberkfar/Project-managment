import {
  ChartDonut,
  CheckCircle,
  FilePdf,
  Gauge,
  Sparkle,
  WarningCircle,
  XCircle,
} from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BreadCrumb from '@/components/common/breadCrumb';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/utils/helpers';
import { analyzeCv, type AtsCheck, type CvAnalysisResult } from '../service';

type ResultTab = 'ats' | 'skills' | 'improvements';

export default function CvAnalysisPage() {
  const { t } = useTranslation('management');
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const analysis = useMutation({
    mutationFn: () => analyzeCv(file!, jobDescription),
  });
  const submit = async () => {
    if (!file) return;
    try {
      await analysis.mutateAsync();
    } catch (error) {
      showToast({
        variant: 'danger',
        description: getApiErrorMessage(error, t('operation_failed')),
      });
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full overflow-y-auto overflow-x-hidden"
    >
      <div className="w-full space-y-5">
        <BreadCrumb
          items={[{ label: t('recruitment') }, { label: t('cv_analysis') }]}
        />
        <section className="grid gap-4 rounded-lg border border-light-card-border bg-white p-5 dark:border-dark-card-border dark:bg-dark-card-background sm:grid-cols-2">
          <Input
            label={t('cv_file')}
            required
            type="file"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <Textarea
            wrapperClassName="sm:col-span-2"
            label={t('job_description')}
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
          />
          <PrimaryButton
            className="sm:col-span-2 sm:justify-self-end"
            disabled={!file}
            isSubmitting={analysis.isPending}
            icon={<Sparkle size={16} />}
            onClick={submit}
          >
            {t('analyze')}
          </PrimaryButton>
        </section>
        {analysis.data && <AnalysisResult result={analysis.data} />}
      </div>
    </motion.div>
  );
}

function AnalysisResult({ result }: { result: CvAnalysisResult }) {
  const { t } = useTranslation('management');
  const [activeTab, setActiveTab] = useState<ResultTab>('ats');
  const candidate = result.candidate;
  const ats = result.atsAnalysis;
  const tabs: ResultTab[] = ['ats', 'skills', 'improvements'];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <section className="grid gap-4 rounded-lg border border-light-card-border bg-white p-5 dark:border-dark-card-border dark:bg-dark-card-background lg:grid-cols-[260px_1fr]">
        <ScoreRing score={ats.score} label={t('ats_score')} />
        <div className="min-w-0 space-y-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <FilePdf size={20} />
              <h2 className="font-semibold">{candidate?.fullName ?? '-'}</h2>
            </div>
            <p className="text-sm text-light-text-secondary dark:text-dark-secondary">
              {candidate?.title ?? t('candidate_title')} ·{' '}
              {result.totalYearsOfExperience} {t('experience_years')}
            </p>
          </div>
          <p className="text-sm leading-7 text-light-text-secondary dark:text-dark-secondary">
            {result.summary ?? '-'}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <MiniMetric
              label={t('match_score')}
              value={`${result.jobMatch?.matchScore ?? 0}%`}
            />
            <MiniMetric
              label={t('keyword_coverage')}
              value={`${ats.keywordCoverage}%`}
            />
            <MiniMetric label={t('word_count')} value={String(ats.wordCount)} />
          </div>
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) =>
          activeTab === tab ? (
            <PrimaryButton key={tab} onClick={() => setActiveTab(tab)}>
              {t(`cv_tab_${tab}`)}
            </PrimaryButton>
          ) : (
            <SecondaryButton key={tab} onClick={() => setActiveTab(tab)}>
              {t(`cv_tab_${tab}`)}
            </SecondaryButton>
          )
        )}
      </div>

      {activeTab === 'ats' && <AtsTab result={result} />}
      {activeTab === 'skills' && <SkillsTab result={result} />}
      {activeTab === 'improvements' && <ImprovementsTab result={result} />}
    </motion.section>
  );
}

function AtsTab({ result }: { result: CvAnalysisResult }) {
  const { t } = useTranslation('management');
  const ats = result.atsAnalysis;
  const chartData = [
    { label: t('ats_keywords'), value: ats.keywordScore, color: '#0f9f8f' },
    { label: t('ats_structure'), value: ats.structureScore, color: '#7c5cff' },
    { label: t('ats_contact'), value: ats.contactScore, color: '#d99a21' },
    {
      label: t('ats_readability'),
      value: ats.readabilityScore,
      color: '#2f80ed',
    },
    { label: t('ats_format'), value: ats.formatScore, color: '#d24b4b' },
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <Panel title={t('ats_breakdown')} icon={<ChartDonut size={20} />}>
        <div className="space-y-3">
          {chartData.map((item) => (
            <ProgressRow key={item.label} {...item} />
          ))}
        </div>
      </Panel>
      <Panel title={t('ats_checks')} icon={<Gauge size={20} />}>
        <div className="space-y-3">
          {ats.checks.map((check) => (
            <CheckCard key={check.key} check={check} />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function SkillsTab({ result }: { result: CvAnalysisResult }) {
  const { t } = useTranslation('management');

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ListPanel title={t('skills')} items={result.skills} tone="good" />
      <ListPanel
        title={t('missing_skills')}
        items={result.jobMatch?.missingSkills}
        tone="danger"
      />
      <ListPanel
        title={t('matched_skills')}
        items={result.jobMatch?.matchedSkills}
        tone="good"
      />
      <ListPanel title={t('languages')} items={result.languages} tone="info" />
    </div>
  );
}

function ImprovementsTab({ result }: { result: CvAnalysisResult }) {
  const { t } = useTranslation('management');
  const ats = result.atsAnalysis;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ListPanel title={t('strengths')} items={result.strengths} tone="good" />
      <ListPanel
        title={t('weaknesses')}
        items={result.weaknesses}
        tone="warning"
      />
      <ListPanel
        title={t('found_sections')}
        items={ats.foundSections}
        tone="good"
      />
      <ListPanel
        title={t('missing_sections')}
        items={ats.missingSections}
        tone="danger"
      />
    </div>
  );
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg viewBox="0 0 120 120" className="h-[190px] w-[190px]">
        <circle
          cx="60"
          cy="60"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          className="text-gray-light-200 dark:text-dark-card-surface"
        />
        <circle
          cx="60"
          cy="60"
          r="44"
          fill="none"
          stroke={score >= 75 ? '#0f9f8f' : score >= 50 ? '#d99a21' : '#d24b4b'}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />
        <text
          x="60"
          y="58"
          textAnchor="middle"
          className="fill-light-text-primary text-2xl font-semibold dark:fill-dark-primary"
        >
          {score}%
        </text>
        <text
          x="60"
          y="75"
          textAnchor="middle"
          className="fill-light-text-secondary text-[9px] dark:fill-dark-secondary"
        >
          ATS
        </text>
      </svg>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-light-100 p-3 dark:bg-dark-card-surface">
      <p className="text-xs text-light-text-secondary dark:text-dark-secondary">
        {label}
      </p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-light-card-border bg-white p-4 dark:border-dark-card-border dark:bg-dark-card-background">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-primary-light-500">{icon}</span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function ProgressRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-light-200 dark:bg-dark-card-surface">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function CheckCard({ check }: { check: AtsCheck }) {
  const Icon =
    check.status === 'good'
      ? CheckCircle
      : check.status === 'warning'
        ? WarningCircle
        : XCircle;
  const color =
    check.status === 'good'
      ? 'text-[#0f9f8f]'
      : check.status === 'warning'
        ? 'text-[#d99a21]'
        : 'text-[#d24b4b]';

  return (
    <div className="rounded-lg bg-gray-light-100 p-3 dark:bg-dark-card-surface">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-2">
          <Icon size={20} className={`mt-0.5 shrink-0 ${color}`} />
          <div className="min-w-0">
            <p className="font-medium">{check.label}</p>
            <p className="mt-1 text-sm leading-6 text-light-text-secondary dark:text-dark-secondary">
              {check.details}
            </p>
          </div>
        </div>
        <span className="shrink-0 font-semibold">{check.score}%</span>
      </div>
    </div>
  );
}

function ListPanel({
  title,
  items,
  tone,
}: {
  title: string;
  items?: string[] | null;
  tone: 'good' | 'warning' | 'danger' | 'info';
}) {
  const classes = {
    good: 'bg-[#e8fbf8] text-[#08796f] dark:bg-[#0f2f2c] dark:text-[#7ce0d4]',
    warning:
      'bg-[#fff4dc] text-[#9b650d] dark:bg-[#3b2b12] dark:text-[#f4c76f]',
    danger: 'bg-[#ffe9e9] text-[#b13737] dark:bg-[#3d1d1d] dark:text-[#ff9c9c]',
    info: 'bg-[#ecebff] text-[#5141b8] dark:bg-[#242047] dark:text-[#b8b0ff]',
  };

  return (
    <div className="rounded-lg border border-light-card-border bg-white p-4 dark:border-dark-card-border dark:bg-dark-card-background">
      <h3 className="mb-3 font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items?.length ? (
          items.map((item) => (
            <span
              key={item}
              className={`rounded-md px-2 py-1 text-sm ${classes[tone]}`}
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-sm text-light-text-secondary dark:text-dark-secondary">
            -
          </span>
        )}
      </div>
    </div>
  );
}
