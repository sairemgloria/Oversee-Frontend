<template>
  <button class="btn btn-success text-white" onclick="my_modal_1.showModal()">
    <i class="bx bx-plus bx-sm" />
    Create Admin
  </button>

  <dialog id="my_modal_1" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Create Admin</h3>
      <form method="" class="p-2">
        <div class="label">
          <span class="label-text">Name</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full mb-2"
        />

        <div class="label">
          <span class="label-text">Password</span>
        </div>
        <input
          type="password"
          placeholder="Type here"
          class="input input-bordered w-full mb-2"
        />

        <div class="label">
          <span class="label-text">Select Role</span>
        </div>
        <select class="select select-bordered w-full mb-5">
          <option disabled selected>Select a role</option>
          <option>Superadmin</option>
          <option>IT Department</option>
        </select>
        <div class="flex justify-end space-x-2 mt-2">
          <button class="btn">Cancel</button>
          <button class="btn bg-success text-white">Create</button>
        </div>
      </form>
    </div>
  </dialog>
</template>