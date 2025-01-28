'use client';

import { FaMoneyBill, FaUser } from 'react-icons/fa6';
import SidebarCdp from './sidebar-cdp';
import SidebarRole from './sidebar-role';
import { useState } from 'react';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function SidebarSwitch({ isOpen }: { isOpen: boolean }) {
    const tabs = [
        {
            id: 'cdp',
            title: 'CDP',
            icon: FaUser,
            content: <SidebarCdp />
        },
        {
            id: 'role',
            title: 'Trésorier',
            icon: FaMoneyBill,
            content: <SidebarRole />
        }
    ];

    const [tab, setTab] = useState(0);
    const [api, setApi] = React.useState<CarouselApi>();
    api?.scrollTo(tab);
    const item = tabs[tab];

    return (
        <div className="flex flex-col h-full w-full place-items-center">
            <div className={cn('flex bg-transparent space-x-2 w-full', isOpen ? 'p-2' : '')}>
                {isOpen &&
                    tabs.map((tab_it, i) => (
                        <Button
                            key={i}
                            variant={i == tab ? 'selected-navbar' : 'secondary'}
                            className={cn(i == tab ? 'font-bold' : '', 'flex-1 text-primary')}
                            onClick={() => {
                                setTab(i);
                            }}
                        >
                            <div className="flex place-items-center space-x-2">
                                {tab_it.icon && <tab_it.icon />}
                                <p>{tab_it.title}</p>
                            </div>
                        </Button>
                    ))}
                {!isOpen && (
                    <Button
                        key={tab}
                        className="flex-1"
                        variant="none"
                        onClick={() => {
                            setTab((tab + 1) % tabs.length);
                            api?.scrollNext();
                        }}
                    >
                        {item.icon && <item.icon />}
                    </Button>
                )}
            </div>
            <Carousel
                setApi={setApi}
                className="w-full h-full flex flex-col static"
                opts={{ loop: true, duration: 10, watchDrag: false }}
            >
                <CarouselContent className="h-full">
                    {tabs.map((tab, i) => (
                        <CarouselItem key={i} className="grow py-2 animate-fade-left h-full">
                            {tab.content}
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}
