import type { ResourceConfig, ResourceField } from './service';

const text = (key: string, table = false, required = false): ResourceField => ({
  key,
  type: 'text',
  table,
  required,
});
const area = (key: string, table = false): ResourceField => ({
  key,
  type: 'textarea',
  table,
});
const number = (
  key: string,
  table = false,
  required = false
): ResourceField => ({ key, type: 'number', table, required });
const date = (key: string, table = false, required = false): ResourceField => ({
  key,
  type: 'date',
  table,
  required,
});
const datetime = (key: string, table = false): ResourceField => ({
  key,
  type: 'datetime-local',
  table,
});
const boolean = (key: string, table = false): ResourceField => ({
  key,
  type: 'boolean',
  table,
});
const relation = (
  key: string,
  resource: string,
  labelKey = 'name',
  required = true,
  table = false
): ResourceField => ({
  key,
  type: 'relation',
  required,
  table,
  relation: { resource, labelKey },
});

export const MANAGEMENT_RESOURCES: ResourceConfig[] = [
  {
    key: 'alerts',
    endpoint: 'Alerts',
    fields: [
      text('name', true, true),
      relation('senderId', 'Users'),
      area('content', true),
      boolean('showOnLogin', true),
      number('showDays', true),
    ],
    children: [
      {
        resourceKey: 'alert-employees',
        fieldKey: 'alertId',
        filterKey: 'AlertId',
      },
      { resourceKey: 'alertables', fieldKey: 'alertId', filterKey: 'AlertId' },
    ],
  },
  {
    key: 'alert-employees',
    endpoint: 'AlertEmployees',
    fields: [
      relation('alertId', 'Alerts'),
      relation('employeeId', 'Users'),
      datetime('readAt', true),
    ],
  },
  {
    key: 'alertables',
    endpoint: 'Alertables',
    fields: [
      relation('alertId', 'Alerts'),
      text('alertableType', true, true),
      text('alertableId', true, true),
    ],
  },
  {
    key: 'cashiers',
    endpoint: 'Cashiers',
    fields: [
      text('no', true),
      text('name', true, true),
      boolean('default', true),
      number('initialBalance', true, true),
    ],
  },
  {
    key: 'chats',
    endpoint: 'Chats',
    fields: [
      text('name', true, true),
      boolean('isGroup', true),
      relation('projectId', 'Projects', 'name', false, true),
      relation('creatorId', 'Users'),
    ],
    children: [
      {
        resourceKey: 'chat-participants',
        fieldKey: 'chatId',
        filterKey: 'ChatId',
      },
      { resourceKey: 'messages', fieldKey: 'chatId', filterKey: 'ChatId' },
    ],
  },
  {
    key: 'chat-participants',
    endpoint: 'ChatParticipants',
    fields: [
      relation('chatId', 'Chats'),
      relation('employeeId', 'Users'),
      boolean('deleteStatus', true),
    ],
  },
  {
    key: 'messages',
    endpoint: 'Messages',
    fields: [
      relation('chatId', 'Chats'),
      relation('employeeId', 'Users'),
      area('content', true),
      datetime('readAt', true),
    ],
    children: [
      {
        resourceKey: 'message-reads',
        fieldKey: 'messageId',
        filterKey: 'MessageId',
      },
    ],
  },
  {
    key: 'message-reads',
    endpoint: 'MessageReads',
    fields: [
      relation('messageId', 'Messages', 'content'),
      relation('employeeId', 'Users'),
      datetime('readAt', true),
    ],
  },
  {
    key: 'customers',
    endpoint: 'Customers',
    fields: [
      text('name', true, true),
      text('phoneNumber', true),
      text('countryCode', true),
      relation('stateId', 'States', 'name', false, true),
      relation('professionId', 'Professions', 'name', false, true),
      relation('systemId', 'SoftwareSystems', 'name', false, true),
      date('birthday', true),
    ],
  },
  {
    key: 'media',
    endpoint: 'Media',
    fields: [
      text('modelType', true, true),
      text('modelId', true, true),
      text('uuid'),
      text('collectionName', true),
      text('fileName', true, true),
      text('disk'),
      number('size', true, true),
    ],
  },
  {
    key: 'notes',
    endpoint: 'Notes',
    fields: [
      relation('employeeId', 'Users'),
      text('title', true, true),
      area('description', true),
      text('time', true),
      date('date', true),
      boolean('isCompleted', true),
    ],
  },
  {
    key: 'notifications',
    endpoint: 'Notifications',
    fields: [
      relation('employeeId', 'Users'),
      text('type', true),
      text('title', true, true),
      area('body', true),
      text('translationType'),
      area('data'),
      datetime('readAt', true),
    ],
  },
  {
    key: 'occasions',
    endpoint: 'Occasions',
    fields: [
      text('title', true, true),
      area('description', true),
      date('occasionDate', true, true),
      text('occasionType', true),
      boolean('showOnLogin', true),
      number('showDays', true),
    ],
    children: [
      {
        resourceKey: 'occasionables',
        fieldKey: 'occasionId',
        filterKey: 'OccasionId',
      },
    ],
  },
  {
    key: 'occasionables',
    endpoint: 'Occasionables',
    fields: [
      relation('occasionId', 'Occasions', 'title'),
      text('occasionableType', true, true),
      text('occasionableId', true, true),
    ],
  },
  {
    key: 'onesignal-subscriptions',
    endpoint: 'OnesignalSubscriptions',
    fields: [
      relation('employeeId', 'Users'),
      text('onesignalId', true, true),
      text('device', true),
      boolean('isActive', true),
    ],
  },
  {
    key: 'professions',
    endpoint: 'Professions',
    fields: [text('name', true, true)],
  },
  {
    key: 'project-members',
    endpoint: 'ProjectMembers',
    fields: [
      relation('projectId', 'Projects', 'name', true, true),
      relation('employeeId', 'Users', 'name', true, true),
      relation('addedBy', 'Users', 'name', false),
    ],
  },
  {
    key: 'quotations',
    endpoint: 'Quotations',
    fields: [text('title', true, true)],
    children: [
      {
        resourceKey: 'quotation-sections',
        fieldKey: 'quotationId',
        filterKey: 'QuotationId',
      },
    ],
  },
  {
    key: 'quotation-sections',
    endpoint: 'QuotationSections',
    fields: [
      relation('quotationId', 'Quotations', 'title', true, true),
      relation('parentId', 'QuotationSections', 'title', false),
      text('title', true, true),
      number('sortOrder', true, true),
      area('settings'),
    ],
    children: [
      {
        resourceKey: 'quotation-blocks',
        fieldKey: 'sectionId',
        filterKey: 'SectionId',
      },
    ],
  },
  {
    key: 'quotation-blocks',
    endpoint: 'QuotationBlocks',
    fields: [
      relation('sectionId', 'QuotationSections', 'title', true, true),
      text('type', true, true),
      number('sortOrder', true, true),
      area('data', true),
      area('settings'),
    ],
  },
  {
    key: 'software-systems',
    endpoint: 'SoftwareSystems',
    fields: [text('name', true, true), text('value', true, true)],
  },
  { key: 'states', endpoint: 'States', fields: [text('name', true, true)] },
  {
    key: 'tags',
    endpoint: 'Tags',
    fields: [text('name', true, true)],
    children: [
      { resourceKey: 'tag-tasks', fieldKey: 'tagId', filterKey: 'TagId' },
    ],
  },
  {
    key: 'tag-tasks',
    endpoint: 'TagTasks',
    fields: [
      relation('taskId', 'Tasks', 'name', true, true),
      relation('tagId', 'Tags', 'name', true, true),
    ],
  },
  {
    key: 'task-disbursements',
    endpoint: 'TaskDisbursements',
    fields: [
      text('referenceNo', true),
      date('disbursementDate', true, true),
      number('totalAmount', true, true),
      area('note', true),
      relation('employeeId', 'Users', 'name', true, true),
    ],
    children: [
      {
        resourceKey: 'task-disbursement-items',
        fieldKey: 'taskDisbursementId',
        filterKey: 'TaskDisbursementId',
      },
    ],
  },
  {
    key: 'task-disbursement-items',
    endpoint: 'TaskDisbursementItems',
    fields: [
      relation('taskId', 'Tasks', 'name', true, true),
      relation(
        'taskDisbursementId',
        'TaskDisbursements',
        'referenceNo',
        true,
        true
      ),
      number('amount', true, true),
    ],
  },
  {
    key: 'task-discussions',
    endpoint: 'TaskDiscussions',
    fields: [
      relation('taskId', 'Tasks', 'name', true, true),
      relation('employeeId', 'Users'),
      area('text', true),
      datetime('readAt'),
    ],
    children: [
      {
        resourceKey: 'task-discussion-reads',
        fieldKey: 'taskDiscussionId',
        filterKey: 'TaskDiscussionId',
      },
    ],
  },
  {
    key: 'task-discussion-reads',
    endpoint: 'TaskDiscussionReads',
    fields: [
      relation('taskDiscussionId', 'TaskDiscussions', 'text'),
      relation('employeeId', 'Users'),
      datetime('readAt', true),
    ],
  },
  {
    key: 'task-followers',
    endpoint: 'TaskFollowers',
    fields: [
      relation('taskId', 'Tasks', 'name', true, true),
      relation('employeeId', 'Users', 'name', true, true),
      boolean('requiresApproval', true),
      boolean('approved', true),
    ],
  },
  {
    key: 'task-logs',
    endpoint: 'TaskLogs',
    fields: [
      relation('taskId', 'Tasks', 'name', true, true),
      relation('employeeId', 'Users', 'name', false, true),
      text('action', true),
      area('oldValue'),
      area('newValue'),
      area('reason', true),
      area('metadata'),
    ],
  },
  {
    key: 'task-prices',
    endpoint: 'TaskPrices',
    fields: [
      relation('taskId', 'Tasks', 'name', true, true),
      relation('employeeId', 'Users', 'name', true, true),
      number('amount', true, true),
      text('developerApproved', true),
      text('adminApproved', true),
      boolean('isCurrent', true),
      area('note'),
    ],
  },
];

export const getManagementResource = (key?: string) =>
  MANAGEMENT_RESOURCES.find((resource) => resource.key === key);
