/**
 * Iraq Digital Gateway (IDG)
 * Phase 13-F: Adaptive Learning & Feedback Intelligence - Learning Profile Engine
 */

import { db, doc, getDoc, setDoc } from '../../firebase';
import { UserLearningProfile } from './types';
import { KnowledgeDomain } from '../knowledge/types';
import { LearningAudit } from './LearningAudit';

export class LearningProfile {
  private static instance: LearningProfile;
  private cache = new Map<string, UserLearningProfile>();
  private audit = LearningAudit.getInstance();

  private constructor() {}

  public static getInstance(): LearningProfile {
    if (!this.instance) {
      this.instance = new LearningProfile();
    }
    return this.instance;
  }

  /**
   * Initializes or returns a defaulted profile structure for the specified user boundary.
   */
  public getDefaultProfile(userId: string): UserLearningProfile {
    const domainWeights: any = {};
    Object.values(KnowledgeDomain).forEach((d) => {
      domainWeights[d] = 1.0; // Equal baseline probability weights
    });

    return {
      userId,
      preferredLanguage: 'en',
      domainWeights,
      commonIntents: {},
      successfulWorkflows: [],
      frequentlyApprovedCitations: {},
      lastActive: new Date().toISOString()
    };
  }

  /**
   * Fetches the user learning profile from cache or remote cloud store.
   */
  public async getProfile(userId: string): Promise<UserLearningProfile> {
    if (this.cache.has(userId)) {
      return this.cache.get(userId)!;
    }

    try {
      const docRef = doc(db, 'user_learning_profiles', userId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as UserLearningProfile;
        this.cache.set(userId, data);
        return data;
      }
    } catch (err) {
      console.warn(`[LEARNING-PROFILE] Failed to query centralized user learning profile.`, err);
    }

    const defaultProfile = this.getDefaultProfile(userId);
    this.cache.set(userId, defaultProfile);
    return defaultProfile;
  }

  /**
   * Directly posts updates to the user state profile.
   */
  public async saveProfile(profile: UserLearningProfile): Promise<void> {
    profile.lastActive = new Date().toISOString();
    this.cache.set(profile.userId, profile);

    try {
      const docRef = doc(db, 'user_learning_profiles', profile.userId);
      await setDoc(docRef, profile, { merge: true });
    } catch (err) {
      console.warn(`[LEARNING-PROFILE] Firebase sync error while saving user profile. Cached offline.`, err);
    }
  }

  /**
   * Increments affinity preferences based on active interaction nodes.
   */
  public async recordInteraction(
    userId: string,
    event: {
      language?: 'ku' | 'ar' | 'en';
      domain?: KnowledgeDomain;
      intent?: string;
      workflowId?: string;
      workflowSuccess?: boolean;
      approvedCitationDocId?: string;
    }
  ): Promise<UserLearningProfile> {
    const profile = await this.getProfile(userId);

    let profileModified = false;

    if (event.language) {
      profile.preferredLanguage = event.language;
      profileModified = true;
    }

    if (event.domain) {
      const currentVal = profile.domainWeights[event.domain] || 1.0;
      profile.domainWeights[event.domain] = parseFloat((currentVal + 0.1).toFixed(3));
      profileModified = true;
    }

    if (event.intent) {
      const currentVal = profile.commonIntents[event.intent] || 0;
      profile.commonIntents[event.intent] = currentVal + 1;
      profileModified = true;
    }

    if (event.workflowId && event.workflowSuccess) {
      if (!profile.successfulWorkflows.includes(event.workflowId)) {
        profile.successfulWorkflows.push(event.workflowId);
        profileModified = true;
      }
    }

    if (event.approvedCitationDocId) {
      const currentVal = profile.frequentlyApprovedCitations[event.approvedCitationDocId] || 0;
      profile.frequentlyApprovedCitations[event.approvedCitationDocId] = currentVal + 1;
      profileModified = true;
    }

    if (profileModified) {
      await this.saveProfile(profile);
      await this.audit.logEvent(
        'OPTIMIZATION_EVENT',
        'LearningProfile',
        `Adjusted learning profile parameters for user "${userId}".`,
        { userId, changedFields: Object.keys(event) }
      );
    }

    return profile;
  }
}
