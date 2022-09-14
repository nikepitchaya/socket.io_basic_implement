<template>
  <div class="w-full flex flex-col items-center">
    <h1 class="text-4xl">
      Socket.io with Nuxt.js
    </h1>
    <div v-if="!access" class="w-full flex justify-center space-x-1">
      <input placeholder="Guest name" class="border-2 border-red-400 rounded-sm" v-model="name" />
      <input placeholder="Room id" class="border-2 border-red-400 rounded-sm" v-model="room" />
      <button @click="joinRoom">Join</button>
    </div>
    <div v-else class="w-full flex flex-col items-center">
      <h1>Response from server (Live chat)</h1>
      <p>Welcome {{name}} to room {{room}}</p>
      <div class="w-96 h-96 flex flex-col overflow-auto bg-blue-300 rounded-sm">
        <div v-for="(item,i) in chat" :key="`chat-${i}`" class="w-full mt-1">
          <div v-if="item.name != name" class="w-full flex justify-start">
            <div class="bg-red-300 px-2 rounded-md">
              <p>Form {{item.name}}: {{item.message}}</p>
              <p>time :{{item.time}}</p>
            </div>
          </div>
          <div v-else class="w-full flex justify-end">
            <div class="bg-green-300 px-2 rounded-md">
              <p>Me : {{item.message}}</p>
              <p>time :{{item.time}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full flex justify-center space-x-1">
        <input placeholder="Message" class="border-2 border-red-400 rounded-sm" v-model="message" />
        <button @click="sendMessage">Send</button>
      </div>
    </div>

  </div>
</template>

<script>
import socket from "../plugins/socket.io"
export default {
  name: 'IndexPage',
  data() {
    return {
      message: '',
      agent: '',
      name: '',
      room: '',
      access: false,
      chat: new Array(),
    }
  },
  mounted() {
    socket.on('receive_access', (res) => {
      this.agent = res.name
    })
    socket.on('receive_message', (res) => {
      console.log(res)
      this.chat.push(res)
    })
  },
  methods: {
    sendMessage() {
      if (this.message !== '') {
        let chat = {
          message: this.message,
          name: this.name,
          room: this.room,
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        }
        socket.emit('send_message', chat)
      }
    },
    joinRoom() {
      if (this.name !== '' && this.room !== '') {
        socket.emit('join_room', { room: this.room, name: this.name })
        this.access = true
      }
    },
  },
}
</script>
