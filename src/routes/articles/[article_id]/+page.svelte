<script lang="ts">
  import ErrorComp from "$lib/components/ErrorComp.svelte";
  import CreateArticle from "$lib/components/articles/CreateArticle.svelte";
  import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
  import type { Admin, Record } from "pocketbase";

  export let data: {
    article: Record;
    error: any;
    user: Record | Admin | null;
    company: Record;
  };
  function resetParentData(rec: any) {
    data = rec;
  }
</script>

<Breadcrumb class="pt-20 py-8">
  <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
</Breadcrumb>

<div>
  {#if data?.error}
    <ErrorComp error={data?.error} />
  {/if}
  <p class="font-bold">{data?.article?.title ?? "No Title"}</p>
  <div>
    {@html data?.article?.html_article_content}
  </div>
</div>
