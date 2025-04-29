import { getPermissionGroups } from './actions';
import { columns, PermissionGroup } from './columns';
import { StaticDataTable } from '@/components/data/static/data-table';

export default async function Page() {
    const groups = await getPermissionGroups();

    const data: PermissionGroup[] =
        groups?.map((group) => {
            return {
                id: group.id,
                name: group.name,
                memberCount: group.users.length,
                type: group.type,
            };
        }) ?? [];

    return <StaticDataTable columns={columns} data={data} />;
}
