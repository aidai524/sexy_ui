export default {
  async fetch(request, env) {
    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      return new Response(`${request.url} not found`, {
        status: 404,
        statusText: 'not found',
      });
    }
  },
}; 