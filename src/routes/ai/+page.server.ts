

import { redirect } from "@sveltejs/kit";
/** @type {import('./$types').LayoutServerLoad} */
export async function load({ parent }) {
  let parentData = await parent();
  return { ...parentData }
}
