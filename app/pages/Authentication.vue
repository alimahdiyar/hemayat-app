<template>
        <Page style="background-color: #f5f5f5">

            <ActionBar flat="true">
                <Label text="حمایت" horizontalAlignment="center" style="padding: 15; font-size: 20; color: white"/>
            </ActionBar>

            <FlexboxLayout alignItems="center" justifyContent="space-around">

                <NetworkFailure dock="bottom" v-if="networkFailureRetryObject" @retryRequest="networkFailureRetry"></NetworkFailure>

                <ActivityIndicator v-else-if="loadingLocal" width="50" busy="true"></ActivityIndicator>

                <StackLayout v-else verticalAlignment="middle" class="new-user-container" style="width: 100%; border-radius: 150;">
                
                    <Label text="نام کاربری" textWrap="false" class="new-user-title" style="text-align: left" />
                    
                    <TextField autocapitalizationType="none" class="new-user-input iransans-fa-num" :class="{'new-user-input-error': errors.username}" v-model="user.username" />
                    <Label v-show="errors.username" :text="errors.username" class="new-user-input-error-label" textWrap="true" />
                    
                    <Label text="کلمه عبور" textWrap="false" class="new-user-title" />

                    <TextField @returnPress="this.login" secure="true" class="new-user-input" :class="{'new-user-input-error': errors.password}" v-model="user.password" />
                    <Label v-show="errors.password" :text="errors.password" class="new-user-input-error-label" textWrap="true" />

                    <Button text="ورود" style="margin-top: 20;" @tap="login" class="hemayat-btn" />

                </StackLayout>
                
            </FlexboxLayout>
            
            
        </Page>
</template>

<script>
import * as http from "tns-core-modules/http";
import { hostUrl } from '~/config'

export default {
    data(){
        return {
            loadingLocal: false,
            user: {
                username: '',
                password: '',
            },
            errors: {
                username: '',
                passowrd: '',
            }
        }
    },
    methods: {
        login(){
            let formValid = true;

            for (const errorKey in this.errors) {
                this.errors[errorKey] = '';
            }

            if(this.user.username.length == 0){
                this.errors.username = 'لطفا نام کاربری را وارد کنید';
                formValid = false;
            }

            if(this.user.password.length == 0){
                this.errors.password = 'لطفا این مورد را وارد کنید';
                formValid = false;
            }

            if(formValid){
                this.loadingLocal = true;
                const vinst = this;
                http.request({
                    url: hostUrl + '/api/v3/obtain-auth-token/',
                    method: "POST",
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Content-Type': 'application/json'
                    },
                    content: JSON.stringify(vinst.user)
                }).then(response => {
                    const token = response.content.toJSON().token;
                    if(token){
                        this.$store.dispatch('saveUserToken', token)
                    } else {
                        alert({
                            title: '',
                            message: 'لطفا ورودی های خود را کنترل کنید',
                            okButtonText: 'تایید'
                        })
                    }
                    vinst.loadingLocal = false;
                }).catch((error) => {
                    this.onNetworkFailure({ func: this.login, args: [] });
                    console.log(error)
                })

            }
        },
    },
    created(){

    }
}
</script>

<style scoped>
.new-user-container {
    padding: 10;
}
.new-user-title {
    color: black;
    text-align: left;
    font-size: 16;
    font-weight: normal;
    padding: 5 10;
}
.new-user-input {
    padding: 10 5;
    border-width: 1;
    border-color: #aaaaaa;
    margin: 3 10;
    font-size: 15;
    border-radius: 4;
    color: black;
}
.new-user-input-error {
    border-width: 1;
    border-color: red;
}
.new-user-input-label {
    font-size: 14;
    padding: 5 0;
}
.new-user-input-error-label {
    color: red;
    padding: 0 10;
}
</style>