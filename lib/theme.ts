  // lib/theme.ts
  import prisma from '@/lib/prisma';

  export async function getCurrentTheme() {
    const theme = await prisma.theme.findFirst({
      where: { isActive: true },
    });

    return theme || null;
  }

  export async function setActiveTheme(themeId: string) {
    await prisma.$transaction([
      prisma.theme.updateMany({ data: { isActive: false } }),
      prisma.theme.update({
        where: { id: themeId },
        data: { isActive: true },
      }),
    ]);
  }