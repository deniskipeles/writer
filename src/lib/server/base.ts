import { PUBLIC_KEY } from '$env/static/public';
import { pb } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/tools';

export async function loadCompany() {
    let record = await pb.collection('companies').getOne(PUBLIC_KEY, {});
    record = serializeNonPOJOs(record);
    return record;
}



export async function loadCompanyReviews(pb: import('pocketbase').default, hostel: any) {
    // console.log(hostel)
    let record = await pb.collection('retrieve_reviews').getList(1, 50, {
        sort: '-created',
        filter: `company_id = "${hostel?.id}"`,
    });

    record = serializeNonPOJOs(record);
    return record;
}




export async function createReviews(pb: import('pocketbase').default, data: any) {
    // console.log(data)
    try {
        let record = await pb.collection('reviews').create(data);
        record = serializeNonPOJOs(record);
        return record;
    } catch (error: any) {
        throw new Error(`${error?.message}`)
    }

}
