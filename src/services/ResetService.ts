import { deleteDoc, doc, increment, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * [ADM-8] Reset a player's progress: `runId + 1` and delete `saves/{uid}`.
 * Old events stay; they belong to the previous run. Admin only (rules).
 */
export async function resetProgress(uid: string): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { runId: increment(1) });
  await deleteDoc(doc(db, 'saves', uid));
}
