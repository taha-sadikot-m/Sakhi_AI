
import React, { useState, useCallback } from 'react';
import { TextAreaInput } from '../common/TextAreaInput';
import { QnAResponseDisplay } from './QnAResponseDisplay';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorMessage } from '../ErrorMessage';
import { Card } from '../common/Card';
import { askFinancialQuestion } from '../../services/geminiService';
import { AIResponse } from '../../types';

export const QnASection: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitQuery = useCallback(async () => {
    if (!query.trim()) {
      setError("Please enter a question.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResponse(null);
    try {
      const aiRes = await askFinancialQuestion(query);
      setResponse(aiRes);
    } catch (err) {
      setError((err as Error).message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  return (
    <Card className="max-w-3xl mx-auto bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <TextAreaInput
        id="financial-query"
        label="Ask Your Financial Question"
        value={query}
        onChange={setQuery}
        onSubmit={handleSubmitQuery}
        placeholder="E.g., How can I start investing in mutual funds? What is financial planning?"
        isLoading={isLoading}
        buttonText="Get Answer"
        rows={3}
      />
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {response && <QnAResponseDisplay response={response} />}
    </Card>
  );
};
