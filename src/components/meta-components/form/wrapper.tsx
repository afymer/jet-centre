import { ControllerRenderProps, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../../ui/form';
import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

const labelVariants = cva('', {
    variants: {
        labelStat: {
            unwritten: 'text-input',
            'in-focus': 'text-foreground left-2 -top-2',
            written: 'text-input left-2 -top-2'
        }
    }
});

export type LabelStat = 'unwritten' | 'in-focus' | 'written';

export interface FormElementProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    label: string;
    name: Path<T>;
}

interface FormElementWrapperProps<T extends FieldValues> extends FormElementProps<T> {
    son: (field: ControllerRenderProps<T>) => ReactNode;
    description?: string | ReactNode;
    className?: string;
    labelStat?: LabelStat;
    'ping-once'?: boolean;
}

export function FormElementWrapper<T extends FieldValues>({
    form,
    label,
    name,
    son,
    description,
    labelStat,
    'ping-once': pingOnce,
    className
}: FormElementWrapperProps<T>) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn('group relative mb-4', className)}>
                    {pingOnce && (
                        <span className="pointer-events-none animate-ping-once absolute h-full w-full rounded-md bg-primary opacity-75"></span>
                    )}
                    <FormLabel
                        className={cn(
                            'absolute left-2 top-4 bg-box-background w-fit max-w-[calc(100%-0.75rem)] px-1 text-lg line-h leading-4 rounded-md whitespace-nowrap pointer-events-none transition-all overflow-ellipsis overflow-hidden',
                            field.value.toString() !== '' && 'text-input left-2 -top-2',
                            labelVariants({
                                labelStat: labelStat
                            }),
                            'group-focus-within:text-inherit group-focus-within:left-2 group-focus-within:-top-2 group-focus-within:max-w-none'
                        )}
                    >
                        {label}
                    </FormLabel>
                    <FormControl>{son(field)}</FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
