import { pb } from '$lib/pocketbase';
import { serializeNonPOJOs } from '$lib/tools';
import type { Record } from 'pocketbase';

export async function loadPersonnel(company: Record) {
    const filter = `company_id ?~ "${company?.id}"`
    // fetch a paginated records list
    let resultList = await pb.collection('retrieve_workers').getList(1, 50, {
        filter,
    });
    resultList = serializeNonPOJOs(resultList);
    return resultList;
}




export async function loadCustomers(company: Record) {
    const filter = `company_id ?~ "${company?.id}"`
    // fetch a paginated records list
    let resultList = await pb.collection('retrieve_customers').getList(1, 50, {
        filter,
    });
    resultList = serializeNonPOJOs(resultList);
    return resultList;
}




