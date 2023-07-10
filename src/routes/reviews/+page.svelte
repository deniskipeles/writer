<script lang="ts">
  import ErrorComp from "$lib/components/ErrorComp.svelte";
import ReviewsComp from "$lib/components/company/ReviewsComp.svelte";
  import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
  import type { ListResult, Record, Admin } from "pocketbase";

  /** @type {import('./$types').PageData} */
  export let data: {
    reviews: ListResult<Record> | null;
    company: Record;
    user: Record | Admin | null;
    error: any;
  };
</script>

<!-- <svelte:head>
    <title>{data?.hostel?.name}</title>
    <meta name="description" content={data?.hostel?.description} />
  </svelte:head> -->

<Breadcrumb class="pt-20 py-8">
  <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
</Breadcrumb>

{#if data?.reviews}
   <!-- content here -->
   <ReviewsComp {data} />
{:else}
   <!-- else content here -->
   {#if data?.error}
     <!-- content here -->
     <ErrorComp error={data?.error}/>
   {/if}
{/if}
