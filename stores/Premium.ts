import { defineStore } from 'pinia'

export const usePremiumStore = defineStore('premium', {
  state: () => ({
    premiumValue: null as number | null,
    netCarValue: null as number | null,
    grossCarValue: null as number | null,
    gpsValue: null as string | null,
  }),
  actions: {
    setPremiumData(data: { premium: number, netCarValue: number, grossCarValue: number, gpsValue: string }) {
      this.premiumValue = data.premium
      this.netCarValue = data.netCarValue
      this.grossCarValue = data.grossCarValue
      this.gpsValue = data.gpsValue
    },
  },
})
