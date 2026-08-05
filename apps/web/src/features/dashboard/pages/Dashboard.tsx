import { Button } from '@/shared/components/ui/button';
import { useAuthStore } from '@/features/auth';
import { useEffect } from 'react';

export default function Dashboard() {
    const logout = useAuthStore(state => state.logout);
    const me = useAuthStore(state => state.fetchCurrentUser);

    useEffect(() => {
        me();
    }, [me]);

    return (
        <>
            <h1>Welcome</h1>

            <Button onClick={logout}>
                Logout
            </Button>
        </>
    );
}