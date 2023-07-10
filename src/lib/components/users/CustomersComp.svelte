<script lang="ts">
    import { Card } from "flowbite-svelte";
    import type { Admin, ListResult, Record } from "pocketbase";
  
    export let data: {
      customers: ListResult<Record> | null;
      error: any;
      user: Record | Admin | null;
      company: Record;
    };
    // your script goes here
  </script>
  
  <div>
    {#if data?.customers?.items}
      <!-- content here -->
      <div class="grid relative md:grid-cols-3 gap-6">
        {#each data?.customers?.items as item}
          <Card>
            <h3 class="text-xl font-semibold">{item?.name}</h3>
            <div class="mb-2">
              <span class="font-semibold">Email:</span>
              {item?.email}
            </div>
            <div class="mb-2">
              <span class="font-semibold">Phone:</span>
              {item?.phone_number}
            </div>
            <div class="mb-2">
              <span class="font-semibold">Price:</span>
              {item?.price}
            </div>
            <div class="mb-2">
              <span class="font-semibold">Discount:</span>
              {item?.discount}%
            </div>
          </Card>
        {/each}
      </div>
    {/if}
    {#if data?.customers?.items.length == 0}
      <p>No Products Found.</p>
    {/if}
  </div>
  