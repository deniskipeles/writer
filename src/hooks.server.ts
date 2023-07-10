import { pb } from '$lib/pocketbase'
import { loadCompany } from '$lib/server'
import type { Handle } from '@sveltejs/kit'


/** @type {import('@sveltejs/kit').Handle} */
export const handle: Handle = async ({ event, resolve }) => {

  event.locals.pb = pb
  // load the store data from the request cookie string
  event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

  try {
      // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
      event.locals.pb.authStore.isValid && await event.locals.pb.collection('users').authRefresh();
      event.locals.company = await loadCompany()
      event.locals.user = structuredClone(event.locals.pb.authStore.model)
  } catch (_) {
      // clear the auth store on failed refresh
      event.locals.pb.authStore.clear();
  }

  const response = await resolve(event);

  // send back the default 'pb_auth' cookie to the client with the latest store state
  response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());
  response.headers.set(
    'set-cookie',
    pb.authStore.exportToCookie({ httpOnly: false })
  )

  return response;
}