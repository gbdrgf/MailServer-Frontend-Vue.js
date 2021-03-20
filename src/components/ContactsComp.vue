<template>
  <body>
    <div class="contact">
      <div><strong> Name: </strong>{{ name }}</div>
      <ul v-if="detailsAreVisible">
        <br/>
        <div><strong>Email:</strong>{{ emailAddress }}</div>
      </ul>
      <br/>
      <div>
        <button class="fill btnContact" @click="toggleDetails">
          {{ detailsAreVisible ? "Hide" : "Show" }} Details
        </button>
        <button class="fill btnContact" @click="$emit('remove', emailAddress)">
          remove
        </button>
      </div>
    </div>
  </body>
</template>

<script>
export default {
  props: ["id", "name", "emailAddress"],
  emits: ["remove"],
  data() {
    return {
      detailsAreVisible: false
    };
  },
  methods: {
    toggleDetails() {
      this.detailsAreVisible = !this.detailsAreVisible;
    },
    removeContact() {
      this.$emit("remove-contact", this.id);
    }
  }
};
</script>

<style scoped>
body {
  padding: 10px;
}

.btnContact {
  background: none;
  border: 2px solid;
  font: inherit;
  line-height: 1;
  margin: 5px;
}
.btnContact {
  color: #B165D4;
  -webkit-transition: 0.25s;
  transition: 0.25s;
}
.btnContact:hover,
.btnContact:focus {
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

input[type="button"] {
  display: none;
}
/* /////////////////////////////// */
.menu-main {
  border-bottom: 1px solid hsla(0, 0%, 50.2%, 0.2);
}
@media (max-width: 1300px) {
  .menu-main__pill {
    display: none !important;
  }
}
.pill {
  align-items: center;
  background: hsla(0, 0%, 50.2%, 0.1);
  border-radius: 30px;
  color: var(--font-color);
  display: flex;
  font-size: 0.7rem;
  font-weight: 700;
  height: 20px;
  line-height: 1;
  padding: 1px 10px 0;
}
.pill--solid {
  background: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
  color: #000;
}
.contact {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  margin: 1rem auto;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  width: 90%;
  max-width: 40rem;
}
</style>
