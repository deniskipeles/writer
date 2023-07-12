import { loadArticleReviews } from '$lib/server';
import { serializeNonPOJOs } from '$lib/tools';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params,locals: { pb, company, user } }) {
  try {
    const reviews = await loadArticleReviews(pb, params.article_id)

    return {
      reviews,
      company,
      user,
      error: null
    };

  } catch (error: any) {
    return {
      reviews: null,
      company,
      user,
      error:serializeNonPOJOs(error)
    };
  }
}
