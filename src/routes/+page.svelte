<script lang="ts">
  import ErrorComp from "$lib/components/ErrorComp.svelte";
  import { pb } from "$lib/pocketbase";
  import { Breadcrumb, BreadcrumbItem, Gallery } from "flowbite-svelte";
  import type { Admin, Record } from "pocketbase";

  /** @type {import('./$types').PageData} */
  export let data: {
    company: Record;
    user: Record | Admin | null;
    error: any;
  };
  $: background = data?.company?.logo
    ? pb.files.getUrl(data?.company, data?.company?.logo, { thumb: "100x100" })
    : "/images/img1.jpg";
</script>

<svelte:head>
  <title>{data?.company?.name}</title>
  <meta name="description" content={data?.company?.description} />
</svelte:head>

<Breadcrumb class="pt-20 py-8">
  <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
</Breadcrumb>

{#if data?.error}
  <ErrorComp error={data?.error} />
{:else if data?.company?.page_bg}
  <div
    class="dark:text-white w-full h-full bg-center bg-cover opacity-50 bg-slate-800"
    style={`background-image: url(${background});`}
  >
    {@html data?.company?.about_us}
  </div>
{:else}
  {@html data?.company?.about_us}
{/if}
