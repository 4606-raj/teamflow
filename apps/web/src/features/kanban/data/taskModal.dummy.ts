// Placeholder data for the create-task modal until parent/subtask, comment and
// activity APIs exist. Replace with real queries; shapes are kept minimal.

export interface DummyComment {
  id: string;
  author: string;
  createdAt: string;
  body: string;
}

export interface DummyActivity {
  id: string;
  actor: string;
  action: string;
  createdAt: string;
}

export const dummyComments: DummyComment[] = [
  { id: 'c-1', author: 'Howard Stanley', createdAt: '2 hours ago', body: 'Let\'s split this into smaller subtasks so it can be reviewed in parts.' },
  { id: 'c-2', author: 'Super Admin', createdAt: 'Yesterday', body: 'Design is approved. Please follow the latest spec in the project docs.' },
];

export const dummyActivity: DummyActivity[] = [
  { id: 'a-1', actor: 'Super Admin', action: 'created this task', createdAt: 'Yesterday, 4:12 PM' },
  { id: 'a-2', actor: 'Howard Stanley', action: 'changed the assignee to Super Admin', createdAt: 'Yesterday, 5:40 PM' },
  { id: 'a-3', actor: 'Howard Stanley', action: 'moved the task from Todo to In Progress', createdAt: 'Today, 9:05 AM' },
];
