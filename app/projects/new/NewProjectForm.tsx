'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProjectForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const expense_estimation = parseFloat(formData.get('expense_estimation') as string) || 0;

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, expense_estimation }),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const project = await response.json();
      router.push(`/projects/${project.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Project Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter project name"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          required
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter project description"
        />
      </div>

      <div>
        <label
          htmlFor="expense_estimation"
          className="block text-sm font-medium text-gray-700"
        >
          Expense Estimation
        </label>
        <input
          type="number"
          name="expense_estimation"
          id="expense_estimation"
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter estimated expenses"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Link
          href="/projects"
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </button>
      </div>
    </form>
  );
} 