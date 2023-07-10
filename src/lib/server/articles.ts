import { pb } from "$lib/pocketbase";
import { serializeNonPOJOs } from "$lib/tools";
import type { Record } from "pocketbase";

export const loadCompanyArticles = async (company: Record, url: URL) => {
    const filter = `company_id = "${company?.id}"`
    let items_per_page = url.searchParams.get('items_per_page') ?? 30;
    items_per_page = Number(items_per_page)
    let page = url.searchParams.get('page') ?? 1;
    page = Number(page)
    // fetch a paginated records list
    let resultList = await pb.collection('articles').getList(page, items_per_page, {
        filter,
        sort: '-created',
        expand: 'author'
    });
    resultList = serializeNonPOJOs(resultList)
    return resultList
}

export const createArticle = async (data: any) => {
    let record = await pb.collection('articles').create(data);
    record = serializeNonPOJOs(record)
    return record
}

export const updateArticle = async (id: string, data: any) => {
    let record = await pb.collection('articles').update(id, data);
    record = serializeNonPOJOs(record)
    return record
}


export const loadSingleArticle = async (id: string) => {
    let record = await pb.collection('articles').getOne(id, {
        // expand: 'relField1,relField2.subRelField',
    });
    record = serializeNonPOJOs(record)
    return record
}