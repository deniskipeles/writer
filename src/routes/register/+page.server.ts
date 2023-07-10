import { currentUser } from '$lib/pocketbase'
import { serializeNonPOJOs } from '$lib/tools'
import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals: { user, company } }) {
  if (user?.id) {
    throw redirect(301, '/account')
  } else {
    return { company }
  }
}

export const actions: Actions = {
  default: async ({ locals, request }) => {
    const formData = await request.formData();

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      passwordConfirm: formData.get('passwordConfirm') as string,
      company_id: [locals?.company?.id]
    };

    try {
      await locals.pb.collection('users').create(data)
      await locals.pb.collection('users').requestVerification(data?.email);
      let res = await locals.pb
        .collection('users')
        .authWithPassword(data.email, data.password)
      currentUser.set(res.record)
    } catch (e: any) {
      console.error(e)
      return { incorrect: true, error: serializeNonPOJOs(e) };
    }

    throw redirect(301, '/')
  },
}