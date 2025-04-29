'use client';

import { Button } from '@/components/ui/button';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    createNewEntry?: (entry: TData) => Promise<void>;
}

export function StaticDataTable<TData, TValue>({
    columns,
    data,
    createNewEntry,
}: DataTableProps<TData, TValue>) {
    // TODO: add dynamic data fetching to prevent loading the whole table on every call
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pageSize, setPageSize] = useState(50);
    // const [pendingNewEntries, setPendingNewEntries] = useState<TData[]>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize,
            },
        },
        state: {
            sorting,
        },
    });

    return (
        <div className="flex flex-col flex-grow min-h-0">
            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="space-x-2 py-4">
                    <Select
                        onValueChange={(e) => {
                            setPageSize(parseInt(e));
                        }}
                        defaultValue={pageSize.toString()}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Taille de la page" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Précédent
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Suivant
                    </Button>
                </div>
            </div>

            {/* Table Section */}
            <Table className="flex-grow rounded-md border border-collapse overflow-scroll">
                <TableHeader className="sticky top-0 bg-background">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="hover:none bg-muted/50">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="">
                    {table.getRowModel().rows?.length ? (
                        <>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                            {/* {pendingNewEntries.map((row, index) => (
                                <TableRow key={index} data-state="pending">
                                    {columns.map((column) => (
                                        <TableCell key={column.id}>
                                            {flexRender(column.cell, {
                                                row: table.getRowModel().rows[index], // Use the correct row object
                                                cell: {
                                                    getValue: () => row[column.id],
                                                },
                                            })}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))} */}
                        </>
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter className="sticky top-0 bg-background">
                    {table.getFooterGroups().map((footerGroup) => (
                        <TableRow key={footerGroup.id} className="hover:none bg-muted/50">
                            {footerGroup.headers.map((footer) => (
                                <TableCell key={footer.id}>
                                    {footer.isPlaceholder
                                        ? null
                                        : flexRender(
                                              footer.column.columnDef.footer,
                                              footer.getContext()
                                          )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableFooter>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Précédent
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Suivant
                </Button>
            </div>
        </div>
    );
}
