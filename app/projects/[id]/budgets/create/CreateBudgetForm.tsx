'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CreateBudgetFormProps {
  projectId: string;
}

export default function CreateBudgetForm({ projectId }: CreateBudgetFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/budgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          estimated_amount: parseFloat(formData.amount),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create budget');
      }

      router.push(`/projects/${projectId}`);
      router.refresh();
    } catch (error) {
      console.error('Error creating budget:', error);
      alert('Failed to create budget. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Budget Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white
                   focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white
                   focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Estimated Amount
        </label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            $
          </span>
          <input
            type="number"
            id="amount"
            name="amount"
            required
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 pl-7 pr-3 py-2 text-sm text-gray-900 dark:text-white
                     focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>


      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                   bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                   rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none 
                   focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 
                   rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 
                   disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Budget'}
        </button>
      </div>
    </form>
  );
} 