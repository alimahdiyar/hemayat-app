<template>
    <StackLayout verticalAlignment="middle">
        <Label style="margin-top: 10;text-align: center; font-size: 18; font-weight: bold" text="خطا در ارتباط با سرور" textWrap="true" />
        <Label style="margin: 20 0 5 0;text-align: center; font-size: 16" text="لطفا مجددا سعی کنید" textWrap="true" />
        
        <Button text="تلاش مجدد" @tap="$emit('retryRequest')" class="hemayat-btn" style="width: 200; margin-top: 10"/>

    </StackLayout>
</template>
<script>
export default {
    
}
</script>
<style scoped>

</style>