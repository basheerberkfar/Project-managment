import {
  ArrowLeft,
  ChatCircleDots,
  MagnifyingGlass,
  PaperPlaneTilt,
  Plus,
  UsersThree,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import Modal from '@/components/ui/dialog';
import Input from '@/components/ui/input';
import SelectInput, { type SelectOption } from '@/components/ui/select';
import SquareButton from '@/components/ui/squareButton';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/components/ui/toast';
import { RelatedResourcePanel } from '@/features/management/page';
import {
  useCreateResourceMutation,
  useResourceListQuery,
  type ResourceRecord,
} from '@/features/management/service';
import { useProjectsQuery } from '@/features/projects/service';
import { getApiErrorMessage, getAuthUser } from '@/utils/helpers';

export default function ChatsPage() {
  const { t, i18n } = useTranslation('chats');
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState('');
  const [draft, setDraft] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const chats = useResourceListQuery('Chats', {
    Page: 1,
    PageSize: 100,
    Search: search || undefined,
  });
  const chatItems = chats.data?.items ?? [];
  const activeChat =
    chatItems.find((chat) => chat.id === activeId) ?? chatItems[0] ?? null;
  const messages = useResourceListQuery(
    'Messages',
    { ChatId: activeChat?.id, Page: 1, PageSize: 500, SortBy: 'CreatedAt' },
    Boolean(activeChat),
    3000
  );
  const createMessage = useCreateResourceMutation('Messages');
  const currentEmployeeId = String(getAuthUser()?.id ?? '');
  const sortedMessages = useMemo(
    () =>
      [...(messages.data?.items ?? [])].sort((left, right) =>
        String(left.createdAt ?? '').localeCompare(
          String(right.createdAt ?? '')
        )
      ),
    [messages.data?.items]
  );
  const send = async () => {
    if (!activeChat || !currentEmployeeId || !draft.trim()) return;
    try {
      await createMessage.mutateAsync({
        chatId: activeChat.id,
        employeeId: currentEmployeeId,
        content: draft.trim(),
        readAt: null,
      });
      setDraft('');
    } catch (error) {
      showToast({
        variant: 'danger',
        description: getApiErrorMessage(error, t('operation_failed')),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full min-h-0"
    >
      <div className="grid h-full min-h-[560px] overflow-hidden rounded-lg border border-light-card-border bg-white dark:border-dark-card-border dark:bg-dark-card-background md:grid-cols-[320px_1fr]">
        <aside
          className={`${activeId ? 'hidden md:flex' : 'flex'} min-h-0 flex-col border-e border-light-card-border dark:border-dark-card-border`}
        >
          <header className="flex items-center justify-between border-b border-light-card-border p-4 dark:border-dark-card-border">
            <div>
              <h1 className="text-xl font-semibold">{t('chats')}</h1>
              <p className="text-xs text-light-text-secondary dark:text-dark-secondary">
                {t('conversation_count', { count: chatItems.length })}
              </p>
            </div>
            <SquareButton
              Icon={Plus}
              ariaLabel={t('new_chat')}
              onClick={() => setCreateOpen(true)}
            />
          </header>
          <div className="p-3">
            <Input
              aria-label={t('search')}
              placeholder={t('search')}
              value={search}
              leftIcon={<MagnifyingGlass size={16} />}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {chats.isLoading ? (
              <p className="p-4 text-sm text-light-text-secondary dark:text-dark-secondary">
                {t('loading')}
              </p>
            ) : (
              chatItems.map((chat) => (
                <SecondaryButton
                  key={chat.id}
                  className={`h-auto w-full justify-start rounded-none border-0 border-b px-4 py-3 text-start dark:border-dark-card-border ${activeChat?.id === chat.id ? 'bg-gray-light-100 dark:bg-dark-card-surface' : ''}`}
                  onClick={() => setActiveId(chat.id)}
                  icon={
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light-500 text-white dark:bg-primary-dark-500">
                      <ChatCircleDots size={20} />
                    </span>
                  }
                >
                  <span className="block min-w-0">
                    <strong className="block truncate">
                      {String(chat.name ?? t('untitled_chat'))}
                    </strong>
                    <small className="block truncate text-light-text-secondary dark:text-dark-secondary">
                      {chat.isGroup
                        ? t('group_chat')
                        : (chat.projectName ?? t('direct_chat'))}
                    </small>
                  </span>
                </SecondaryButton>
              ))
            )}
          </div>
        </aside>
        <main
          className={`${activeId ? 'flex' : 'hidden md:flex'} min-h-0 flex-col bg-gray-light-100/60 dark:bg-dark-card-surface/40`}
        >
          {activeChat ? (
            <>
              <header className="flex items-center justify-between border-b border-light-card-border bg-white px-3 py-3 dark:border-dark-card-border dark:bg-dark-card-background">
                <div className="flex min-w-0 items-center gap-2">
                  <SquareButton
                    className="md:hidden"
                    Icon={ArrowLeft}
                    ariaLabel={t('back')}
                    onClick={() => setActiveId('')}
                  />
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold">
                      {String(activeChat.name ?? t('untitled_chat'))}
                    </h2>
                    <p className="truncate text-xs text-light-text-secondary dark:text-dark-secondary">
                      {activeChat.projectName ?? t('direct_chat')}
                    </p>
                  </div>
                </div>
                <SquareButton
                  Icon={UsersThree}
                  ariaLabel={t('participants')}
                  onClick={() => setParticipantsOpen(true)}
                />
              </header>
              <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4">
                {messages.isLoading ? (
                  <p className="m-auto text-sm text-light-text-secondary dark:text-dark-secondary">
                    {t('loading')}
                  </p>
                ) : sortedMessages.length ? (
                  sortedMessages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      mine={String(message.employeeId) === currentEmployeeId}
                      locale={i18n.language}
                    />
                  ))
                ) : (
                  <div className="m-auto text-center text-light-text-secondary dark:text-dark-secondary">
                    <ChatCircleDots className="mx-auto mb-2" size={34} />
                    <p>{t('no_messages')}</p>
                  </div>
                )}
              </div>
              <div className="flex items-end gap-2 border-t border-light-card-border bg-white p-3 dark:border-dark-card-border dark:bg-dark-card-background">
                <Input
                  wrapperClassName="flex-1"
                  aria-label={t('message')}
                  placeholder={t('write_message')}
                  value={draft}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      void send();
                    }
                  }}
                  onChange={(event) => setDraft(event.target.value)}
                />
                <SquareButton
                  Icon={PaperPlaneTilt}
                  ariaLabel={t('send')}
                  disabled={!draft.trim() || createMessage.isPending}
                  onClick={send}
                />
              </div>
            </>
          ) : (
            <div className="m-auto text-center text-light-text-secondary dark:text-dark-secondary">
              <ChatCircleDots className="mx-auto mb-2" size={40} />
              <p>{t('select_chat')}</p>
            </div>
          )}
        </main>
      </div>
      <CreateChatModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {activeChat && (
        <Modal
          open={participantsOpen}
          setOpen={setParticipantsOpen}
          title={t('participants')}
          contentClassName="sm:w-[850px]"
          footer={
            <SecondaryButton onClick={() => setParticipantsOpen(false)}>
              {t('close')}
            </SecondaryButton>
          }
        >
          <RelatedResourcePanel
            resourceKey="chat-participants"
            fixedValues={{ chatId: activeChat.id }}
            filters={{ ChatId: activeChat.id }}
          />
        </Modal>
      )}
    </motion.div>
  );
}

function MessageBubble({
  message,
  mine,
  locale,
}: {
  message: ResourceRecord;
  mine: boolean;
  locale: string;
}) {
  const time = message.createdAt
    ? new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(String(message.createdAt)))
    : '';
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-[82%] rounded-lg px-3 py-2 shadow-sm ${mine ? 'self-end bg-[#d9fdd3] text-gray-900 dark:bg-[#176b5b] dark:text-white' : 'self-start bg-white dark:bg-dark-card-background'}`}
    >
      <p className="whitespace-pre-wrap break-words text-sm">
        {String(message.content ?? '')}
      </p>
      <div className="mt-1 flex items-center justify-end gap-2 text-[10px] opacity-65">
        {!mine && <span>{String(message.employeeName ?? '')}</span>}
        <time>{time}</time>
      </div>
    </motion.div>
  );
}

function CreateChatModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation('chats');
  const { showToast } = useToast();
  const projects = useProjectsQuery({ Page: 1, PageSize: 100 });
  const create = useCreateResourceMutation('Chats');
  const [name, setName] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const [projectId, setProjectId] = useState('');
  const creatorId = String(getAuthUser()?.id ?? '');
  const options = (projects.data?.items ?? []).map((project) => ({
    value: project.id,
    label: project.name ?? '-',
  }));
  const valid = Boolean(name.trim() && creatorId);
  const save = async () => {
    if (!valid) return;
    try {
      await create.mutateAsync({
        name: name.trim(),
        isGroup,
        projectId: projectId || null,
        creatorId,
      });
      onClose();
    } catch (error) {
      showToast({
        variant: 'danger',
        description: getApiErrorMessage(error, t('operation_failed')),
      });
    }
  };
  return (
    <Modal
      open={open}
      setOpen={(next) => !next && onClose()}
      title={t('new_chat')}
      footer={
        <>
          <SecondaryButton onClick={onClose}>{t('cancel')}</SecondaryButton>
          <PrimaryButton
            disabled={!valid}
            isSubmitting={create.isPending}
            onClick={save}
          >
            {t('create')}
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label={t('chat_name')}
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <SelectInput
          label={t('project_optional')}
          options={options}
          isClearable
          value={options.find((option) => option.value === projectId) ?? null}
          onChange={(option) =>
            setProjectId((option as SelectOption | null)?.value ?? '')
          }
        />
        <div className="flex items-center justify-between rounded-lg border border-light-card-border p-3 dark:border-dark-card-border">
          <span className="text-sm">{t('group_chat')}</span>
          <Toggle checked={isGroup} onChange={setIsGroup} />
        </div>
      </div>
    </Modal>
  );
}
