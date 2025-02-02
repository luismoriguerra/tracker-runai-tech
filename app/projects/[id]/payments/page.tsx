'use client';

export const runtime = 'edge';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, Pencil, Trash2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { SetBreadcrumb } from '@/components/set-breadcrumb';
import { useToast } from '@/hooks/use-toast';

interface Payment {
    id: string;
    payment_date: string;
    amount: number;
    status: 'pending' | 'paid';
}

const paymentSchema = z.object({
    payment_date: z.string(),
    amount: z.number().positive(),
});

export default function ProjectPaymentsPage() {
    const { id } = useParams();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newPayment, setNewPayment] = useState({
        payment_date: format(new Date(), 'yyyy-MM-dd'),
        amount: 0,
        status: 'pending' as const,
    });
    const [editPayment, setEditPayment] = useState<Payment | null>(null);
    const { toast } = useToast();

    const fetchPayments = useCallback(async () => {
        try {
            const response = await fetch(`/api/projects/${id}/payments`);
            if (!response.ok) throw new Error('Failed to fetch payments');
            const data = await response.json();
            setPayments(data);
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast({
                title: "Error",
                description: "Failed to fetch payments",
                variant: "destructive",
            });
        }
    }, [id, toast]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const handleAddPayment = async () => {
        try {
            const validatedData = paymentSchema.parse(newPayment);
            const response = await fetch(`/api/projects/${id}/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validatedData),
            });
            if (!response.ok) throw new Error('Failed to add payment');
            setIsAddingNew(false);
            setNewPayment({ payment_date: format(new Date(), 'yyyy-MM-dd'), amount: 0, status: 'pending' });
            fetchPayments();
            toast({
                title: "Success",
                description: "Payment added successfully",
            });
        } catch (error) {
            console.error('Error adding payment:', error);
            toast({
                title: "Error",
                description: error instanceof z.ZodError ? "Invalid payment data" : "Failed to add payment",
                variant: "destructive",
            });
        }
    };

    const handleUpdatePayment = async (paymentId: string) => {
        if (!editPayment) return;
        try {
            const validatedData = paymentSchema.parse(editPayment);
            const response = await fetch(`/api/projects/${id}/payments`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, ...validatedData }),
            });
            if (!response.ok) throw new Error('Failed to update payment');
            setEditingId(null);
            setEditPayment(null);
            fetchPayments();
            toast({
                title: "Success",
                description: "Payment updated successfully",
            });
        } catch (error) {
            console.error('Error updating payment:', error);
            toast({
                title: "Error",
                description: error instanceof z.ZodError ? "Invalid payment data" : "Failed to update payment",
                variant: "destructive",
            });
        }
    };

    const handleDeletePayment = async () => {
        if (!deleteId) return;
        try {
            const response = await fetch(`/api/projects/${id}/payments`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId: deleteId }),
            });
            if (!response.ok) throw new Error('Failed to delete payment');
            setDeleteId(null);
            fetchPayments();
            toast({
                title: "Success",
                description: "Payment deleted successfully",
            });
        } catch (error) {
            console.error('Error deleting payment:', error);
            toast({
                title: "Error",
                description: "Failed to delete payment",
                variant: "destructive",
            });
        }
    };

    const handleStatusChange = async (paymentId: string, checked: boolean) => {
        try {
            const response = await fetch(`/api/projects/${id}/payments`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentId,
                    status: checked ? 'paid' : 'pending',
                }),
            });
            if (!response.ok) throw new Error('Failed to update payment status');
            fetchPayments();
            toast({
                title: "Success",
                description: "Payment status updated successfully",
            });
        } catch (error) {
            console.error('Error updating payment status:', error);
            toast({
                title: "Error",
                description: "Failed to update payment status",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto py-6">
            <SetBreadcrumb breadcrumbs={[
                { route: '/projects', label: 'Projects' },
                { route: `/projects/${id}`, label: 'Project Payments' },
                { route: `/projects/${id}/payments`, label: 'Payments' }
            ]} />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Project Payments</h1>
                <Button onClick={() => setIsAddingNew(true)}>Add Payment</Button>
            </div>

            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Total Paid</h3>
                            <p className="text-2xl font-bold text-green-600">
                                ${payments
                                    .filter(p => p.status === 'paid')
                                    .reduce((sum, p) => sum + p.amount, 0)
                                    .toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                            <p className="text-2xl font-bold">
                                ${payments
                                    .reduce((sum, p) => sum + p.amount, 0)
                                    .toFixed(2)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {isAddingNew && (
                    <Card>
                        <CardContent className="flex items-center space-x-4 p-4">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {newPayment.payment_date}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={parseISO(newPayment.payment_date)}
                                        onSelect={(date) => {
                                            setNewPayment({
                                                ...newPayment,
                                                payment_date: format(date || new Date(), 'yyyy-MM-dd'),
                                            })
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <Input
                                type="number"
                                value={newPayment.amount}
                                onChange={(e) =>
                                    setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })
                                }
                                placeholder="Amount"
                                className="w-[200px]"
                            />
                            <Button onClick={handleAddPayment}>Save</Button>
                            <Button variant="ghost" onClick={() => setIsAddingNew(false)}>
                                Cancel
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {payments.map((payment, index) => (
                    <Card key={payment.id}>
                        <CardContent className="flex items-center justify-between p-4">
                            {editingId === payment.id ? (
                                <div className="flex items-center space-x-4 flex-1">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-[200px] justify-start text-left font-normal"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {editPayment?.payment_date || payment.payment_date}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={parseISO(editPayment?.payment_date || payment.payment_date)}
                                                onSelect={(date) =>
                                                    setEditPayment({
                                                        ...payment,
                                                        payment_date: format(date || new Date(), 'yyyy-MM-dd'),
                                                    })
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Input
                                        type="number"
                                        value={editPayment?.amount || payment.amount}
                                        onChange={(e) =>
                                            setEditPayment({
                                                ...payment,
                                                amount: parseFloat(e.target.value),
                                            })
                                        }
                                        className="w-[200px]"
                                    />
                                    <Button onClick={() => handleUpdatePayment(payment.id)}>Save</Button>
                                    <Button variant="ghost" onClick={() => setEditingId(null)}>
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center space-x-4 flex-1">
                                        <span className="flex items-center space-x-2">
                                            Pago N° {payments.length - index}
                                        </span>
                                        <span>{format(parseISO(payment.payment_date), 'PP')}</span>
                                        <span>${payment.amount.toFixed(2)}</span>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={payment.status === 'paid'}
                                                onCheckedChange={(checked) => handleStatusChange(payment.id, checked as boolean)}
                                            />
                                            <span className="text-sm text-gray-500">
                                                {payment.status === 'paid' ? 'Paid' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setEditingId(payment.id);
                                                setEditPayment(payment);
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setDeleteId(payment.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the payment.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePayment}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
} 