import { serializeNonPOJOs } from '$lib/tools/index.js';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals: { user, company } }) {
    try {
        let data = await request.formData()
        if (user) {
            data.append('added_by_user_id', user?.id)
            data.append('company_id', company?.id)
        }
        // const res = await createService(data)
        return json({ success: true, data: {  } });
    } catch (error: any) {
        error = serializeNonPOJOs(error)
        return json({ success: false, error });
    }
}
