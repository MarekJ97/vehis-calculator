<template>
  <div v-if="premiumValue !== null">
    <Separator class="mb-4" />
    <div class="font-semibold text-center">
      <h3 class="text-lg">Twoja roczna składka OC/AC:</h3>
      <p class="text-3xl text-lime-500 py-2">{{ premiumValue }} zł</p>
    </div>
    <div class="text-xs pt-2">
      <p class="italic pb-1">Orientacyjna roczna składka OC/AC szacowana na podstawie podanych danych:</p>
      <p>Wartość auta netto: <strong>{{ netCarValue }} zł</strong></p>
      <p>Wartość auta brutto: <strong>{{ grossCarValue }} zł</strong></p>
      <p>GPS: <strong>{{ gpsValue }}</strong></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePremiumStore } from '@/stores/Premium'
import { storeToRefs } from 'pinia'

const premiumStore = usePremiumStore();
const { premiumValue, netCarValue, grossCarValue, gpsValue } = storeToRefs(premiumStore);
</script>