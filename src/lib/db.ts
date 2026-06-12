import { supabase } from './supabase';

export type Profile = {
  id: string;
  name: string | null;
  comfort_word: string | null;
  notifications_enabled: boolean;
  theme: string;
  reduce_motion: boolean;
  high_contrast: boolean;
  created_at: string;
};

export type MoodValue =
  | 'happy'
  | 'calm'
  | 'neutral'
  | 'anxious'
  | 'distressed'
  | 'angry';

export type MoodEntry = {
  id: string;
  user_id: string;
  mood: MoodValue | null;
  energy: number | null;
  note: string | null;
  created_at: string;
};

export type Task = {
  id: string;
  user_id: string;
  title: string;
  status: 'active' | 'done';
  encouragement: string | null;
  created_at: string;
  completed_at: string | null;
};

export type Subtask = {
  id: string;
  task_id: string;
  user_id: string;
  text: string;
  done: boolean;
  position: number;
  created_at: string;
};

async function requireUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error('Not signed in yet.');
  return data.user.id;
}

// ---- Profile ----------------------------------------------------------------

export async function getProfile(): Promise<Profile | null> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export async function updateProfile(patch: Partial<Omit<Profile, 'id' | 'created_at'>>) {
  const userId = await requireUserId();
  const { error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId);
  if (error) throw error;
}

// ---- Mood / energy ----------------------------------------------------------

export async function addMoodEntry(entry: {
  mood?: MoodValue;
  energy?: number;
  note?: string;
}) {
  const userId = await requireUserId();
  const { error } = await supabase.from('mood_entries').insert({ user_id: userId, ...entry });
  if (error) throw error;
}

export async function getMoodEntries(sinceDays = 60): Promise<MoodEntry[]> {
  await requireUserId();
  const since = new Date(Date.now() - sinceDays * 86400000).toISOString();
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .gte('created_at', since)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as MoodEntry[];
}

// ---- Tasks / subtasks -------------------------------------------------------

export async function createTask(title: string): Promise<Task> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from('tasks')
    .insert({ user_id: userId, title })
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

export async function getTasks(): Promise<Task[]> {
  await requireUserId();
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Task[];
}

export async function getSubtasks(taskId: string): Promise<Subtask[]> {
  await requireUserId();
  const { data, error } = await supabase
    .from('subtasks')
    .select('*')
    .eq('task_id', taskId)
    .order('position', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Subtask[];
}

export async function setSubtaskDone(subtaskId: string, done: boolean) {
  await requireUserId();
  const { error } = await supabase.from('subtasks').update({ done }).eq('id', subtaskId);
  if (error) throw error;
}

export async function updateSubtaskText(subtaskId: string, text: string) {
  await requireUserId();
  const { error } = await supabase.from('subtasks').update({ text }).eq('id', subtaskId);
  if (error) throw error;
}

export async function saveSubtasks(taskId: string, texts: string[]) {
  const userId = await requireUserId();
  const rows = texts.map((text, position) => ({ task_id: taskId, user_id: userId, text, position }));
  const { error } = await supabase.from('subtasks').insert(rows);
  if (error) throw error;
}

export async function setTaskEncouragement(taskId: string, encouragement: string) {
  await requireUserId();
  const { error } = await supabase.from('tasks').update({ encouragement }).eq('id', taskId);
  if (error) throw error;
}

export async function getTask(taskId: string): Promise<Task | null> {
  await requireUserId();
  const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).maybeSingle();
  if (error) throw error;
  return data as Task | null;
}

export async function deleteTask(taskId: string) {
  await requireUserId();
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) throw error;
}

// ---- AI "debulking" ---------------------------------------------------------

export type DebulkResult = { subtasks: string[]; encouragement: string };

/**
 * Breaks a brain-dumped task into gentle subtasks via the Supabase `debulk` edge function.
 * Throws on failure so the UI can show a gentle error + retry.
 */
export async function debulkTask(title: string): Promise<DebulkResult> {
  const trimmed = title.trim();
  if (!trimmed) {
    throw new Error('Please enter something to break down.');
  }

  const { data, error } = await supabase.functions.invoke('debulk', {
    body: { title: trimmed },
  });

  if (error) {
    throw new Error("We couldn't reach the helper right now. Please try again.");
  }

  const payload = data as DebulkResult & { error?: string };
  if (payload?.error) {
    throw new Error(payload.error);
  }
  if (!payload?.subtasks?.length) {
    throw new Error('No steps came back. Try rephrasing your task.');
  }

  return {
    subtasks: payload.subtasks,
    encouragement: payload.encouragement?.trim() || 'One gentle step at a time.',
  };
}

export type TaskProgress = { task: Task; done: number; total: number };

export async function getTasksWithProgress(): Promise<TaskProgress[]> {
  await requireUserId();
  const [tasksRes, subsRes] = await Promise.all([
    supabase.from('tasks').select('*').order('created_at', { ascending: false }),
    supabase.from('subtasks').select('task_id, done'),
  ]);
  if (tasksRes.error) throw tasksRes.error;
  if (subsRes.error) throw subsRes.error;
  const subs = (subsRes.data ?? []) as { task_id: string; done: boolean }[];
  return (tasksRes.data ?? []).map((t) => {
    const mine = subs.filter((s) => s.task_id === (t as Task).id);
    return { task: t as Task, total: mine.length, done: mine.filter((s) => s.done).length };
  });
}

export async function completeTaskIfDone(taskId: string) {
  await requireUserId();
  const subs = await getSubtasks(taskId);
  const allDone = subs.length > 0 && subs.every((s) => s.done);
  const { error } = await supabase
    .from('tasks')
    .update({
      status: allDone ? 'done' : 'active',
      completed_at: allDone ? new Date().toISOString() : null,
    })
    .eq('id', taskId);
  if (error) throw error;
  return allDone;
}
