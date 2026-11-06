import { MongoClient } from "mongodb";

type ClickDoc = { _id: string; count: number; updatedAt?: Date };

const globalForMongo = globalThis as unknown as {
  mongoClientPromise?: Promise<MongoClient>;
};

// 개발 모드의 핫 리로드마다 연결이 새로 생기지 않도록 전역에 보관한다.
function getClient(): Promise<MongoClient> | null {
  const uri = process.env.MONGO_URL;
  if (!uri) return null;
  if (!globalForMongo.mongoClientPromise) {
    globalForMongo.mongoClientPromise = new MongoClient(uri).connect();
  }
  return globalForMongo.mongoClientPromise;
}

async function getClicksCollection() {
  const clientPromise = getClient();
  if (!clientPromise) return null;
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB ?? "linknamu").collection<ClickDoc>("clicks");
}

// 링크 클릭 수를 1 올린다. MONGO_URL이 없거나 실패하면 false를 돌려준다.
export async function incrementClick(linkId: string): Promise<boolean> {
  try {
    const clicks = await getClicksCollection();
    if (!clicks) return false;
    await clicks.updateOne(
      { _id: linkId },
      { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
      { upsert: true },
    );
    return true;
  } catch (error) {
    console.error("[clicks] 클릭 수 기록 실패:", error);
    globalForMongo.mongoClientPromise = undefined;
    return false;
  }
}

export type ClickStat = { count: number; updatedAt: Date | null };

// 여러 링크의 클릭 수와 마지막 클릭 시각을 한 번의 쿼리로 가져온다. 기록이 없는 링크는 0.
// MONGO_URL이 없거나 실패하면 null을 돌려준다. (관리자 페이지 전용)
export async function getClickStats(linkIds: string[]): Promise<Record<string, ClickStat> | null> {
  try {
    const clicks = await getClicksCollection();
    if (!clicks) return null;
    const docs = await clicks.find({ _id: { $in: linkIds } }).toArray();
    const stats: Record<string, ClickStat> = Object.fromEntries(
      linkIds.map((id) => [id, { count: 0, updatedAt: null }]),
    );
    for (const doc of docs) stats[doc._id] = { count: doc.count, updatedAt: doc.updatedAt ?? null };
    return stats;
  } catch (error) {
    console.error("[clicks] 클릭 수 조회 실패:", error);
    globalForMongo.mongoClientPromise = undefined;
    return null;
  }
}
