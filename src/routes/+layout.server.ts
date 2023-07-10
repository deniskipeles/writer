
/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals: { user, company } }) => {

  return {
    user,
    company,
  };
};


