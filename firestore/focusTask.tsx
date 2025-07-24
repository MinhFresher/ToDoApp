import { addDoc, collection } from 'firebase/firestore';
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