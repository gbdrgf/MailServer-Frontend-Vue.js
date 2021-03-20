<template>
  <div class="message message--new ">
    <div class="message__actions">
      <span class="menu-main__pill pill">{{ priority }}</span>
      <input type="button" id="delete" />
      <label for="delete" class="message__icon " @click="$emit('delete', date)">
        <i class="message__icon fas fa-trash-alt"></i>
      </label>
    </div>
    <div class="message__content">
      <div class="message__exp">
        <div>Receiver: {{ name }}</div>
        <div class="date">{{ date }}</div>
      </div>
      <div class="message__exp">Sender: {{ email }}</div>
      <div class="message__title">{{ subject }}</div>
      <div class="buttons message__email">
        <button class="fill" @click="toggleDetails">
          {{ detailsAreVisible ? "Hide" : "Show" }} Message
        </button>
      </div>
      <div v-if="detailsAreVisible">
        <div class="message__expr">
          <p>« {{ message }} »</p>
          <p>Attachments: "{{ attachments }}"</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "id",
    "name",
    "email",
    "subject",
    "message",
    "date",
    "priority",
    "attachments"
  ],
  data() {
    return {
      detailsAreVisible: false
    };
  },
  emits: ["delete"],

  methods: {
    toggleDetails() {
      this.detailsAreVisible = !this.detailsAreVisible;
    }
  }
};
</script>

<style scoped>
.message {
  background: hsla(0, 0%, 50.2%, 0.08);
  border: 1px solid hsla(0, 0%, 50.2%, 0.2);
  border-bottom: 0;
  color: hsla(0, 0%, 50.2%, 0.9);
  cursor: pointer;
  display: grid;
  grid-template-columns: auto 1fr;
  position: relative;
}
.message:hover {
  background: rgba(206, 203, 203, 0.2);
}

.message--new {
  background: var(--background-color);
  color: var(--font-color);
}
.message--active:before {
  background: #B165D4;
  border-radius: 5px;
  bottom: 3px;
  content: "";
  left: 3px;
  position: absolute;
  top: 3px;
  width: 4px;
  z-index: 1;
}
.message__content {
  padding: 15px 15px 15px 0;
}
@media (max-width: aut) {
  .message__content {
    padding: 10px 15px 10px 0;
  }
}
.message__exp {
  color: hsla(0, 0%, 50.2%, 0.8);
  display: flex;
  font-size: 0.8rem;
  font-style: italic;
  font-weight: 700;
  justify-content: space-between;
}
.message__expr {
  font-size: 0.9rem;
  font-style: italic;
  max-width: 900px;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (max-width: 600px) {
  .message__expr {
    max-width: 1000px;
  }
}
.message__title {
  font-weight: 700;
  text-align: left;
}
.message__email {
  text-align: left;
}
.message__actions {
  align-content: space-between;
  display: grid;
  grid-auto-flow: row;
  grid-gap: 5px;
  padding: 15px;
  text-align: center;
  transform: translateX(-10px);
  transition: transform 0.2s ease;
  visibility: hidden;
}
.message__icon {
  color: hsla(0, 0%, 50.2%, 0.5);
  font-size: 0.9rem;
}
.message__icon:hover {
  color: var(--font-color);
}
.message:hover .message__actions {
  transform: translateX(0);
  visibility: visible;
}
button {
  background: none;
  border: 2px solid;
  font: inherit;
  line-height: 1;
}
button {
  color: var(--color);
  -webkit-transition: 0.25s;
  transition: 0.25s;
}
button:hover,
button:focus {
  border-color: var(--hover);
  color: #fff;
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
</style>
