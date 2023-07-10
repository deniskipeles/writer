import { currentUser } from '$lib/pocketbase';
import { bookHostelFxn } from '$lib/server';
import { bookingFormData } from '$lib/stores';
import { serializeNonPOJOs } from '$lib/tools';
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
  default: async ({ locals: { pb }, request }) => {
    const formData = await request.formData();

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    };
    

    try {
      const authData = await pb.collection('users').authWithPassword(
        data.email,
        data.password,
      )
      currentUser.set(authData.record)
    } catch (e: any) {
      return { incorrect: true, error: serializeNonPOJOs(e) };
    }

    throw redirect(301, '/')
  },
}
// XaD5msDYcMjyHTf