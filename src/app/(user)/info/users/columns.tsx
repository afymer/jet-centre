'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Admin, PermissionGroupType } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { Column } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

export type PermissionGroup = {
    id: string;
    name: string;
    type: PermissionGroupType;
    memberCount: number;
};

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <div>{title}</div>
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                <ArrowUpDown className="size-4" />
            </Button>
        </div>
    );
}

export function DataTableColumnFooter<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    return <Input placeholder={title} className={className} />;
}

export const columns: ColumnDef<Admin>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Id" />,
        footer: ({ column }) => <DataTableColumnFooter column={column} title="Id" />,
    },
    {
        accessorKey: 'position',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Position" />,
        footer: ({ column }) => <DataTableColumnFooter column={column} title="Position" />,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nom du groupe" />,
        footer: ({ column }) => <DataTableColumnFooter column={column} title="Nom du groupe" />,
    },
    {
        accessorKey: 'memberCount',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nombre d'utilisateurs" />
        ),
        footer: ({ column }) => (
            <DataTableColumnFooter column={column} title="Nombre d'utilisateurs" />
        ),
    },
];
