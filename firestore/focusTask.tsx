import { addDoc, getDocs, collection, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

type SaveFocusParams = {
  taskId: string;
  taskName: string;
  startTime: number;
  endTime: number;
  durationInSeconds: number;
};

export const saveFocusSession = async ({
  taskId,
  taskName,
  startTime,
  endTime,
  durationInSeconds,
}: SaveFocusParams) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  try {
    await addDoc(collection(db, 'focusSessions'), {
      uid,
      taskId,
      taskName,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      durationInSeconds,
      createdAt: new Date(),
    });
    console.log('Focus session saved!');
  } catch (err) {
    console.error('❌ Failed to save focus session:', err);
  }
};

export const getFocusSessions = async () => {
  const uid = auth.currentUser?.uid;
  if (!uid) return [];

  try {
    const q = query(
      collection(db, 'focusSessions'),
      where('uid', '==', uid),
      orderBy('startTime', 'desc') 
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        taskName: data.taskName,
        startTime: data.startTime.toDate(),
        endTime: data.endTime.toDate(),
        durationInSeconds: data.durationInSeconds,
      };
    });
  } catch (err) {
    console.error('❌ Failed to fetch focus sessions:', err);
    return [];
  }
};