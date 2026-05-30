/**
 * Iraq Digital Gateway (IDG)
 * Enterprise Advanced Reasoning - Answer Synthesis Engine
 * 
 * Takes the structured findings, warnings, and confidence factors of a Reasoning Engine step, 
 * synthesizing highly formatted, clean, and completely truthful legal answers with zero fabrication.
 */

import { ReasoningResult, TrustedAnswer } from './types';

export class AnswerSynthesizer {
  private static instance: AnswerSynthesizer;

  private constructor() {}

  public static getInstance(): AnswerSynthesizer {
    if (!this.instance) {
      this.instance = new AnswerSynthesizer();
    }
    return this.instance;
  }

  /**
   * Translates active reasoning results into a fully transparent trusted answer structure.
   */
  public synthesizeAnswer(
    reasoning: ReasoningResult
  ): TrustedAnswer {
    const score = reasoning.confidenceScore;
    let confidenceLabel = 'Unreliable';
    if (score >= 0.90) {
      confidenceLabel = 'Very High';
    } else if (score >= 0.75) {
      confidenceLabel = 'High';
    } else if (score >= 0.60) {
      confidenceLabel = 'Moderate';
    } else if (score >= 0.40) {
      confidenceLabel = 'Low';
    }

    // Plain text markdown reporting
    let answerText = `${reasoning.summary}\n\n`;

    answerText += `### National Knowledge Brain Findings:\n`;
    if (reasoning.findings.length > 0) {
      reasoning.findings.forEach((finding) => {
        answerText += `- ${finding}\n`;
      });
    } else {
      answerText += `- Grounded statutory references are currently limited for this custom configuration.\n`;
    }

    if (reasoning.citations.length > 0) {
      answerText += `\n### Verified Legal Citations:\n`;
      reasoning.citations.forEach((cit, idx) => {
        answerText += `${idx + 1}. ${cit.readableReference} (Verified Lineage: ${cit.lineage.join(' -> ')})\n`;
      });
    }

    // Privacy-safeguarding: purge internal paths or references from warnings
    const sanitizedWarnings = reasoning.warnings.map(w => 
      w.replace(/\/src\/[a-zA-Z0-9_\-/.]+/g, '[REDACTED_SYSTEM_SUBPATH]')
    );

    return {
      answer: answerText,
      confidenceScore: score,
      confidenceLabel,
      citations: reasoning.citations,
      warnings: sanitizedWarnings,
      evidenceCount: reasoning.evidenceUsed.length,
      generatedAt: new Date().toISOString()
    };
  }
}
