<script lang="ts">
  import { pb } from "$lib/pocketbase";
  import { searchCustomers } from "$lib/stores";
  import { serializeNonPOJOs } from "$lib/tools";
  import { Label, Spinner } from "flowbite-svelte";
  import { onMount } from "svelte";
  import Select from "svelte-select";

  export let value = "";
  export let onChange: Function;
  export let required = false;
  let items: any = [];

  let filterText = "";
  let itemsError = "";
  let loading = false;

  function setItems() {
    items = $searchCustomers.items?.map((obj) => {
      return { value: obj?.id, label: obj?.name };
    });
  }

  async function handleChange(e: any) {
    value = e?.detail?.value;
    onChange(value);
  }

  const searchCustomersFxn = async (value: string) => {
    try {
        const filter = `username ~ "${value}" || name ~ "${value}" || email ~ "${value}" || phone_number ~ "${value}"`;
        let records = await pb.collection("retrieve_customers").getList(1, 20, {
          filter,
        });
    
        records = serializeNonPOJOs(records);
        searchCustomers.set(records);
        setItems();
    } catch (error) {
        console.log(error)
    }
  };

  onMount(() => {
    searchCustomersFxn("");
  });
  function handleFilter(e: any) {
    if (filterText.length % 2 == 0 && e.detail.length === 0 && filterText.length > 0) {
      searchCustomersFxn(filterText);
    }
  }
</script>

<Label class="space-y-2">
  <span>Client/Customer:</span>
  <Select
    on:change={handleChange}
    on:filter={handleFilter}
    bind:filterText
    bind:value
    {items}
    {required}
  >
    <div slot="multi-clear-icon">❌</div>
  </Select>
  {#if itemsError}
    <p class="text-xs font-thin font-body text-red-600">
      {itemsError}
    </p>
  {/if}
  {#if loading}
    <div><Spinner />Adding...</div>
  {/if}
</Label>
