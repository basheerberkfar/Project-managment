import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import * as mammoth from 'mammoth';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export type CandidateProfile = {
  fullName: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedIn: string | null;
};

export type JobMatchResult = {
  matchScore: number;
  verdict: string | null;
  matchedSkills: string[] | null;
  missingSkills: string[] | null;
  recommendation: string | null;
};

export type AtsCheck = {
  key: string;
  label: string;
  score: number;
  status: 'good' | 'warning' | 'danger';
  details: string;
};

export type AtsAnalysis = {
  score: number;
  keywordScore: number;
  formatScore: number;
  structureScore: number;
  contactScore: number;
  readabilityScore: number;
  checks: AtsCheck[];
  foundSections: string[];
  missingSections: string[];
  keywordCoverage: number;
  wordCount: number;
};

export type CvAnalysisResult = {
  candidate: CandidateProfile | null;
  summary: string | null;
  totalYearsOfExperience: number;
  skills: string[] | null;
  languages: string[] | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  jobMatch: JobMatchResult | null;
  atsAnalysis: AtsAnalysis;
};

const knownSkills = [
  'javascript',
  'typescript',
  'react',
  'vue',
  'angular',
  'node',
  'express',
  'next.js',
  'html',
  'css',
  'tailwind',
  'bootstrap',
  'sass',
  'python',
  'django',
  'flask',
  'php',
  'laravel',
  'java',
  'spring',
  'c#',
  '.net',
  'sql',
  'mysql',
  'postgresql',
  'mongodb',
  'redis',
  'docker',
  'kubernetes',
  'aws',
  'azure',
  'git',
  'github',
  'figma',
  'ui',
  'ux',
  'rest',
  'graphql',
  'testing',
  'jest',
  'cypress',
  'project management',
  'scrum',
  'agile',
  'seo',
  'marketing',
  'sales',
  'accounting',
  'finance',
  'excel',
  'power bi',
  'photoshop',
  'illustrator',
  'autocad',
];

const languageNames = [
  'arabic',
  'english',
  'french',
  'german',
  'spanish',
  'turkish',
  'عربي',
  'العربية',
  'انكليزي',
  'إنكليزي',
  'english',
];

export const analyzeCv = async (
  file: File,
  jobDescription: string
): Promise<CvAnalysisResult> => {
  const cvText = normalizeWhitespace(await extractFileText(file));

  if (cvText.length < 40) {
    throw new Error('Could not extract enough readable text from this CV.');
  }

  return buildLocalAnalysis(cvText, jobDescription);
};

const extractFileText = async (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (file.type === 'application/pdf' || extension === 'pdf') {
    return extractPdfText(file);
  }

  if (
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    extension === 'docx'
  ) {
    const result = await mammoth.extractRawText({
      arrayBuffer: await file.arrayBuffer(),
    });
    return result.value;
  }

  if (file.type.startsWith('text/') || extension === 'txt') {
    return file.text();
  }

  throw new Error('Only PDF, DOCX, and TXT files can be analyzed locally.');
};

const extractPdfText = async (file: File) => {
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await getDocument({ data }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(
      content.items
        .filter(isTextItem)
        .map((item) => item.str)
        .join(' ')
    );
  }

  return pages.join('\n');
};

const isTextItem = (item: unknown): item is TextItem =>
  Boolean(item && typeof item === 'object' && 'str' in item);

const buildLocalAnalysis = (
  cvText: string,
  jobDescription: string
): CvAnalysisResult => {
  const skills = findKnownTerms(cvText, knownSkills);
  const jobSkills = findKnownTerms(jobDescription, knownSkills);
  const matchedSkills = jobSkills.filter((skill) => skills.includes(skill));
  const missingSkills = jobSkills.filter((skill) => !skills.includes(skill));
  const totalYearsOfExperience = estimateExperienceYears(cvText);
  const candidate = {
    fullName: extractName(cvText),
    title: extractTitle(cvText),
    email: cvText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null,
    phone: cvText.match(/(?:\+?\d[\s().-]*){8,}\d/)?.[0]?.trim() ?? null,
    location: extractLocation(cvText),
    linkedIn:
      cvText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/\S+/i)?.[0] ??
      null,
  };
  const matchScore = calculateMatchScore({
    cvText,
    jobDescription,
    matchedSkills,
    jobSkills,
  });
  const atsAnalysis = buildAtsAnalysis({
    cvText,
    jobDescription,
    candidate,
    skills,
    matchedSkills,
    jobSkills,
  });

  return {
    candidate,
    summary: buildSummary(
      skills,
      totalYearsOfExperience,
      matchScore,
      atsAnalysis.score
    ),
    totalYearsOfExperience,
    skills,
    languages: findKnownTerms(cvText, languageNames),
    strengths: buildStrengths(skills, totalYearsOfExperience, matchScore),
    weaknesses: buildWeaknesses(missingSkills, jobDescription),
    jobMatch: {
      matchScore,
      verdict:
        matchScore >= 75
          ? 'Strong match'
          : matchScore >= 50
            ? 'Potential match'
            : 'Needs review',
      matchedSkills,
      missingSkills,
      recommendation:
        matchScore >= 75
          ? 'Proceed to the next hiring step.'
          : 'Review the missing skills and validate experience manually.',
    },
    atsAnalysis,
  };
};

const normalizeWhitespace = (value: string) =>
  value
    .split('\u0000')
    .join(' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const findKnownTerms = (text: string, terms: string[]) => {
  const normalized = text.toLowerCase();

  return Array.from(
    new Set(
      terms.filter((term) =>
        new RegExp(
          `(^|[^\\p{L}\\p{N}])${escapeRegExp(term)}([^\\p{L}\\p{N}]|$)`,
          'iu'
        ).test(normalized)
      )
    )
  );
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const extractName = (text: string) => {
  const lines = getUsefulLines(text);
  const firstNameLikeLine = lines.find(
    (line) =>
      line.length <= 60 &&
      !line.includes('@') &&
      !/\d/.test(line) &&
      !/(resume|curriculum vitae|cv|profile|summary)/i.test(line)
  );

  return firstNameLikeLine ?? null;
};

const extractTitle = (text: string) => {
  const titleLine = getUsefulLines(text).find((line) =>
    /(developer|engineer|designer|manager|accountant|specialist|consultant|analyst|marketing|sales|مبرمج|مهندس|مصمم|مدير|محاسب|مختص|محلل)/i.test(
      line
    )
  );

  return titleLine ?? null;
};

const extractLocation = (text: string) => {
  const line = getUsefulLines(text).find((item) =>
    /(location|address|city|syria|damascus|aleppo|lebanon|uae|dubai|السكن|العنوان|دمشق|حلب|سوريا)/i.test(
      item
    )
  );

  return line ?? null;
};

const getUsefulLines = (text: string) =>
  text
    .split(/\r?\n| {2,}/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 30);

const estimateExperienceYears = (text: string) => {
  const explicitYears = [
    ...text.matchAll(/(\d{1,2})\+?\s*(?:years|yrs|سنوات|سنة)/gi),
  ]
    .map((match) => Number(match[1]))
    .filter((value) => Number.isFinite(value));
  const yearRanges = [...text.matchAll(/\b(19\d{2}|20\d{2})\b/g)].map((match) =>
    Number(match[1])
  );

  if (explicitYears.length) return Math.max(...explicitYears);
  if (yearRanges.length < 2) return 0;

  const firstYear = Math.min(...yearRanges);
  const lastYear = Math.max(...yearRanges, new Date().getFullYear());

  return Math.max(0, Math.min(lastYear - firstYear, 40));
};

const calculateMatchScore = ({
  cvText,
  jobDescription,
  matchedSkills,
  jobSkills,
}: {
  cvText: string;
  jobDescription: string;
  matchedSkills: string[];
  jobSkills: string[];
}) => {
  if (!jobDescription.trim())
    return Math.min(100, 45 + matchedSkills.length * 8);

  const skillScore = jobSkills.length
    ? (matchedSkills.length / jobSkills.length) * 80
    : 35;
  const cvWords = new Set(importantWords(cvText));
  const jobWords = importantWords(jobDescription);
  const overlap = jobWords.filter((word) => cvWords.has(word)).length;
  const keywordScore = jobWords.length ? (overlap / jobWords.length) * 20 : 0;

  return Math.round(Math.min(100, skillScore + keywordScore));
};

const importantWords = (text: string) =>
  text
    .toLowerCase()
    .match(/[\p{L}\p{N}+#.]{3,}/gu)
    ?.filter((word) => !stopWords.has(word)) ?? [];

const stopWords = new Set([
  'and',
  'the',
  'for',
  'with',
  'from',
  'this',
  'that',
  'you',
  'your',
  'are',
  'على',
  'في',
  'من',
  'الى',
  'إلى',
  'عن',
  'مع',
  'هذا',
  'هذه',
]);

const buildAtsAnalysis = ({
  cvText,
  jobDescription,
  candidate,
  skills,
  matchedSkills,
  jobSkills,
}: {
  cvText: string;
  jobDescription: string;
  candidate: CandidateProfile;
  skills: string[];
  matchedSkills: string[];
  jobSkills: string[];
}): AtsAnalysis => {
  const lower = cvText.toLowerCase();
  const wordCount = importantWords(cvText).length;
  const foundSections = sectionPatterns
    .filter((section) => section.pattern.test(lower))
    .map((section) => section.label);
  const missingSections = sectionPatterns
    .filter((section) => !section.pattern.test(lower))
    .map((section) => section.label);
  const contactHits = [
    candidate.email,
    candidate.phone,
    candidate.linkedIn,
    candidate.location,
  ].filter(Boolean).length;
  const keywordCoverage = jobSkills.length
    ? Math.round((matchedSkills.length / jobSkills.length) * 100)
    : Math.min(100, skills.length * 12);
  const keywordScore = clamp(keywordCoverage);
  const structureScore = Math.round(
    (foundSections.length / sectionPatterns.length) * 100
  );
  const contactScore = Math.round((contactHits / 4) * 100);
  const readabilityScore = scoreReadability(cvText, wordCount);
  const formatScore = scoreAtsFormat(cvText);
  const score = Math.round(
    keywordScore * 0.35 +
      structureScore * 0.25 +
      contactScore * 0.15 +
      readabilityScore * 0.15 +
      formatScore * 0.1
  );
  const checks: AtsCheck[] = [
    toCheck(
      'keywords',
      'Keyword match',
      keywordScore,
      jobDescription.trim()
        ? `${matchedSkills.length} of ${jobSkills.length} job skills were found.`
        : `${skills.length} recognized skills were found without a job description.`
    ),
    toCheck(
      'sections',
      'Resume sections',
      structureScore,
      `${foundSections.length} of ${sectionPatterns.length} core ATS sections were detected.`
    ),
    toCheck(
      'contact',
      'Contact details',
      contactScore,
      `${contactHits} of 4 contact signals were detected.`
    ),
    toCheck(
      'readability',
      'Readable content',
      readabilityScore,
      `${wordCount} useful words were extracted from the resume.`
    ),
    toCheck(
      'format',
      'ATS friendly format',
      formatScore,
      'Scored from text extraction quality, unusual symbols, and spacing noise.'
    ),
  ];

  return {
    score,
    keywordScore,
    formatScore,
    structureScore,
    contactScore,
    readabilityScore,
    checks,
    foundSections,
    missingSections,
    keywordCoverage,
    wordCount,
  };
};

const sectionPatterns = [
  { label: 'Summary', pattern: /\b(summary|profile|objective|نبذة|ملخص)\b/i },
  {
    label: 'Experience',
    pattern: /\b(experience|employment|work history|خبرة|الخبرات)\b/i,
  },
  {
    label: 'Education',
    pattern: /\b(education|degree|university|تعليم|جامعة)\b/i,
  },
  { label: 'Skills', pattern: /\b(skills|technical skills|مهارات)\b/i },
  { label: 'Projects', pattern: /\b(projects|portfolio|مشاريع|أعمال)\b/i },
];

const scoreReadability = (text: string, wordCount: number) => {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  const averageLineLength =
    lines.reduce((sum, line) => sum + line.length, 0) /
    Math.max(lines.length, 1);
  const wordScore = wordCount < 120 ? 45 : wordCount > 1400 ? 72 : 95;
  const lineScore = averageLineLength > 130 ? 65 : 95;

  return Math.round((wordScore + lineScore) / 2);
};

const scoreAtsFormat = (text: string) => {
  const symbolNoise =
    (text.match(/[■□◆●▲▶✓]/g)?.length ?? 0) + (text.match(/\|/g)?.length ?? 0);
  const emailReadable = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text);
  const hasEnoughBreaks = text.split(/\r?\n/).filter(Boolean).length >= 4;

  return clamp(
    100 -
      symbolNoise * 3 -
      (emailReadable ? 0 : 12) -
      (hasEnoughBreaks ? 0 : 10)
  );
};

const toCheck = (
  key: string,
  label: string,
  score: number,
  details: string
): AtsCheck => ({
  key,
  label,
  score,
  details,
  status: score >= 75 ? 'good' : score >= 50 ? 'warning' : 'danger',
});

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const buildSummary = (
  skills: string[],
  totalYearsOfExperience: number,
  matchScore: number,
  atsScore: number
) => {
  const topSkills = skills.slice(0, 6).join(', ') || 'no clear skills';

  // ponytail: heuristic summary; upgrade path is an AI/API scorer if nuanced language review is required.
  return `Local ATS analysis found ${topSkills}, estimated ${totalYearsOfExperience} years of experience, calculated a ${matchScore}% job match, and scored ATS readiness at ${atsScore}%.`;
};

const buildStrengths = (
  skills: string[],
  totalYearsOfExperience: number,
  matchScore: number
) =>
  [
    skills.length >= 5 ? 'Broad skill coverage' : null,
    totalYearsOfExperience >= 3 ? 'Relevant experience history' : null,
    matchScore >= 70 ? 'Good alignment with the job description' : null,
  ].filter((item): item is string => Boolean(item));

const buildWeaknesses = (missingSkills: string[], jobDescription: string) =>
  [
    missingSkills.length
      ? `Missing: ${missingSkills.slice(0, 6).join(', ')}`
      : null,
    jobDescription.trim()
      ? null
      : 'No job description was provided for comparison',
  ].filter((item): item is string => Boolean(item));
