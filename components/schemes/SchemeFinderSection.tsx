
import React, { useState, useCallback } from 'react';
import { TextAreaInput } from '../common/TextAreaInput';
import { SchemeListDisplay } from './SchemeListDisplay';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorMessage } from '../ErrorMessage';
import { Card } from '../common/Card';
import { findSchemes } from '../../services/geminiService';
import { AIResponse } from '../../types';

export const SchemeFinderSection: React.FC = () => {
  const [details, setDetails] = useState<string>('');
  const [schemes, setSchemes] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitDetails = useCallback(async () => {
    if (!details.trim()) {
      setError("Please enter details about your needs or business.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSchemes(null);
    try {
      const aiRes = await findSchemes(details);
      setSchemes(aiRes);
    } catch (err) {
      setError((err as Error).message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [details]);

  return (
    <Card className="max-w-3xl mx-auto bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50">
      <TextAreaInput
        id="scheme-details"
        label="Describe Your Business or Needs"
        value={details}
        onChange={setDetails}
        onSubmit={handleSubmitDetails}
        placeholder="E.g., I want to start a small tailoring business from home. I am looking for educational support for my daughter."
        isLoading={isLoading}
        buttonText="Find Schemes"
        rows={5}
      />
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {schemes && <SchemeListDisplay response={schemes} />}
    </Card>
  );
};
