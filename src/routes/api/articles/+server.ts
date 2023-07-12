import { pb } from "$lib/pocketbase";
import { createArticle } from "$lib/server";
import { serializeNonPOJOs } from "$lib/tools";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals: { user, company } }) {
  let formData = await request.json();
  try {
    formData = {
      ...formData,
      company_id: company?.id,
    };
    if (user) {
      formData = {
        ...formData,
        author: user?.id,
      };
    }

    let record = await createArticle(formData);

    record = serializeNonPOJOs(record);
    return json({ success: true, data: { ...record } });
  } catch (error: any) {
    error = serializeNonPOJOs(error);
    return json({ success: false, error });
  }
}
