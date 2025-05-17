export default defineEventHandler((event) => {
  const path = event.path || '';

  // 如果是 API 请求，但没有找到对应的路由处理程序，则不返回 HTML
  if (path.startsWith('/api/') && event.method !== 'OPTIONS') {
    console.log(`No handler found for ${event.method} ${path}`);
    return {
      code: 404,
      message: `API endpoint not found: ${path}`,
    };
  }

  // 对于主页或者非 API 路径返回 HTML 页面
  if (!path.startsWith('/api/') || path === '/api/') {
    return `
<h1>Hello Vben Admin</h1>
<h2>Mock service is starting</h2>
<ul>
<li><a href="/api/user/info">/api/user/info</a></li>
<li><a href="/api/menu/all">/api/menu/all</a></li>
<li><a href="/api/auth/codes">/api/auth/codes</a></li>
<li><a href="/api/auth/code">/api/auth/code</a></li>
<li><a href="/api/auth/tenant/list">/api/auth/tenant/list</a></li>
<li><a href="/api/auth/login">/api/auth/login</a></li>
<li><a href="/api/upload">/api/upload</a></li>
</ul>
`;
  }
});
