export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  return proxyRequest(
    event,
    `${config.apiBase.replace(/\/$/, "")}/v1/solr${getRequestURL(event).search}`,
  );
});
