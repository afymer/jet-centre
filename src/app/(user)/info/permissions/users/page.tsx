import { Person } from '@prisma/client';
import { getUsersAndPermission } from './actions';
import { columns, UserWithPermission } from './columns';
import { DataTable } from './data-table';

function getPersonName(person: Person | undefined): string {
    if (!person) {
        return 'Personne inconnue';
    }
    return `${person.firstName} ${person.lastName}`;
}

export default async function Page() {
    const groups = await getUsersAndPermission();

    const data: UserWithPermission[] =
        groups?.map((group) => {
            return {
                userid: group.id,
                username: getPersonName(group.person),
                permissions: group.permissionGroups.flatMap((group) => group.permission),
                permissionsCount: group.permissionGroups.length,
            };
        }) ?? [];

    return <DataTable columns={columns} data={data} />;
}
