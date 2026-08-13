import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const product = await prisma.workspace.create({ data: { id: 'ws-1', name: 'Product' } });
  const platform = await prisma.workspace.create({ data: { id: 'ws-2', name: 'Platform' } });

  await prisma.task.createMany({
    data: [
      { id: 'task-1', workspaceId: product.id, title: 'Design onboarding flow', status: 'todo' },
      {
        id: 'task-2',
        workspaceId: product.id,
        title: 'Fix checkout bug',
        status: 'in_progress',
        assignee: 'alice',
      },
      { id: 'task-3', workspaceId: platform.id, title: 'Rotate deploy keys', status: 'todo' },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
