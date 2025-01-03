'use client';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FieldValues, Path, PathValue } from 'react-hook-form';
import { FormElementProps, FormElementWrapper } from './wrapper';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn, getProperty } from '@/lib/utils';
import { useRef, useState } from 'react';

interface DropdownFormElementProps<V, T extends FieldValues> extends FormElementProps<T> {
    formId?: string;
    values: V[];
    onChange?: (newValue: V) => void;
    displayValue?: (value: V) => string;
    getKeyOfValue?: (value: V) => string;
    className?: string;
    'ping-once'?: boolean;
}

export function DropdownSingleFormElement<V, T extends FieldValues>({
    form,
    formId,
    label,
    name,
    values,
    onChange,
    displayValue = (value: V) => (value as any).toString(),
    getKeyOfValue = (value: V) => (value as any).toString(),
    className,
    'ping-once': pingOnce
}: DropdownFormElementProps<V, T>) {
    const [inFocus, setInFocus] = useState(false);
    const [open, setOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    function setInputRef(value: string) {
        if (inputRef.current) {
            inputRef.current.value = value;
        } else {
            console.error('inputRef in DropdownSingle is null');
        }
    }

    return (
        <>
            <input ref={inputRef} name={name} type="text" className="hidden" form={formId} />
            <FormElementWrapper
                className={className}
                ping-once={pingOnce}
                form={form}
                name={name}
                label={label}
                labelStat={inFocus ? 'in-focus' : 'written'}
                son={(field) => (
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className={cn(
                                    'flex w-full justify-between h-12 focus-visible:ring-0 focus:border-foreground',
                                    inFocus && 'ring-0 border-foreground'
                                )}
                            >
                                {displayValue(getProperty(form.getValues(), name)) ||
                                    `Sélectionner un(e) ${label.toLocaleLowerCase()}...`}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="p-0"
                            onFocus={() => setInFocus(true)}
                            onCloseAutoFocus={() => setInFocus(false)}
                        >
                            <Command>
                                <CommandInput
                                    placeholder={`Sélectionner un(e) ${label.toLocaleLowerCase()}...`}
                                />
                                <CommandList>
                                    <CommandEmpty>Entrée invalide.</CommandEmpty>
                                    <CommandGroup>
                                        {values.map((value) => (
                                            <CommandItem
                                                key={getKeyOfValue(value)}
                                                value={getKeyOfValue(value)}
                                                onSelect={(newKey) => {
                                                    const newValue = values.find(
                                                        (v) => getKeyOfValue(v) === newKey
                                                    )!;

                                                    if (onChange) {
                                                        onChange(newValue);
                                                    }
                                                    setInputRef(newKey);
                                                    form.setValue(
                                                        name,
                                                        newValue as PathValue<T, Path<T>>
                                                    );
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4',
                                                        getKeyOfValue(
                                                            getProperty(form.getValues(), name)
                                                        ) === getKeyOfValue(value)
                                                            ? 'opacity-100'
                                                            : 'opacity-0'
                                                    )}
                                                />
                                                {displayValue(value)}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                )}
            />
        </>
    );
}
