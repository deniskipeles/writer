
/** @type {import('./$types').PageServerLoad} */
export async function load({ locals: { pb, company, user } }) {
  try {

    return {
      company,
      user,
      error: null
    };
  } catch (error: any) {

    return {
      company,
      user,
      error
    };
  }
}
