
import { createReviews } from '$lib/server';
import { serializeNonPOJOs } from '$lib/tools';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals: { pb, user, company } }) {
    let data = await request.json()
    data = {
        ...data,
        company_id: company?.id,
        user_id: user?.id
    }
    try {
        // console.log(data)
        const res = await createReviews(pb, data)

        return json({ success: true, data: res });
    } catch (error: any) {
        return json({ success: false, error: serializeNonPOJOs(error) });
    }
}
