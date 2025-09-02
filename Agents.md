# Next.js Developers Guide (Pages Router, no SSR, Tailwind utilities, no external component libraries)

Core principles
- Pages router only: use the pages directory. Do not create an app directory.
- No server-side rendering. Do not use getServerSideProps or getInitialProps.
- Prefer static generation (SSG) and/or client-side data fetching.
- Use square brackets for route parameters (e.g., pages/users/[id].tsx).
- Styling uses basic Tailwind CSS utility classes only. No design systems or component libraries.
- All UI components are defined directly in page files (co-located, no shared components directory).

**Data storage**
- All persistent user data should be stored in the browser's local storage.
- Do not use cookies, server-side sessions, or external databases for user data persistence.
- Use the `window.localStorage` API to read and write data:
    ```js
    // Save data
    localStorage.setItem("key", JSON.stringify(value));
    // Retrieve data
    const value = JSON.parse(localStorage.getItem("key") || "null");
    ```
- Always check for window existence before accessing localStorage (e.g., inside useEffect) to avoid SSR-related errors.
- For sensitive data, consider encrypting before storing, but avoid storing secrets in the browser.
- Example pattern:
    ```js
    import { useEffect, useState } from "react";

    function useLocalStorage(key, initialValue) {
        const [value, setValue] = useState(() => {
            if (typeof window === "undefined") return initialValue;
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : initialValue;
        });

        useEffect(() => {
            if (typeof window !== "undefined") {
                localStorage.setItem(key, JSON.stringify(value));
            }
        }, [key, value]);

        return [value, setValue];
    }
    ```
- Use this pattern for user preferences, drafts, or other persistent client-side data.

Project setup
1) Create the project (TypeScript recommended)
- npx create-next-app@latest my-app --ts
- When prompted, choose the Pages Router if asked.

2) Add Tailwind CSS
- npm install -D tailwindcss postcss autoprefixer
- npx tailwindcss init -p
- tailwind.config.js content should include:
    - content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"]
    - You won’t create a components folder, but leaving it does no harm; you may remove it if you want to be strict.
- styles/globals.css should include Tailwind directives:
    - @tailwind base;
    - @tailwind components;
    - @tailwind utilities;

3) Ensure no app directory
- Do not create an app/ folder.
- All page files go under pages/.

4) next.config.js (optional but recommended)
- Ensure default settings. You do not need to enable appDir.
- You may enable images.domains if using next/image with remote sources.

Directory structure (minimal)
- pages/
    - _app.tsx (global providers, global layout, defined in-file)
    - _document.tsx (document shell if needed)
    - index.tsx
    - 404.tsx
    - example/[id].tsx (dynamic routes use [param] files)
- public/ (static assets)
- styles/
    - globals.css
- tailwind.config.js, postcss.config.js, next.config.js

Routing guidelines
- Static routes: pages/about.tsx => /about
- Dynamic routes (square brackets only):
    - pages/users/[id].tsx => /users/123
    - pages/blog/[slug].tsx => /blog/my-post
    - Catch-all: pages/docs/[...slug].tsx => /docs/a/b/c
- Link between pages with next/link. Example:
    import Link from "next/link"
    <Link href="/users/123" className="text-blue-600 hover:underline">User</Link>
- Access route params via useRouter in client code:
    import { useRouter } from "next/router"
    const { query } = useRouter()
    const { id } = query

No server-side rendering
- Do not use getServerSideProps or getInitialProps in any page or custom _app/_document.
- Prefer:
    - Static generation (getStaticProps + getStaticPaths) when content can be known at build time. Optionally use ISR via revalidate for freshness.
    - Client-side fetching (useEffect/fetch or SWR-like patterns using fetch) for user-specific or frequently changing data.
- Avoid patterns that force SSR (including getInitialProps in _app.tsx).

Data fetching patterns
1) Static generation (preferred when possible)
- pages/blog/[slug].tsx
    export async function getStaticPaths() {
        return { paths: [], fallback: "blocking" }
    }
    export async function getStaticProps({ params }) {
        const { slug } = params
        const post = await fetch(`${process.env.API_BASE_URL}/posts/${slug}`).then(r => r.json())
        if (!post) return { notFound: true }
        return {
            props: { post },
            revalidate: 60 // ISR (optional)
        }
    }
    export default function BlogPost({ post }) { /* render with Tailwind utilities */ }

2) Client-side fetching (no SSR)
- pages/users/[id].tsx
    import { useEffect, useState } from "react"
    import { useRouter } from "next/router"
    export default function UserPage() {
        const { query } = useRouter()
        const { id } = query
        const [user, setUser] = useState(null)
        const [loading, setLoading] = useState(true)

        useEffect(() => {
            if (!id) return
            setLoading(true)
            fetch(`/api/users/${id}`)
                .then(r => r.json())
                .then(data => setUser(data))
                .finally(() => setLoading(false))
        }, [id])

        if (loading) return <p className="p-4 text-gray-500">Loading…</p>
        if (!user) return <p className="p-4 text-red-600">User not found</p>
        return <div className="p-4">...</div>
    }

Styling with Tailwind utilities (no component libraries)
- Use Tailwind utility classes directly in JSX (bg-, text-, p-/m-, flex/grid, rounded, shadow, border, hover:, focus:, md:, etc.).
- Keep className strings readable: group by layout, spacing, color/typography, state.
- Prefer semantic HTML elements and ARIA attributes for accessibility.
- Do not use Tailwind UI, Headless UI, Radix, MUI, Chakra, or similar component libraries.

Examples (inline, minimal components defined in the page file)
- pages/index.tsx
    import Head from "next/head"

    function Button({ children, onClick, variant = "primary" }) {
        const base = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600",
            secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400"
        }
        return (
            <button onClick={onClick} className={`${base} ${variants[variant]}`}>
                {children}
            </button>
        )
    }

    export default function Home() {
        return (
            <>
                <Head>
                    <title>Home</title>
                    <meta name="description" content="Next.js Pages + Tailwind (no SSR)" />
                </Head>
                <main className="mx-auto max-w-3xl p-6">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900">Welcome</h1>
                    <p className="mb-6 text-gray-700">Build with static generation or client-side fetching.</p>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <h2 className="mb-2 text-xl font-semibold text-gray-900">Example card</h2>
                        <p className="mb-4 text-gray-600">This card uses only Tailwind utilities.</p>
                        <Button onClick={() => alert("Clicked!")}>Click me</Button>
                    </div>
                </main>
            </>
        )
    }

Global layout and providers (inside pages/_app.tsx, define local components in-file)
- pages/_app.tsx
    import "../styles/globals.css"
    import type { AppProps } from "next/app"

    function Layout({ children }) {
        return (
            <div className="min-h-screen bg-gray-50 text-gray-900">
                <header className="border-b bg-white">
                    <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
                        <a href="/" className="text-lg font-semibold">MyApp</a>
                        <nav className="space-x-4">
                            <a href="/about" className="text-gray-600 hover:text-gray-900">About</a>
                            <a href="/docs/getting-started" className="text-gray-600 hover:text-gray-900">Docs</a>
                        </nav>
                    </div>
                </header>
                <div className="mx-auto max-w-5xl p-4">{children}</div>
                <footer className="mt-12 border-t bg-white">
                    <div className="mx-auto max-w-5xl p-4 text-sm text-gray-500">© {new Date().getFullYear()}</div>
                </footer>
            </div>
        )
    }

    export default function MyApp({ Component, pageProps }: AppProps) {
        return (
            <Layout>
                <Component {...pageProps} />
            </Layout>
        )
    }

Dynamic routes examples (square brackets)
- Single parameter:
    - File: pages/products/[id].tsx
    - URL: /products/42
- Multiple parameters via nesting:
    - File: pages/teams/[teamId]/members/[memberId].tsx
    - URL: /teams/7/members/15
- Catch-all:
    - File: pages/docs/[...slug].tsx
    - URLs: /docs/a, /docs/a/b, /docs/a/b/c
    - Use getStaticPaths/getStaticProps or client-side fetching depending on needs.

Navigation
- Use next/link:
    import Link from "next/link"
    <Link href="/products/42" className="text-blue-600 hover:underline">View Product</Link>
- Avoid router.push with string concatenation when a Link is sufficient; Link prefetching improves UX.

Images and assets
- You may use next/image (built-in) or plain img. Both are allowed.
- With next/image:
    import Image from "next/image"
    <Image src="/logo.png" alt="Logo" width={48} height={48} className="rounded" />
- Put static assets in public/.

Accessibility and semantics
- Use semantic elements (main, nav, header, footer, section, h1–h6).
- Provide alt text for images.
- Ensure focus states are visible (Tailwind focus: utilities).
- Use aria-* attributes where applicable.

Environment variables
- public variables: NEXT_PUBLIC_* available on client.
- server-only variables are not needed for SSR here, but may be used at build time (getStaticProps) or in API routes.
- Define in .env.local and document required keys.

API routes (optional)
- You can use pages/api/* for serverless endpoints. This does not render UI on the server; it provides data to client-side fetching or build-time SSG.
- Example: pages/api/users/[id].ts returns JSON.

Testing and quality
- ESLint/Prettier recommended. Keep rules lightweight.
- Consider an ESLint rule to disallow getServerSideProps and getInitialProps.
    - For example, add a custom lint rule or a simple codebase check in CI that greps for those function names.
- TypeScript:
    - Use strict mode in tsconfig for safer code.

Do/Don’t summary
- Do:
    - Use pages directory exclusively.
    - Use square brackets for dynamic routes.
    - Use Tailwind utility classes directly in JSX.
    - Use static generation (getStaticProps/Paths) and ISR, or client-side fetching.
    - Define small UI components locally within the page file (including Layout inside _app.tsx).
- Don’t:
    - Don’t create an app directory or use the App Router.
    - Don’t use getServerSideProps or getInitialProps.
    - Don’t install external component libraries (MUI, Chakra, Radix, Headless UI, etc.).
    - Don’t create a shared components directory; co-locate components within the page files.

Common patterns and snippets
- Loading and empty states:
    <p className="p-4 text-gray-500">Loading…</p>
    <p className="p-4 text-gray-500">No results found</p>

- Form example:
    <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
            <input type="email" className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </label>
        <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600">Submit</button>
    </form>

- Cards and lists:
    <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
        {items.map(i => (
            <li key={i.id} className="flex items-center justify-between p-4">
                <span className="text-gray-900">{i.name}</span>
                <a href={`/items/${i.id}`} className="text-blue-600 hover:underline">Open</a>
            </li>
        ))}
    </ul>

Code review checklist
- Routes use pages/* with [param] for dynamics; no app/*.
- No getServerSideProps/getInitialProps present.
- Tailwind classes applied directly; no component-lib imports.
- Small components are declared in the same page file.
- Static generation or client-side fetching is used appropriately.
- Accessibility: alt text, focus states, semantic tags.
- Head metadata present where needed.

This guide keeps the project simple, static by default, and styled with Tailwind utilities, while avoiding SSR and external component libraries.