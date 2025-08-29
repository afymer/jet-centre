import { UserLogsProvider } from '@/components/hooks/use-user-logs';
import { getViewer } from '@/data/user';

export default async function Layout({ children }: { children: React.ReactNode }) {
    return <UserLogsProvider>{children}</UserLogsProvider>;
}
