<script lang="ts">
  import { createArticleListStore } from "$lib/stores";
  import ErrorComp from "$lib/components/ErrorComp.svelte";
  import CreateArticle from "$lib/components/articles/CreateArticle.svelte";
  import { Breadcrumb, BreadcrumbItem, Button, Spinner } from "flowbite-svelte";
  import type { Admin, Record } from "pocketbase";
  import { goto } from "$app/navigation";
  import { concatenateFieldValues } from "$lib/tools";

  export let data: {
    article: Record;
    error: any;
    user: Record | Admin | null;
    company: Record;
  };
  function resetParentData(rec: any) {
    data = rec;
  }

  let error: any = null;
  let loading = false;

  async function handleSubmit() {
    loading = true;
    error = null;

    const response = await fetch("/api/articles", {
      method: "POST",
      body: JSON.stringify($createArticleListStore[0]),
      headers: {
        "content-type": "application/json",
      },
    });
    const res = await response.json();

    if (res?.success) {
      loading = false;
      goto(`/articles/${res?.data?.id}`, { replaceState: true });
    } else {
      loading = false;
      error = res?.error;
    }
  }

  function sanitizePayload() {
    const dt = $createArticleListStore[0];
    const dtToPush = {
      ...dt,
      html_article_content: `<p>${concatenateFieldValues(
        $createArticleListStore,
        "html_article_content"
      )}</p>`,
      ai_article_content: concatenateFieldValues(
        $createArticleListStore,
        "ai_article_content"
      ),
    };
    // console.log(dtToPush);
    createArticleListStore.update((list) => {
      list = list.map((obj, id) => {
        if (id == 0) {
          return dtToPush;
        } else {
          return obj;
        }
      });
      return list;
    });
  }

  function save() {
    if ($createArticleListStore.length > 1) {
      sanitizePayload();
      handleSubmit();
    }
  }
</script>

<Breadcrumb class="pt-20 py-8">
  <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
</Breadcrumb>

<div>
  {#if data?.error}
    <ErrorComp error={data?.error} />
  {/if}
  {#if error}
    <ErrorComp {error} />
  {/if}
  {#if data?.article}
    <!-- content here -->
    {@html data?.article?.content}
  {/if}
  <CreateArticle />
  <div class="items-center text-center">
    {#if loading}
      <Button><Spinner />saving...</Button>
    {:else}
      <Button on:click={save}>Save The Article</Button>
    {/if}
  </div>
</div>
