import { client } from "@/lib/rpc";
import { Card, CardContent } from "@repo/ui/components/card";

import { AddNewTask } from "@/features/tasks/components/add-new-task";
import { TaskCard } from "@/features/tasks/components/task-card";

export default async function Home() {
  const rpcClient = await client();
  const res = await rpcClient.api.tasks.$get();

  const tasksData = await res.json();
  const tasks = Array.isArray(tasksData) ? tasksData : [];

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Task Manager</h1>

        <AddNewTask />
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6 pb-6 flex justify-center">
            <p className="text-muted-foreground">
              No tasks found. Create one to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
