import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { BudgetExpenseService } from '@/server/domain/budget_expense';
import { ProjectBudgetService } from '@/server/domain/budget';

export const runtime = 'edge';

const budgetExpenseService = new BudgetExpenseService();
const budgetService = new ProjectBudgetService();

// Helper function to validate ISO date format (YYYY-MM-DD)
function isValidISODate(dateStr: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date.getTime());
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        const userId = session?.user.sub;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');
        const description = searchParams.get('description')?.toLowerCase();
        const name = searchParams.get('name')?.toLowerCase();
        const budgetName = searchParams.get('budgetName')?.toLowerCase();
        const budgetId = searchParams.get('budgetId');
        const sortBy = searchParams.get('sortBy') || 'expense_date';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');

        // Validate pagination parameters
        if (isNaN(page) || page < 1) {
            return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });
        }
        if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
            return NextResponse.json({ error: 'Invalid page size (must be between 1 and 100)' }, { status: 400 });
        }

        // Validate date parameters if provided
        if ((startDate && !isValidISODate(startDate)) || (endDate && !isValidISODate(endDate))) {
            return NextResponse.json({ 
                error: 'Invalid date format. Use ISO format (YYYY-MM-DD)' 
            }, { status: 400 });
        }

        // Validate sort parameters
        const validSortColumns = ['expense_date', 'name', 'amount', 'status', 'description'];
        const validSortOrders = ['asc', 'desc'];
        
        if (!validSortColumns.includes(sortBy)) {
            return NextResponse.json({ error: 'Invalid sort column' }, { status: 400 });
        }
        if (!validSortOrders.includes(sortOrder)) {
            return NextResponse.json({ error: 'Invalid sort order' }, { status: 400 });
        }

        // First get all budgets for the project
        const budgets = await budgetService.getBudgets(params.id);
        
        // Filter budgets by name if budgetName is provided
        let filteredBudgets = budgets;
        if (budgetName) {
            filteredBudgets = budgets.filter(budget => budget.name.toLowerCase().includes(budgetName));
        }
        if (budgetId) {
            filteredBudgets = budgets.filter(budget => budget.id === budgetId);
        }

        // Get all expenses and combine with budget details
        const expensesPromises = filteredBudgets.map(async (budget) => {
            const expenses = await budgetExpenseService.getBudgetExpenses(budget.id);
            return expenses.map(expense => ({
                ...expense,
                budget: {
                    id: budget.id,
                    name: budget.name,
                    description: budget.description,
                    estimated_amount: budget.estimated_amount
                }
            }));
        });

        const expensesByBudget = await Promise.all(expensesPromises);
        // Flatten the array of arrays into a single array of expenses
        let allExpenses = expensesByBudget.flat();

        // Apply filters
        if (status) {
            allExpenses = allExpenses.filter(expense => expense.status === status);
        }
        if (description) {
            allExpenses = allExpenses.filter(expense => 
                expense.description.toLowerCase().includes(description)
            );
        }
        if (name) {
            allExpenses = allExpenses.filter(expense => 
                expense.name.toLowerCase().includes(name)
            );
        }
        // Apply date range filter
        if (startDate || endDate) {
            allExpenses = allExpenses.filter(expense => {
                const expenseDate = new Date(expense.expense_date);
                if (startDate && endDate) {
                    return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
                } else if (startDate) {
                    return expenseDate >= new Date(startDate);
                } else if (endDate) {
                    return expenseDate <= new Date(endDate);
                }
                return true;
            });
        }

        // Apply sorting
        allExpenses.sort((a, b) => {
            const aValue = a[sortBy as keyof typeof a];
            const bValue = b[sortBy as keyof typeof b];
            
            // Handle cases where values might be undefined
            if (aValue === undefined && bValue === undefined) return 0;
            if (aValue === undefined) return 1;
            if (bValue === undefined) return -1;
            
            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
            }
        });

        // Calculate total amount
        const totalAmount = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);

        // Apply pagination
        const totalItems = allExpenses.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedExpenses = allExpenses.slice(startIndex, endIndex);

        // Prepare metadata about applied filters
        const appliedFilters = {
            status: status || null,
            description: description || null,
            name: name || null,
            budgetName: budgetName || null,
            budgetId: budgetId || null,
            dateRange: {
                startDate: startDate || null,
                endDate: endDate || null
            }
        };

        // Prepare response with metadata
        const response = {
            data: paginatedExpenses,
            metadata: {
                total_count: totalItems,
                total_amount: totalAmount,
                filters: appliedFilters,
                sorting: {
                    column: sortBy,
                    order: sortOrder
                },
                pagination: {
                    page,
                    pageSize,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1
                }
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching budget expenses:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 