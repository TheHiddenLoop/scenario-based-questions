export async function fetchPosts(q) {
  // simulate network latency and possible reordering
  const delay = Math.floor(Math.random() * 200) + 50;
  await new Promise((r) => setTimeout(r, delay));
  return [{ id: "1", text: `result for ${q}` }];
}
