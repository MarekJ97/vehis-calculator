<template>
	<Card class="mx-auto max-w-sm">
		<CardHeader>
			<CardTitle class="text-xl">
				Oszacuj składkę OC/AC
			</CardTitle>
			<CardDescription>
				Wprowadź potrzebne dane do obliczenia składki
			</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="grid gap-4">
				<CalculatorForm />
				<Premium />
				<CalculatorInstallments />
			</div>
		</CardContent>
	</Card>
</template>

<script setup>
import CalculatorForm from '@/components/organisms/CalculatorForm/CalculatorForm.vue';
import Premium from '~/components/molecules/Premium/Premium.vue'
import CalculatorInstallments from '~/components/organisms/CalculatorInstallments/CalculatorInstallments.vue';
</script>