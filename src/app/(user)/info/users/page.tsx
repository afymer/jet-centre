import { StaticDataTable } from '@/components/data/static/data-table';
import { getAdmins } from './users';
import { columns } from './columns';

export default async function Page() {
    const admins = (await getAdmins()) ?? [];

    return <StaticDataTable columns={columns} data={admins} />;
}
