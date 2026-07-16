<template>
  <ChatBot :initial-question="initialQuestion" />
</template>

<script setup>
import { useRoute } from 'vue-router'
import ChatBot from '../components/ChatBot.vue'

const route = useRoute()
const initialQuestion = route.query.q || ''
</script>
