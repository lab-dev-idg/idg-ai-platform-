import { onSnapshot, Query, DocumentData, QuerySnapshot } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "@/services/firebase";

type ListenerId = string;

interface SharedListener<T> {
  subscribers: Set<(data: T[]) => void>;
  unsubscribe: () => void | null;
  lastData: T[] | null;
}

const listeners = new Map<ListenerId, SharedListener<unknown>>();

export function subscribeToQuery<T extends DocumentData>(
  listenerId: string,
  q: Query,
  callback: (data: T[]) => void
): () => void {
  if (!listeners.has(listenerId)) {
    const unsub = onSnapshot(q, (snapshot: QuerySnapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
      const listener = listeners.get(listenerId);
      if (listener) {
        listener.lastData = data;
        listener.subscribers.forEach(cb => cb(data));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `onSnapshot_query_${listenerId}`);
    });


    listeners.set(listenerId, {
      subscribers: new Set(),
      unsubscribe: unsub,
      lastData: null
    });
  }

  const listener = listeners.get(listenerId)!;
  listener.subscribers.add(callback);

  if (listener.lastData) {
    callback(listener.lastData);
  }

  return () => {
    listener.subscribers.delete(callback);
    if (listener.subscribers.size === 0) {
      listener.unsubscribe?.();
      listeners.delete(listenerId);
    }
  };
}
