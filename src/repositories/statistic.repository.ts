import { dbConnect } from '@/database/mongo';
import { normalizeId } from '@/lib/normalizer';

import type { StatisticDocument } from '@/models/statistic.model';
import StatisticModel from '@/models/statistic.model';

class StatisticRepository {
  async incrementCreatedLinks(date: Date) {
    await dbConnect();

    const document = await StatisticModel.findOneAndUpdate(
      { date },
      { $inc: { totalLinksCreated: 1 } },
      { new: true, upsert: true },
    ).lean<StatisticDocument>();

    return document ? normalizeId(document) : null;
  }

  async incrementDeletedLinks(date: Date) {
    await dbConnect();

    const document = await StatisticModel.findOneAndUpdate(
      { date },
      { $inc: { totalLinksDeleted: 1 } },
      { new: true, upsert: true },
    ).lean<StatisticDocument>();

    return document ? normalizeId(document) : null;
  }

  async incrementTotalClicks(date: Date) {
    await dbConnect();

    const document = await StatisticModel.findOneAndUpdate(
      { date },
      { $inc: { totalClicks: 1 } },
      { new: true, upsert: true },
    ).lean<StatisticDocument>();

    return document ? normalizeId(document) : null;
  }
}

export const statisticRepository = new StatisticRepository();
