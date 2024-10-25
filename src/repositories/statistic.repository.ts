import { db } from '@/database/drizzle';
import { statsTable, type SelectStat } from '@/database/schema';
import { eq } from 'drizzle-orm';

class StatisticRepository {
  async incrementCreatedLinks(date: SelectStat['date']) {
    const [existingRecord] = await db
      .select()
      .from(statsTable)
      .where(eq(statsTable.date, date))
      .limit(1);

    if (existingRecord) {
      await db
        .update(statsTable)
        .set({
          ...existingRecord,
          totalLinksCreated: existingRecord.totalLinksCreated + 1,
        })
        .where(eq(statsTable.date, date));
    } else {
      await db.insert(statsTable).values({
        date,
        totalLinksCreated: 1,
      });
    }
  }

  async incrementDeletedLinks(date: Date) {
    const [existingRecord] = await db
      .select()
      .from(statsTable)
      .where(eq(statsTable.date, date))
      .limit(1);

    if (existingRecord) {
      await db
        .update(statsTable)
        .set({
          ...existingRecord,
          totalLinksDeleted: existingRecord.totalLinksDeleted + 1,
        })
        .where(eq(statsTable.date, date));
    } else {
      await db.insert(statsTable).values({
        date,
        totalLinksDeleted: 1,
      });
    }
  }

  async incrementTotalClicks(date: Date) {
    const [existingRecord] = await db
      .select()
      .from(statsTable)
      .where(eq(statsTable.date, date))
      .limit(1);

    if (existingRecord) {
      await db
        .update(statsTable)
        .set({
          ...existingRecord,
          totalClicks: existingRecord.totalClicks + 1,
        })
        .where(eq(statsTable.date, date));
    } else {
      await db.insert(statsTable).values({
        date,
        totalClicks: 1,
      });
    }
  }
}

export const statisticRepository = new StatisticRepository();
