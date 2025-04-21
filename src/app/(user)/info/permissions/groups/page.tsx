import { getPermissionGroups } from './actions';
import { DataTable } from './data-table';
import { columns, PermissionGroup } from './columns';

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

    return <DataTable columns={columns} data={data} />;
}
