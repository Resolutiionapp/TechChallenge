import { TaskBoard } from '../components/task-board';

const DEFAULT_WORKSPACE_ID = 'ws-1';

export default function HomePage() {
  return (
    <main>
      <h1>Task Tracker</h1>
      <TaskBoard workspaceId={DEFAULT_WORKSPACE_ID} />
    </main>
  );
}
