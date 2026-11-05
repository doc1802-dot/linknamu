import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClientPromise?: Promise<MongoClient>;
};

// 개발 모드의 핫 리로드마다 연결이 새로 생기지 않도록 전역에 보관한다.
function getClient(): Promise<MongoClient> | null {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (!globalForMongo.mongoClientPromise) {
    globalForMongo.mongoClientPromise = new MongoClient(uri).connect();
  }
  return globalForMongo.mongoClientPromise;
}

// 링크 클릭 수를 1 올린다. MONGODB_URI가 없거나 실패하면 false를 돌려준다.
export async function incrementClick(linkId: string): Promise<boolean> {
  const clientPromise = getClient();
  if (!clientPromise) return false;
  try {
    const client = await clientPromise;
    await client
      .db(process.env.MONGODB_DB ?? "linknamu")
      .collection<{ _id: string; count: number }>("clicks")
      .updateOne(
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
