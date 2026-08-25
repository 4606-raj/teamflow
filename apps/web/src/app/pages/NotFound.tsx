import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

import { Button, buttonVariants } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-12">
            <div className="w-full max-w-lg text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Error 404</p>
                <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">Page not found</h1>
                <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                    The page you&apos;re looking for doesn&apos;t exist or may have been moved.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link to="/" className={cn(buttonVariants(), 'h-10 gap-1.5 px-4')}>
                        <Home aria-hidden="true" className="size-4" />
                        Go home
                    </Link>
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft aria-hidden="true" />
                        Go back
                    </Button>
                </div>
            </div>
        </main>
    );
}
