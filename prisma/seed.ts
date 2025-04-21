import { PrismaClient } from '@prisma/client';
import { parseArgs } from 'node:util';

const options = {
    environment: { type: 'string' as const },
};

const prisma = new PrismaClient();

async function seed_dev() {
    const email = process.env.ADMIN_EMAIL || 'example@telecom-etude.fr';
    const position = process.env.ADMIN_POSITION || 'president';

    await prisma.admin.create({
        data: {
            position,
            user: {
                create: {
                    person: {
                        create: {
                            email,
                            firstName: '',
                            lastName: '',
                        },
                    },
                },
            },
        },
    });

    const person = await prisma.person.findFirst({
        select: {
            id: true,
        },
        where: {
            email,
        },
    });

    if (person?.id === undefined) {
        console.error('Something went wrong while creating the person');
        return;
    }

    await prisma.permissionGroup.create({
        data: {
            name: 'solo ' + email,
            permission: {
                create: {
                    allowedRoute: '/',
                    allowSubroutes: true,
                },
            },
            type: 'Solo',
            users: {
                connect: {
                    personId: person.id,
                },
            },
        },
    });
    await prisma.permissionGroup.create({
        data: {
            name: 'pole info',
            permission: {
                create: {
                    allowedRoute: '/info',
                    allowSubroutes: true,
                },
            },
            type: 'Group',
            users: {
                connect: {
                    personId: person.id,
                },
            },
        },
    });

    const dummy: number[] = [];
    for (let index = 0; index < 100; index++) {
        dummy.push(index);
    }
    await Promise.all(
        dummy.map((i) =>
            prisma.permissionGroup.create({
                data: {
                    name: i.toString(),
                    permission: {
                        create: {
                            allowedRoute: '/info',
                            allowSubroutes: true,
                        },
                    },
                    type: 'Group',
                },
            })
        )
    );
}

async function seed_prod() {
    const email = 'admin@telecom-etude.fr';

    await prisma.admin.create({
        data: {
            position: 'respo-info',
            user: {
                create: {
                    person: {
                        create: {
                            email,
                            firstName: '',
                            lastName: '',
                        },
                    },
                },
            },
        },
    });
}

async function main() {
    const {
        values: { environment },
    } = parseArgs({ options });

    switch (environment) {
        case 'dev':
            await seed_dev();
            break;
        case 'prod':
            await seed_prod();
            break;
        default:
            break;
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(`#####\n${e}\n#####`);
        await prisma.$disconnect();
        process.exit(1);
    });
