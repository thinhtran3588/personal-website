"use client";

import { doc, getDoc, setDoc, type Firestore } from "firebase/firestore";

import type { UserSettingsRepository } from "@/modules/settings/domain/interfaces";
import type { UserSettings } from "@/modules/settings/domain/types";

const COLLECTION_ID = "user-settings";

export type GetFirestoreInstance = () => Firestore | null;

export class FirestoreUserSettingsRepository implements UserSettingsRepository {
  constructor(private readonly getFirestoreInstance: GetFirestoreInstance) {}

  async get(userId: string): Promise<UserSettings | null> {
    const db = this.getFirestoreInstance();
    if (!db) return null;
    const ref = doc(db, COLLECTION_ID, userId);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null;
    const data = snapshot.data();
    return {
      locale: data.locale,
      theme: data.theme,
    };
  }

  async set(userId: string, settings: UserSettings): Promise<void> {
    const db = this.getFirestoreInstance();
    if (!db) return;
    const ref = doc(db, COLLECTION_ID, userId);
    await setDoc(ref, {
      locale: settings.locale ?? null,
      theme: settings.theme ?? null,
    });
  }
}
