'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PermissionGroupType } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { Column } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { ArrowUpDown } from 'lucide-react';

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

export const columns: ColumnDef<PermissionGroup>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Id" />,
    },
    {
        accessorKey: 'type',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Type de groupe" />,
        cell: ({ row }) => {
            const type = row.getValue('type');
            const solo = type == 'Solo';
            return solo ? <Badge variant="green">Solo</Badge> : <Badge variant="blue">Group</Badge>;
        },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nom du groupe" />,
    },
    {
        accessorKey: 'memberCount',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nombre d'utilisateurs" />
        ),
    },
];
