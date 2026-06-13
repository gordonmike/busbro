import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'
import { Navbar } from '../components/Navbar'

export default jsxRenderer(({ children, title }) => {
  const c = useRequestContext()
  const user = c.var.user

  return (
    <html lang="en" class="h-full antialiased scroll-smooth">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'Cluebus | Business Ideas'}</title>
        <link rel="icon" href="/favicon.ico" />
        {/* Inline style to prevent white flash before Tailwind CSS loads */}
        <style dangerouslySetInnerHTML={{ __html: `html, body { background-color: #050505; color: #ffffff; }` }} />
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
        
        {/* Paddle.js for Overlay Checkout */}
        <script src="https://cdn.paddle.com/paddle/v2/paddle.js"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          Paddle.Environment.set("sandbox");
          Paddle.Initialize({ 
            token: "test_7efc04bdd1573440a56ac629ee9"
          });
        `}} />
      </head>
      <body class="min-h-full flex flex-col bg-[#050505] text-white selection:bg-purple-500/30 font-sans">
        <Navbar user={user} />
        {children}
      </body>
    </html>
  )
})
