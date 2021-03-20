<template>
  <form class="form" @submit.prevent="submitData">
    <div calss="form__div ">
      <label class="label">Name</label>
      <input
        class="input"
        required
        autofocus
        type="text"
        v-model="enteredName"
      />
    </div>
    <div calss="form__div ">
      <label class="label">E-Mail</label>
      <input
        class="input"
        required
        autofocus
        type="email"
        v-model="enteredEmail"
      />
    </div>
    <div calss="form__div ">
      <button class="fill btn">Add Contact</button>
    </div>
  </form>
</template>

<script>
export default {
  emits: ["add-contact"],
  data() {
    return {
      enteredName: "",
      enteredPhone: "",
      enteredEmail: ""
    };
  },
  methods: {
    submitData() {
      this.$emit("add-contact", this.enteredName, this.enteredEmail);
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}
html {
  font-family: "Jost", sans-serif;
}
body {
  margin: 0;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.li,
.form {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  margin: 1rem auto;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  width: 90%;
  max-width: 40rem;
}

.btn {
  background: none;
  border: 2px solid;
  font: inherit;
  line-height: 1;
}
.btn {
  color: #B165D4;
  -webkit-transition: 0.25s;
  transition: 0.25s;
}
.btn:hover,
.btn:focus {
  border-color: #B165D4;
  color: #ffffff;
}
.fill {
  --color: #B165D4;
  --hover: #B165D4;
}
.fill:hover,
.fill:focus {
  box-shadow: inset 0 0 0 2em var(--hover);
}
.input {
  font: inherit;
  margin: 5px;
}
.label {
  font-weight: bold;
  margin-right: 1rem;
  width: 7rem;
  display: inline-block;
}
.form__div {
  margin: 1rem 0;
}
</style>
