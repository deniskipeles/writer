<script lang="ts">
  import ErrorComp from "$lib/components/ErrorComp.svelte";
  import { error } from "@sveltejs/kit";
  import { Breadcrumb, BreadcrumbItem, Card } from "flowbite-svelte";
  import type { Admin, ListResult, Record } from "pocketbase";
  export let data: {
    contacts: ListResult<Record>;
    error: any;
    user: Record | Admin | null;
    company: Record;
  };

  let contacts = [
    {
      name: "John Doe",
      position: "Manager",
      email: "johndoe@example.com",
      phone: "+1 123-456-7890",
    },
    {
      name: "Jane Smith",
      position: "Front Desk",
      email: "janesmith@example.com",
      phone: "+1 987-654-3210",
    },
  ];
</script>

<Breadcrumb class="pt-20 py-8">
  <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
  <BreadcrumbItem>Contacts</BreadcrumbItem>
</Breadcrumb>

<div>
  <h2 class="text-2xl font-bold mb-4">Contact Information</h2>
  {#if data?.error}
    <ErrorComp error={data?.error} />
  {:else}
    <!-- else content here -->
    <div class="grid relative md:grid-cols-3 gap-6">
      {#each data?.contacts?.items as contact}
        <Card>
          <div>
            <h3 class="text-lg font-bold">{contact.name ?? 'Unspecified name'}</h3>
            <!-- <p class="text-gray-600">{contact.position}</p> -->
            <p>Email: <a href="mailto:{contact.email}">{contact.email}</a></p>
            <p>Phone: <a href="tel:{contact.phone_number}">{contact.phone_number}</a></p>
          </div>
        </Card>
      {/each}
    </div>
  {/if}
</div>
