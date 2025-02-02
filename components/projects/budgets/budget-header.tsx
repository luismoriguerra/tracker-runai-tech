import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { SetBreadcrumb } from '@/components/set-breadcrumb';
import { EditableBudgetName } from './editable-budget-name';
import { EditableBudgetDescription } from './editable-budget-description';
import { BudgetActions } from './budget-actions';

interface BudgetHeaderProps {
    projectId: string;
    budgetId: string;
    budgetName: string;
    description?: string;
    estimatedAmount: number;
    onUpdate?: (updates: { name?: string; description?: string }) => void;
}

export function BudgetHeader({ projectId, budgetId, budgetName, description, estimatedAmount, onUpdate }: BudgetHeaderProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [editedName, setEditedName] = useState(budgetName);
    const [editedDescription, setEditedDescription] = useState(description || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async (field: 'name' | 'description') => {
        try {
            setIsLoading(true);
            const updates = {
                name: field === 'name' ? editedName : undefined,
                description: field === 'description' ? editedDescription : undefined,
                estimated_amount: estimatedAmount,
            };

            const response = await fetch(`/api/projects/${projectId}/budgets/${budgetId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error('Failed to update budget');
            }

            if (field === 'name') {
                setIsEditingName(false);
            } else {
                setIsEditingDescription(false);
            }

            onUpdate?.({ 
                name: field === 'name' ? editedName : undefined,
                description: field === 'description' ? editedDescription : undefined 
            });

            router.refresh();
            toast({
                title: "Success",
                description: "Budget updated successfully",
            });
        } catch (error) {
            console.error('Error updating budget:', error);
            toast({
                title: "Error",
                description: "Failed to update budget",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, field: 'name' | 'description') => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave(field);
        } else if (e.key === 'Escape') {
            if (field === 'name') {
                setEditedName(budgetName);
                setIsEditingName(false);
            } else {
                setEditedDescription(description || '');
                setIsEditingDescription(false);
            }
        }
    };

    return (
        <>
            <SetBreadcrumb breadcrumbs={[
                { route: '/projects', label: 'Projects' },
                { route: `/projects/${projectId}`, label: 'Project' },
                { route: `/projects/${projectId}/budgets/${budgetId}`, label: budgetName || 'Budget Details' }
            ]} />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
                <div className="flex flex-col flex-1 gap-1">
                    <div className="flex items-center gap-2 w-full">
                        <EditableBudgetName
                            isEditing={isEditingName}
                            editedName={editedName}
                            budgetName={budgetName}
                            isLoading={isLoading}
                            onEdit={() => {
                                setEditedName(budgetName);
                                setIsEditingName(true);
                            }}
                            onChange={setEditedName}
                            onSave={() => handleSave('name')}
                            onCancel={() => {
                                setEditedName(budgetName);
                                setIsEditingName(false);
                            }}
                            onKeyDown={(e) => handleKeyDown(e, 'name')}
                        />
                        <BudgetActions projectId={projectId} budgetId={budgetId} />
                    </div>
                    <EditableBudgetDescription
                        isEditing={isEditingDescription}
                        editedDescription={editedDescription}
                        description={description || ''}
                        isLoading={isLoading}
                        onEdit={() => {
                            setEditedDescription(description || '');
                            setIsEditingDescription(true);
                        }}
                        onChange={setEditedDescription}
                        onSave={() => handleSave('description')}
                        onCancel={() => {
                            setEditedDescription(description || '');
                            setIsEditingDescription(false);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, 'description')}
                    />
                </div>
            </div>
        </>
    );
} 