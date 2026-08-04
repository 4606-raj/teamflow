import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';
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