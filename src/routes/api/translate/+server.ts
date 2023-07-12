import { serializeNonPOJOs } from "$lib/tools";
import { json } from "@sveltejs/kit";
import { translate } from '@vitalets/google-translate-api';



/** @type {import('./$types').RequestHandler} */
export async function POST({ request, fetch, url, locals: { company, user } }) {
  try {
    let data = await request.json();
    const { text } = await translate(data?.text ?? data?.query ?? "There is nothing to translate", { to: 'sw' });

    return json({ success: true, data: {text} });
  } catch (error: any) {
    // console.log(error)
    error = serializeNonPOJOs(error);
    return json({ success: false, error });
  }
}
