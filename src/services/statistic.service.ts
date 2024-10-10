import { statisticRepository } from '@/repositories/statistic.repository';
import { getTodayDate } from '@/helpers/date';

export async function incrementCreatedLinks() {
  const today = getTodayDate();

  const res = await statisticRepository.incrementCreatedLinks(today);

  return res;
}

export async function incrementDeletedLinks() {
  const today = getTodayDate();

  const res = await statisticRepository.incrementDeletedLinks(today);

  return res;
}

export async function incrementTotalClicks() {
  const today = getTodayDate();

  const res = await statisticRepository.incrementTotalClicks(today);

  return res;
}
