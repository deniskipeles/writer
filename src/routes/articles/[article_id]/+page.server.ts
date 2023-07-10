
import { loadSingleArticle } from '$lib/server';
import { serializeNonPOJOs } from '$lib/tools';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
  let { pb, ...rest } = locals
  try {
    const article = await loadSingleArticle(params.article_id)
    return {
      ...rest,
      article,
      error: null
    };

  } catch (error: any) {
    return {
      ...rest,
      article: null,
      error: serializeNonPOJOs(error)
    };
  }
}
