import { loadCompanyArticles } from '$lib/server';
import { serializeNonPOJOs } from '$lib/tools';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url }) {
  let { pb, ...rest } = locals
  try {
    const articles = await loadCompanyArticles(rest?.company, url)
    return {
      ...rest,
      articles,
      error: null
    };
  } catch (error) {
    return {
      ...rest,
      articles: null,
      error: serializeNonPOJOs(error)
    };
  }
}
