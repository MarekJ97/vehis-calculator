<template>
  <form @submit="onSubmit">
    <div>
      <Separator class="mb-4" />
      <div class="mb-2">
        <strong>Podaj wartość swojego samochodu</strong>
        <p class="text-xs text-muted-foreground">Obsługujemy auta do kwoty 400000zł netto</p>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <FormField v-slot="{ componentField }" name="carValue">
          <FormItem>
            <Label for="carValue">Wartość pojazdu:</Label>
            <FormControl>
              <Input type="number" id="carValue" placeholder="Kwota" v-bind="componentField" v-model="carValue" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="paymentType">
          <FormItem>
            <Label>Forma rozliczenia:</Label>
            <Select v-bind="componentField" v-model="paymentType">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="netto">
                    netto
                  </SelectItem>
                  <SelectItem value="brutto">
                    brutto
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div v-if="paymentType && carValue" class="text-sm py-1">
        Kwota {{ paymentType === 'netto' ? 'brutto' : 'netto' }}:
        <strong>{{ paymentType === 'netto' ? calculateBrutto(carValue) : calculateNetto(carValue) }} zł</strong>
      </div>
      <Separator class="my-4" />
    </div>

    <div>
      <div class="mb-2">
        <strong>Podaj rok produkcji auta</strong>
        <p class="text-xs text-muted-foreground">Nie obsługujemy samochodów starszych niż 5 lat</p>
      </div>
      <FormField v-slot="{ componentField }" name="productionYear">
        <FormItem>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="2024">
                  2024
                </SelectItem>
                <SelectItem value="2023">
                  2023
                </SelectItem>
                <SelectItem value="2022">
                  2022
                </SelectItem>
                <SelectItem value="2021">
                  2021
                </SelectItem>
                <SelectItem value="2020">
                  2020
                </SelectItem>
                <SelectItem value="2019">
                  2019
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
    <div>
      <Separator class="my-4" />
      <p class="mb-2"><strong>Dodatkowe wyposażenie</strong></p>
      <div class="grid gap-2">
        <FormField v-slot="{ value, handleChange }" name="gpsActive">
          <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
            <div class="space-y-0.5">
              <Label class="text-base">
                Pakiet Drive+
              </Label>
              <p class="text-sm text-muted-foreground">Nadajnik GPS - odznaczając tą opcję, kwota składki wzrośnie o 11%
              </p>
            </div>
            <FormControl>
              <Switch :checked="value" @update:checked="handleChange" />
            </FormControl>
          </FormItem>
        </FormField>
      </div>
    </div>
    <Button type="submit" class="w-full my-4" :disabled="isLoading">
      <span v-if="isLoading">
        <Loader2 class="w-4 h-4 mr-2 animate-spin" />
      </span>
      <span v-else>
        Oblicz składkę
      </span>
    </Button>
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-vue-next'
import { usePremiumStore } from '@/stores/Premium'

const isLoading = ref(false);
const premiumStore = usePremiumStore();

const formSchema = toTypedSchema(
  z.object({
    carValue: z.preprocess((value) => {
      return value === '' ? undefined : Number(value);
    }, z.number({
      required_error: 'Proszę wpisać wartość pojazdu',
      invalid_type_error: 'Proszę wpisać wartość pojazdu',
    }).positive('Wartość pojazdu musi być większa niż 0').refine(value => {
      const nettoValue = paymentType.value === 'brutto' ? value / 1.23 : value;
      return nettoValue <= 400000;
    }, {
      message: 'Nie obsługujemy kwot powyżej 400000 zł netto',
    })),
    paymentType: z.string({
      required_error: 'Proszę wybrać formę rozliczenia',
    }),
    productionYear: z.string({
      required_error: 'Proszę wybrać rok produkcji auta',
    }),
    gpsActive: z.boolean(),
  })
)

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    gpsActive: true,
  },
})

const premiumValue = ref(null);
const gpsValue = ref(null);
const grossCarValue = ref(null);
const netCarValue = ref(null);

const onSubmit = form.handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    const response = await fetch('/api/calculateinsurance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error('There was a problem processing your data');
    }

    const responseData = await response.json();
    if (responseData.error) {
      console.error(responseData.error);
    } else {
      premiumValue.value = responseData.premium;
      gpsValue.value = responseData.gpsActive;
      grossCarValue.value = responseData.grossCarValue
      netCarValue.value = responseData.netCarValue
      premiumStore.setPremiumData({
        premium: responseData.premium,
        netCarValue: responseData.netCarValue,
        grossCarValue: responseData.grossCarValue,
        gpsValue: responseData.gpsActive,
      });
    }

  } catch (error: any) {
    console.error('Error sending data:', error.message);
  } finally {
    isLoading.value = false;
  }
});

const carValue = ref('');
const paymentType = ref('');

const calculateBrutto = (value: string) => {
  return value ? (parseFloat(value) * 1.23).toFixed(2) : '';
}

const calculateNetto = (value: string) => {
  return value ? (parseFloat(value) / 1.23).toFixed(2) : '';
}
</script>
