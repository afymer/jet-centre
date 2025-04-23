'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Permission } from '@prisma/client';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Column } from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { AlertCircle, ArrowUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DataTable } from './data-table';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { updatePermission } from '@/actions/permissions';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export type UserWithPermission = {
    userid: string;
    username: string;
    permissions: Permission[];
    permissionsCount: number;
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

function PermissionRouteCell({
    row,
    updatePermissionRow,
    setError,
}: {
    row: Row<Permission>;
    updatePermissionRow: (permission: Permission) => void;
    setError: (error: string) => void;
}) {
    const routeValue: string = row.getValue('allowedRoute');
    const [route, setRoute] = useState(routeValue);
    const [updating, setUpdating] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRoute = event.target.value;
        setRoute(newRoute);
    };

    const updateRoute = async () => {
        if (route === routeValue) {
            return;
        }
        setUpdating(true);
        await updatePermission(row.original.id, route, row.original.allowSubroutes).catch(() => {
            console.error('Error updating route');
            setError('Error updating route');
            setUpdating(false);
        });
        updatePermissionRow({ ...row.original, allowedRoute: route });
        setUpdating(false);
    };

    return (
        <Input
            value={route}
            onChange={handleChange}
            onBlur={updateRoute}
            placeholder="Entrez une route"
            disabled={updating}
        />
    );
}

function PermissionSubroutesCell({
    row,
    updatePermissionRow,
    setError,
}: {
    row: Row<Permission>;
    updatePermissionRow: (permission: Permission) => void;
    setError: (error: string) => void;
}) {
    const subroutesValue: boolean = row.getValue('allowSubroutes');
    const [subroutes, setSubroutes] = useState(subroutesValue);
    const [updating, setUpdating] = useState(false);

    const handleChange = async (checked: CheckedState) => {
        setUpdating(true);
        if (checked == 'indeterminate') {
            console.error('Ended up in indeterminate state');
            setError('Indeterminate state is not allowed');
            return;
        }
        setSubroutes(checked);
        await updatePermission(row.original.id, row.original.allowedRoute, checked).catch(() => {
            console.error('Error updating subroutes');
            setError('Error updating subroutes');
            setUpdating(false);
        });
        updatePermissionRow({ ...row.original, allowSubroutes: checked });
        setUpdating(false);
    };

    return <Checkbox checked={subroutes} onCheckedChange={handleChange} disabled={updating} />;
}

function PermissionsCell({ current_permissions }: { current_permissions: Permission[] }) {
    const [permissions, setPermissions] = useState<Permission[]>(current_permissions);
    const [error, setError] = useState<string | undefined>(undefined);
    const updatePermissionRow = (permission: Permission) => {
        setPermissions((prev) =>
            prev.map((p) => (p.id === permission.id ? { ...p, ...permission } : p))
        );
    };
    const data = permissions.map((permission) => ({
        id: permission.id,
        allowedRoute: permission.allowedRoute,
        allowSubroutes: permission.allowSubroutes,
    }));
    const columns: ColumnDef<Permission>[] = [
        {
            accessorKey: 'allowedRoute',
            header: ({ column }) => <DataTableColumnHeader column={column} title={'Route'} />,
            cell: ({ row }) => (
                <PermissionRouteCell
                    row={row}
                    updatePermissionRow={updatePermissionRow}
                    setError={setError}
                />
            ),
        },
        {
            accessorKey: 'allowSubroutes',
            header: 'Autoriser les sous-routes',
            cell: ({ row }) => (
                <PermissionSubroutesCell
                    row={row}
                    updatePermissionRow={updatePermissionRow}
                    setError={setError}
                />
            ),
        },
    ];
    return (
        <Popover>
            <PopoverTrigger>
                <Badge variant="blue">
                    {permissions.length} permission{permissions.length > 1 ? 's' : ''}
                </Badge>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
                {error !== undefined && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>Une erreur est survenue</AlertDescription>
                    </Alert>
                )}
                <DataTable columns={columns} data={data} />
            </PopoverContent>
        </Popover>
    );
}

export const columns: ColumnDef<UserWithPermission>[] = [
    {
        accessorKey: 'userid',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Id" />,
    },
    {
        accessorKey: 'username',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nom de l'administrateur" />
        ),
    },
    {
        accessorKey: 'permissions',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Permissions associées" />
        ),
        cell: ({ row }) => {
            const current_permissions = row.getValue('permissions') as Permission[];
            return <PermissionsCell current_permissions={current_permissions} />;
        },
    },
];
