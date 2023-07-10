<script lang="ts">
  import CreateArticle from "$lib/components/articles/CreateArticle.svelte";
  import ArticlesPage from "$lib/components/articles/ArticlesPage.svelte";
  import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
  import type { Admin, ListResult, Record } from "pocketbase";

  /** @type {import('./$types').PageData} */
  export let data: {
    articles: ListResult<Record> | null;
    user: Record | Admin | null;
    company: Record;
    error: any;
  };
  function updateData(dt: any) {
    data = dt;
  }
</script>

<Breadcrumb class="pt-20 py-8">
  <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
</Breadcrumb>
<div>
  {#if data?.user?.role == "super_user"}
    <CreateArticle {data} {updateData} />
  {/if}
  <ArticlesPage {data} />
</div>
