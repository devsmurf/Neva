export default function DebugEnv() {
    return (
        <div className="p-4">
            <h1>Environment Variables Debug</h1>
            <pre className="bg-gray-100 p-4 mt-4">
                {JSON.stringify({
                    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
                    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
                    NODE_ENV: process.env.NODE_ENV
                }, null, 2)}
            </pre>
        </div>
    )
}
