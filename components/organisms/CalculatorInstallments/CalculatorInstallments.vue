<template>
  <div v-if="premiumValue !== null">
    <Separator />
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Chcesz rozłożyć składkę na raty?</AccordionTrigger>
        <AccordionContent>
          <div class="pb-2 text-sm">
            <p>Oferujemy możliwość rozłożenia na <strong>2</strong> lub <strong>4</strong> raty.</p>
            <p> Sprawdź kalkulację!</p>
          </div>
          <form @submit.prevent="onSubmit">
            <FormField v-slot="{ componentField }" name="selectedPayment">
              <FormItem>
                <Label>Ilość rat:</Label>
                <Select v-bind="componentField" v-model="selectedPayment" name="selectedPayment">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="twoPayments">
                        Dwie raty
                      </SelectItem>
                      <SelectItem value="fourPayments">
                        Cztery raty
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormField>
            <Button type="submit" class="w-full my-4" :disabled="isLoading">
              <span v-if="isLoading">
                <Loader2 class="w-4 h-4 mr-2 animate-spin" />
              </span>
              <span v-else>
                Oblicz raty
              </span>
            </Button>
          </form>
          <div v-if="showInstallments">
            <div>
              <div class="font-semibold text-center">
                <h3 class="text-lg">Twoja rata:</h3>
                <p v-if="payments === 'twoPayments'" class="text-3xl text-amber-600 py-2">2x {{ installment }} zł</p>
                <p v-if="payments === 'fourPayments'" class="text-3xl text-amber-600 py-2">4x {{ installment }} zł</p>
              </div>
              <div class="text-xs">
                <template v-if="payments === 'twoPayments'">
                  <p>Całkowita kwota składki: <strong>{{ premium }} zł</strong></p>
                </template>
                <template v-if="payments === 'fourPayments'">
                  <p>Całkowita kwota składki: <strong>{{ premium }} zł</strong></p>
                </template>
                <p class="italic">W przypadku rat do całkowitej składki doliczamy 200zł</p>
              </div>

            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePremiumStore } from '@/stores/Premium'
import { storeToRefs } from 'pinia'
import { Loader2 } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const premiumStore = usePremiumStore();
const { premiumValue } = storeToRefs(premiumStore);

const isLoading = ref(false);
const selectedPayment = ref('');
const premium = ref(null);
const installment = ref(null);
const payments = ref(null);
const showInstallments = ref(false);

const formSchema = toTypedSchema(
  z.object({
    selectedPayment: z.string({
      required_error: 'Proszę wybrać ilość rat',
    }).refine(value => {
      return value === 'twoPayments' || value === 'fourPayments';
    }, {
      message: 'Proszę wybrać formę rozliczenia: dwie raty lub cztery raty',
    }),
  })
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await form.validate()
    isLoading.value = true;

    const response = await fetch('/api/calculateinstallments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payments: values.selectedPayment,
        premiumValue: premiumValue.value,
      }),
    });

    if (!response.ok) {
      throw new Error('There was a problem processing your data');
    }

    const responseData = await response.json();

    premium.value = responseData.premium;
    installment.value = responseData.installment1;
    payments.value = responseData.payments;
    showInstallments.value = true;

  } catch (error: any) {
    console.error('Error sending data:', error.message);
  } finally {
    isLoading.value = false;
  }
});
</script>
