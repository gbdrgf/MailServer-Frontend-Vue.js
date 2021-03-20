<template>
  <div class="app" id="App">
    <div class="app__content">
      <div class="menu">
        <div class="menu-user">
          <div class="profile-head">
            <div class="profile-head__id">
              <img
                class="profile-head__avatar"
                src="https://i.ibb.co/ryXm152/4.png"
                alt=""
              />
              <div>
                <div class="profile-head__name">{{ user[0] }}</div>
                <div class="profile-head__mail">{{ user[1] }}</div>
              </div>
            </div>
            <div class="profile-head__options" @click="logout">
              <i class="fas fa-sign-out-alt"></i>
            </div>
          </div>
        </div>
        <div>
          <div class="menu-main">
            <div class="menu__item active" id="inbox" @click="Inbox">
              <div>
                <i class="menu__icon fas fa-inbox"></i>
                <span class="menu__label">Inbox</span>
              </div>
              <span class="menu-main__pill pill">{{ inboxArray.length }}</span>
            </div>
            <div class="menu__item" id="sent" @click="Sent">
              <div>
                <i class="menu__icon fas fa-paper-plane"></i>
                <span class="menu__label">Sent mail</span>
              </div>
              <span class="menu-main__pill pill">{{ sentArray.length }}</span>
            </div>
            <div class="menu__item" id="drafts" @click="Draft">
              <div>
                <i class="menu__icon fas fa-pencil-alt"></i>
                <span class="menu__label">Drafts</span>
              </div>
              <span class="menu-main__pill pill">{{ draftsArray.length }}</span>
            </div>
            <div class="menu__item" id="trash" @click="Trash">
              <div>
                <i class="menu__icon fas fa-trash-alt"></i>
                <span class="menu__label">Trash</span>
              </div>
              <span class="menu-main__pill pill">{{ trashArray.length }}</span>
            </div>
            <div class="menu__item" id="contacts" @click="contacts">
              <div>
                <i class="menu__icon far fa-address-book"></i>
                <span class="menu__label"> Contacts</span>
              </div>
              <span class="menu-main__pill pill">{{ friends.length }}</span>
            </div>
          </div>
        </div>
        <div class="new">
          <button @click="newMail" class="new__button new-mail__toggle">
            <i class="fas fa-plus"></i>
          </button>
          <div class="new-mail">
            <div class="new-mail__top">
              <div class="new-mail__title">
                <span>New message</span>
              </div>
              <i
                @click="newMail"
                class="new-mail__close new-mail__toggle fas fa-times"
              ></i>
            </div>
            <div class="new-mail-exp">
              <div class="new-mail-exp__item">
                <div class="new-mail-exp__label">To</div>
                <input
                  placeholder="Enter email"
                  v-model="Email"
                  type="text"
                  class="new-mail-exp__input"
                />
              </div>
              <div class="new-mail-exp__item">
                <div class="new-mail-exp__label">Object</div>
                <input
                  placeholder="Enter mail object"
                  v-model="Subject"
                  type="text"
                  class="new-mail-exp__input"
                />
              </div>
            </div>
            <div class="new-mail__content">
              <textarea class="new-mail__message" v-model="Body"></textarea>
            </div>
            <div class="new-mail-foot">
              <div class="new-mail-foot__insert">
                <div>
                  <input type="file" @change="onFileSelected" />
                </div>

                <div>
                  <label for="Pbox"
                    >Priority
                    <input
                      id="Pbox"
                      type="number"
                      min="1"
                      max="5"
                      step="1"
                      v-model.number="Priority"
                    />
                  </label>
                </div>
              </div>
              <div class="new-mail-foot__actions">
                <button
                  @click="sendNewMessageToDraft"
                  class="button button new-mail__toggle"
                >
                  DRAFT
                </button>
                <button class="button button--primary" @click="sendNewMessage">
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mails">
        <div v-if="contactsSelected" class="message-list scrollable">
          <div class="scrollable__target">
            <mail
              v-for="email in emails"
              :key="email.id"
              :id="email.id"
              :name="email.name"
              :subject="email.subject"
              :email="email.email"
              :date="email.date"
              :priority="email.priority"
              :message="email.message"
              :attachments="email.attachments"
              @delete="deleteMail"
            ></mail>
          </div>
        </div>

        <div v-else id="hide" class="message-list scrollable">
          <div class="scrollable__target">
            <new-contact @add-contact="addContact"></new-contact>
            <ul>
              <contacts-comp
                v-for="friend in friends"
                :key="friend.id"
                :id="friend.id"
                :name="friend.name"
                :phone-number="friend.phone"
                :email-address="friend.email"
                @remove="deleteContact"
              ></contacts-comp>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ContactsComp from "../components/ContactsComp.vue";
import Mail from "../components/Mail.vue";
import NewContact from "../components/NewContact.vue";
import axios from "axios";
export default {
  components: { Mail, NewContact, ContactsComp },
  name: "Secure",
  data() {
    return {
      emails: [],
      arrDisplay: [],
      inboxArray: [],
      sentArray: [],
      draftsArray: [],
      trashArray: [],
      modeVisible: false,
      search: "",
      list: ["Name", "E-mail", "Subject", "Message", "Date", "Priority"],
      visible: false,
      selectedFilter: "",
      selectedSort: "",
      FORS: 0,
      contactsSelected: false,
      friends: [],
      Email: "",
      Subject: "",
      Body: "",
      Priority: "",
      selectedFile: null,
      user: ["Ahmed Akram", "akramovic@fmail.com"],
      selectedFromMenu: "",
      arr: "",
      check: ""
    };
  },
  mounted() {
    this.getUser();
    this.contacts();
    this.Trash();
    this.Draft();
    this.Sent();
    this.Inbox();
    this.selectedFilter = "noFilter";
    this.selectedSort = "noSort";
    this.arrDisplay = this.emails;
    this.contactsSelected = true;
  },

  methods: {
    async getUser() {
      console.log("test");
      await axios
        .get("http://localhost:8085/api/user")
        .then(res => (this.user = res.data));
      console.log("test");
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
    },

    async logout() {
      await axios.get("http://localhost:8085/api/signout");
      this.$router.push("/");
    },
    async addContact(name, email) {
      const newFriendContact = {
        name: name,
        email: email
      };
      await axios
        .get("http://localhost:8085/api/addContacts", {
          params: { email: newFriendContact.email }
        })
        .then(res => (this.check = res.data));
      if (this.check == true) {
        this.friends.push(newFriendContact);
      } else {
        alert("This contact is not in server");
      }
    },
    deleteContact(friendEmail) {
      axios.get("http://localhost:8085/api/deleteContact", {
        params: { email: friendEmail }
      });
      this.friends = this.friends.filter(
        friend => friend.email !== friendEmail
      );
    },
    async deleteMail(mailDate) {
      this.arr = [mailDate, this.selectedFromMenu];
      console.log(this.selectedFromMenu);
      await axios
        .get("http://localhost:8085/api/delete", {
          params: { arr: this.arr + "" }
        })
        .then(res => console.log(res));

      this.emails = this.emails.filter(email => email.date !== mailDate);
    },
    darkMode() {
      const app = document.querySelector(".app");
      app.classList.toggle("dark-mode");
    },

    changeClass(id) {
      var choice = document.getElementById(id);
      var IDsArray = ["inbox", "sent", "trash", "drafts"];
      choice.className = "menu__item active";
      for (var i = 0; i < IDsArray.length; i++) {
        var arr = IDsArray[i];
        if (arr !== id) {
          var otherBtn = document.getElementById(IDsArray[i]);
          otherBtn.classList.remove("active");
        }
      }
    },
    newMail() {
      document.querySelector(".new-mail").classList.toggle("active");
      document.querySelector(".new__button").classList.toggle("active");
    },
    async Inbox() {
      this.selectedFromMenu = "Inbox";
      var choice = document.getElementById("inbox");
      choice.className = "menu__item active";
      document.getElementById("contacts").classList.remove("active");
      document.getElementById("sent").classList.remove("active");
      document.getElementById("trash").classList.remove("active");
      document.getElementById("drafts").classList.remove("active");
      this.contactsSelected = true;
      await axios
        .get("http://localhost:8085/api/getIndex", {
          params: { folder: this.selectedFromMenu }
        })
        .then(res => (this.emails = res.data));
      this.inboxArray = this.emails;
    },
    async Sent() {
      this.selectedFromMenu = "Sent";
      var choice = document.getElementById("sent");
      choice.className = "menu__item active";
      document.getElementById("contacts").classList.remove("active");
      document.getElementById("inbox").classList.remove("active");
      document.getElementById("trash").classList.remove("active");
      document.getElementById("drafts").classList.remove("active");
      this.contactsSelected = true;
      await axios
        .get("http://localhost:8085/api/getIndex", {
          params: { folder: this.selectedFromMenu }
        })
        .then(res => (this.emails = res.data));
      this.sentArray = this.emails;
    },
    async Draft() {
      this.selectedFromMenu = "Draft";
      var choice = document.getElementById("drafts");
      choice.className = "menu__item active";
      document.getElementById("contacts").classList.remove("active");
      document.getElementById("sent").classList.remove("active");
      document.getElementById("trash").classList.remove("active");
      document.getElementById("inbox").classList.remove("active");
      this.contactsSelected = true;
      await axios
        .get("http://localhost:8085/api/getIndex", {
          params: { folder: this.selectedFromMenu }
        })
        .then(res => (this.emails = res.data));
      this.draftsArray = this.emails;
    },
    async Trash() {
      this.selectedFromMenu = "Trash";
      var choice = document.getElementById("trash");
      choice.className = "menu__item active";
      document.getElementById("contacts").classList.remove("active");
      document.getElementById("sent").classList.remove("active");
      document.getElementById("drafts").classList.remove("active");
      document.getElementById("inbox").classList.remove("active");
      this.contactsSelected = true;
      await axios
        .get("http://localhost:8085/api/getIndex", {
          params: { folder: this.selectedFromMenu }
        })
        .then(res => (this.emails = res.data));
      this.trashArray = this.emails;
    },
    async selectFilter(option) {
      this.FORS = 0;
      this.selectedFilter = option;
      if (this.selectedFilter == "noFilter") {
        this.arr = [this.selectedFromMenu, "date"];
        await axios("http://localhost:8085/api/sort", {
          params: { a: this.arr + "" }
        }).then(res => (this.emails = res.data));
      } else {
        this.arr = [this.selectedFromMenu, this.selectedFilter, this.search];
        console.log(this.arr);
        console.log(this.emails);
        await axios("http://localhost:8085/api/filter", {
          params: { a: this.arr + "" }
        }).then(res => (this.emails = res.data));
        console.log(this.emails);
      }
    },
    async selectSort(option) {
      this.FORS = 1;
      this.selectedSort = option;
      if (this.selectedSort == "noSort") {
        this.selectedSort = "date";
      }
      this.arr = [this.selectedFromMenu, this.selectedSort];
      console.log(this.arr);

      await axios("http://localhost:8085/api/sort", {
        params: { a: this.arr + "" }
      }).then(res => (this.emails = res.data));
    },
    async sendNewMessage() {
      console.log("print");
      if (this.Priority == "") {
        this.Priority = "5";
      }
      if (this.selectedFile == null) {
        this.arr = [this.Email, this.Priority, this.Body, this.Subject];
      } else {
        this.arr = [
          this.Email,
          this.Priority,
          this.Body,
          this.Subject,
          this.selectedFile
        ];
      }

      console.log(this.arr);
      await axios
        .get("http://localhost:8085/api/sendEmail", {
          params: { arr: this.arr + "" }
        })
        .then(res => (this.check = res.data));
      console.log(this.check);
      if (this.check == true) {
        alert("E-mail sent successfully");
      } else {
        alert("A field is missing or no such receiver");
      }
      this.newMail();
      this.Email = "";
      this.Priority = "";
      this.Body = "";
      this.Subject = "";
      this.selectedFile = "";
    },
    async sendNewMessageToDraft() {
      if (this.Priority == "") {
        this.Priority = "5";
      }
      if (this.selectedFile == null) {
        this.arr = [this.Email, this.Priority, this.Body, this.Subject];
      } else {
        this.arr = [
          this.Email,
          this.Priority,
          this.Body,
          this.Subject,
          this.selectedFile
        ];
      }

      console.log(this.arr);
      await axios.get("http://localhost:8085/api/draftEmail", {
        params: { arr: this.arr + "" }
      });
      this.newMail();
      this.Email = "";
      this.Priority = "";
      this.Body = "";
      this.Subject = "";
      this.selectedFile = "";
      alert("E-mail drafted successfully");
    },
    async contacts() {
      this.selectedFromMenu = "Contacts";
      var choice = document.getElementById("contacts");
      choice.className = "menu__item active";
      document.getElementById("inbox").classList.remove("active");
      document.getElementById("sent").classList.remove("active");
      document.getElementById("trash").classList.remove("active");
      document.getElementById("drafts").classList.remove("active");
      this.contactsSelected = false;
      await axios
        .get("http://localhost:8085/api/getContacts")
        .then(res => (this.friends = res.data));
    }
  }
};
</script>

<style scoped>
.app {
  background: var(--background-color);
  border-radius: 7px;
  box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.2);
  display: grid;
  font-family: Nunito, sans-serif;
  grid-template-rows: auto;
  height: 100vh;
  line-height: 1.5;
  min-width: 800px;
  overflow: auto;
  position: relative;
}

.app__content {
  display: grid;
  grid-template-columns: 1fr 4fr;
}
@media (max-width: 900px) {
  .app__content {
    grid-template-columns: 1fr 6fr;
  }
}

.mails {
  display: grid;
  grid-template-columns: minmax(auto, auto);
}
*,
:after,
:before {
  box-sizing: border-box;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  scrollbar-width: thin;
}
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-clip: content-box;
  background-color: hsla(0, 0%, 47.1%, 0);
  border: 2px solid transparent;
  border-radius: 20px;
}
button,
input,
textarea {
  color: #444;
  font-family: Nunito, sans-serif;
  font-size: 1rem;
  line-height: 1.4;
}
.button {
  background: #ebebeb;
  border: 0;
  border-radius: 100px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1;
  outline: 0;
  padding: 10px 25px;
  text-transform: uppercase;
}
.button--primary {
  background: #b165d4;
  color: var(--background-color);
}
.date {
  color: hsla(0, 0%, 50.2%, 0.8);
  font-size: 0.8rem;
  font-style: italic;
  font-weight: 400;
}
.dot {
  border-radius: 8px;
  display: inline-block;
  height: 8px;
  margin-right: 3px;
  position: relative;
  top: -1px;
  width: 16px;
}

.scrollable {
  position: relative;
}
.scrollable__target {
  bottom: 0;
  left: 0;
  overflow: auto;
  position: absolute;
  right: 0;
  top: 0;
}
.message-list {
  border-right: 1px solid hsla(0, 0%, 50.2%, 0.2);
}
.message-list > .scrollable__target {
  padding: 15px 5px 15px 15px;
}
.message-list:hover ::-webkit-scrollbar-thumb {
  background-color: hsla(0, 0%, 47.1%, 0.2);
}
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
.message:first-of-type {
  border-radius: 5px 5px 0 0;
}
.message:last-of-type {
  border-bottom: 1px solid hsla(0, 0%, 50.2%, 0.2);
  border-radius: 0 0 5px 5px;
}
.message--new {
  background: var(--background-color);
  color: var(--font-color);
}
.message--active:before {
  background: #b165d4;
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
@media (max-width: 1020px) {
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
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media (max-width: 1020px) {
  .message__expr {
    max-width: 1000px;
  }
}
.message__title {
  font-weight: 700;
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
.message-tags {
  bottom: 2px;
  line-height: 1;
  position: absolute;
  right: 2px;
}
.menu {
  border-right: 1px solid hsla(0, 0%, 50.2%, 0.2);
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 10px 20px 20px;
  position: relative;
  z-index: 1;
}
@media (max-width: 700px) {
  .menu {
    padding: 10px;
  }
}
.menu-user {
  border-bottom: 1px solid hsla(0, 0%, 50.2%, 0.2);
  margin-bottom: 20px;
  padding: 10px 10px 15px;
}
@media (max-width: 700px) {
  .menu-user {
    margin-bottom: 10px;
    padding: 10px 0 15px;
  }
  .menu-user .profile-head__mail,
  .menu-user .profile-head__name {
    display: none;
  }
}
.menu-tags {
  font-size: 0.9rem;
  font-weight: 700;
  padding: 20px 0 0;
}
@media (max-height: 700px) {
  .menu-tags {
    display: none;
  }
}
@media (max-width: 1300px) {
  .menu-tags__label {
    display: none;
  }
}
.menu-tags__item {
  border-radius: 50px;
  color: hsla(0, 0%, 50.2%, 0.8);
  cursor: pointer;
  margin-bottom: 2px;
  padding: 2px 10px;
}
.menu-tags__item:hover {
  background: hsla(0, 0%, 50.2%, 0.1);
}
@media (max-width: 1300px) {
  .menu-tags__item {
    text-align: center;
  }
}
.menu-main {
  border-bottom: 1px solid hsla(0, 0%, 50.2%, 0.2);
}
@media (max-width: 1300px) {
  .menu-main__pill {
    display: none !important;
  }
}
.menu__icon {
  color: hsla(0, 0%, 50.2%, 0.4);
  margin-right: 10px;
}
@media (max-width: 1300px) {
  .menu__icon {
    margin-right: 0;
  }
}
.menu__item {
  align-items: center;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 15px 30px;
  transition: background 0.15s ease;
}
@media (max-width: 1300px) {
  .menu__item {
    display: block;
    font-size: 1.5rem;
    margin-bottom: 5px;
    padding: 5px 10px 7px;
    text-align: center;
  }
}
.menu__item:hover {
  background: hsla(0, 0%, 50.2%, 0.1);
}
.menu__item.active {
  background: #b165d4;
  color: #fff;
}
.menu__item.active .menu__icon {
  color: hsla(0, 0%, 100%, 0.8);
}
.menu__item-dark {
  align-items: center;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 15px 30px;
  transition: background 0.15s ease;
}
@media (max-width: 1300px) {
  .menu__item-dark {
    display: block;
    font-size: 1.5rem;
    margin-bottom: 5px;
    padding: 5px 10px 7px;
    text-align: center;
  }
}

.menu__label {
  font-weight: 700;
}
@media (max-width: 1300px) {
  .menu__label {
    display: none;
  }
}
@media (max-width: 1300px) {
  .new {
    text-align: center;
  }
}
.new__button {
  background: #b165d4;
  border: 0;
  border-radius: 50px;
  color: var(--background-color);
  cursor: pointer;
  font-size: 1.6rem;
  height: 50px;
  outline: 0;
  transition: transform 0.2s ease;
  width: 50px;
}
.new__button:hover {
  transform: scale(1.1);
}
.new-mail,
.new__button.active {
  transform: scale(0);
}
.new-mail {
  background: rgb(228, 228, 228);
  border: 1px solid hsla(0, 0%, 50.2%, 0.2);
  border-radius: 7px;
  bottom: 20px;
  box-shadow: 0 11px 20px 0 transparent;
  left: 20px;
  opacity: 1;
  position: absolute;
  transform-origin: bottom left;
  transition-duration: 0.3s;
  transition-property: transform, visibility, opacity;
  transition-timing-function: ease-in-out;
  visibility: hidden;
  width: 600px;
  z-index: 99;
}
.new-mail__title {
  color: black;
}
.new-mail__close {
  color: black;
  cursor: pointer;
  padding: 5px;
}
.new-mail.active {
  box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.2);
  opacity: 1;
  transform: scale(1);
  visibility: visible;
}
.new-mail__top {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 10px 10px 10px 40px;
}
.new-mail-exp,
.new-mail__top {
  border-bottom: 1px solid hsla(0, 0%, 50.2%, 0.2);
  font-weight: 700;
}
.new-mail-exp {
  background: hsla(0, 0%, 50.2%, 0.1);
  color: #636363;
  padding: 10px 40px;
}
.new-mail-exp__item {
  align-items: center;
  display: grid;
  grid-template-columns: 70px 1fr;
  margin-bottom: 10px;
}
.new-mail-exp__input {
  background: transparent;
  border: 0;
  border-bottom: 1px solid hsla(0, 0%, 50.2%, 0.2);
  font-weight: 700;
  outline: 0;
  padding: 5px;
  width: 100%;
}
.new-mail-exp__input::placeholder {
  color: #9c9c9c;
  font-style: italic;
  font-weight: 400;
}
.new-mail-exp__label {
  font-size: 0.8rem;
}
.new-mail-foot {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 20px 40px;
}
.new-mail-foot__icon {
  border-radius: 5px;
  color: #b1b1b1;
  cursor: pointer;
  padding: 10px;
}
.new-mail-foot__icon:hover {
  background: rgba(0, 0, 0, 0.07);
  color: #6d6d6d;
}
.new-mail__message {
  background: rgb(228, 228, 228);
  border: 1px solid transparent;
  border-radius: 5px;
  color: #000000;
  max-height: 50vh;
  min-height: 30vh;
  outline: 0;
  padding: 20px 40px;
  resize: vertical;
  width: 100%;
}
.paragraph {
  margin: 20px 0;
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
.preview {
  display: grid;
  grid-template-rows: auto 1fr auto;
}
.preview:hover ::-webkit-scrollbar-thumb {
  background-color: hsla(0, 0%, 47.1%, 0.3);
}
@media (max-width: 1800px) {
  .preview {
    border-top: 1px solid hsla(0, 0%, 50.2%, 0.2);
  }
}
.preview__title {
  font-size: 1.6rem;
  font-weight: 700;
}
.preview-top {
  align-items: center;
  border-bottom: 1px solid hsla(0, 0%, 50.2%, 0.2);
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
}
.preview-top__icon {
  color: hsla(0, 0%, 50.2%, 0.5);
  cursor: pointer;
  padding: 5px;
}
.preview-top__icon:hover {
  color: grey;
}
.preview-content {
  padding: 20px;
}
.preview-respond {
  background: var(--background-color);
  border: 1px solid hsla(0, 0%, 50.2%, 0.2);
  border-radius: 5px;
  box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.1);
  margin: 0 auto 20px;
  max-width: 600px;
}
.preview-respond__who {
  font-weight: 700;
}
.preview-respond__who-mail {
  color: #838383;
  font-size: 0.8rem;
}
.preview-respond__head {
  border-bottom: 1px solid hsla(0, 0%, 50.2%, 0.2);
  padding: 10px 20px;
}
.preview-respond__content {
  padding: 20px 40px;
}
.preview-foot {
  border-top: 1px solid hsla(0, 0%, 50.2%, 0.2);
  display: flex;
  justify-content: flex-end;
  padding: 20px;
}
.preview-foot__button {
  margin-left: 10px;
}
.profile-head {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
}
.profile-head__id {
  align-items: center;
  display: flex;
}
.profile-head__name {
  font-weight: 700;
}
.profile-head__mail {
  color: hsla(0, 0%, 50.2%, 0.8);
  font-size: 0.8rem;
}
.profile-head__avatar {
  border-radius: 30px;
  display: inline-block;
  margin-right: 10px;
  width: 30px;
}
.top-menu__item:hover > .top-menu-sub {
  top: calc(100% - 1px);
  visibility: visible;
}
.top-menu__item:hover > .top-menu__label {
  border: 1px solid hsla(0, 0%, 50.2%, 0.2);
  border-bottom: 1px solid var(--background-color);
  border-radius: 5px 5px 0 0;
}
.slideBtn label {
  display: block;
  width: 34px;
  height: 20px;
  cursor: pointer;
  position: absolute;
  top: 3px;
  left: 3px;
  z-index: 1;
  background: #fcfff4;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#fcfff4),
    color-stop(40%, #dfe5d7),
    to(#b3bead)
  );
  background: linear-gradient(to bottom, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
  border-radius: 50px;
  -webkit-transition: all 0.4s ease;
  transition: all 0.4s ease;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.3);
}
.slideBtn input[type="checkbox"] {
  visibility: hidden;
}
.slideBtn input[type="checkbox"]:checked + label {
  left: 43px;
}
button {
  background: none;
  border: 2px solid;
  font: inherit;
  line-height: 1;
}
button {
  color: #b165d4;
  -webkit-transition: 0.25s;
  transition: 0.25s;
}
button:hover,
button:focus {
  border-color: #b165d4;
  color: rgb(0, 0, 0);
}

input[type="button"] {
  display: none;
}

.slideBtn {
  width: 80px;
  height: 26px;
  background: #b165d4;
  margin: 20px auto;
  position: relative;
  border-radius: 50px;
  box-shadow: inset 0px 1px 1px rgba(255, 255, 255, 0.5),
    0px 1px 0px rgba(255, 255, 255, 0.2);
}
.slideBtn label {
  display: block;
  width: 34px;
  height: 20px;
  cursor: pointer;
  position: absolute;
  top: 3px;
  left: 3px;
  z-index: 1;
  background: #fcfff4;
  border-radius: 50px;
  -webkit-transition: all 0.4s ease;
  transition: all 0.4s ease;
  box-shadow: 0px 2px 5px 0px #b165d4;
}
.slideBtn input[type="checkbox"] {
  visibility: hidden;
}
.slideBtn input[type="checkbox"]:checked + label {
  left: 43px;
}
</style>
