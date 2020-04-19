<template>
        <Page actionBarHidden="true" style="width: 300; border-radius: 150; background-color: transparent">

            <DockLayout stretchLastChild="false">
            <Label dock="top" text="ثبت / ویرایش یادداشت" style="font-size: 16; font-weight: bold;padding: 15; color: white; background-color: blue;"/>

            <NetworkFailure dock="bottom" v-if="networkFailureRetryObject" @retryRequest="networkFailureRetry"></NetworkFailure>


            <FlexboxLayout dock="bottom" height="250" v-else-if="loadingLocal" alignItems="center" justifyContent="space-around">
                <ActivityIndicator  width="50" busy="true"></ActivityIndicator>
            </FlexboxLayout>
            <StackLayout verticalAlignment="middle" v-else class="set-note-container" style="min-width: 300; border-radius: 150;">
                    
                <Label style="text-align: center; padding-top: 10; color: black;" textWrap="true"
                    text="عنوان مکان (اختیاری)"
                />

                <TextField class="set-note-input"
                    :class="{'set-note-input-error': errors.title}"
                    v-model="title" />
                <Label v-show="errors.title" :text="errors.title" class="set-note-input-error-label" textWrap="true" />
                    
                <Label style="text-align: center; padding-top: 10; color: black;" textWrap="true"
                    text="متن یادداشت"
                />

                <TextView class="set-note-input" style="height: 100;"
                    :class="{'set-note-input-error': errors.note_text}"
                    v-model="note_text" />
                <Label v-show="errors.note_text" :text="errors.note_text" class="set-note-input-error-label" textWrap="true" />
                
                <GridLayout columns="*, *" rows="auto">
                    <Button col="0" text="تایید" @tap="setNote" class="hemayat-btn" />
                    <Button col="1" @tap="cancelMe" text="انصراف" class="hemayat-cancel-btn" />
                </GridLayout>

            </StackLayout>
        
        </DockLayout>
        
        
    </Page>
</template>

<script>
import * as http from "tns-core-modules/http";
import { hostUrl } from '~/config'

export default {
    props: [
        'location',
        'addNewLocationFunc',
    ],
    data(){
        return {
            title: this.location.title,
            note_text: this.location.note_text,
            loadingLocal: false,
            verificationCode: '',
            errors: {
                title: '',
                note_text: '',
            }
        }
    },
    methods: {
        cancelMe(){
            this.$modal.close()
        },
        async setNote(){
            
            let formValid = true;

            for (const errorKey in this.errors) {
                this.errors[errorKey] = '';
            }

            if(this.note_text.length == 0){
                this.errors.note_text = 'لطفا متن یادداشت را وارد کنید';
                formValid = false;
            }


            if(formValid){
                this.loadingLocal = true;
                const vinst = this;
                const location = {
                    title: this.title,
                    note_text: this.note_text,
                    latitude: this.location.latitude,
                    longitude: this.location.longitude
                }

                http.request({
                    url: hostUrl + '/api/v2/location/set-note/',
                    method: 'PUT',
                    headers: {
                        'Accept-Language': 'fa',
                        'Cache-Control': 'no-cache',
                        'Content-Type': 'application/json',
                        'Authorization': 'token ' + this.$store.getters.userToken
                    },
                    content: JSON.stringify(location)
                }).then(response => {
                    if(response.statusCode === 200 || response.statusCode === 201){
                        const new_location = response.content.toJSON()
                        if(this.location.pk){
                            this.location.title = new_location.title
                            this.location.note_text = new_location.note_text
                        } else {
                            this.addNewLocationFunc(new_location)
                        }
                        this.$modal.close()
                        alert({
                            title: '',
                            message: 'با موفقیت انجام شد',
                            okButtonText: 'تایید'
                        })
                    } else {
                        const result = response.content.toJSON()
                        
                    }
                    vinst.loadingLocal = false;
                }).catch((e) => {
                    this.onNetworkFailure({ func: this.setNote, args: [] });
                    // console.log(e)
                })
            }
        },
    },
    created(){
        
    }
}
</script>

<style scoped>
.set-note-container {
    padding: 10;
}
.set-note-title {
    text-align: left;
    font-size: 16;
    font-weight: normal;
    padding: 5 10 1 10;
}
.set-note-input {
    padding: 5;
    border-width: 1;
    border-color: #aaaaaa;
    margin: 3 10;
    font-size: 15;
    border-radius: 4;
    color: black;
}
.set-note-input-error {
    border-width: 1;
    border-color: red;
}
.set-note-input-label {
    font-size: 14;
    padding: 5 0;
}
.set-note-input-error-label {
    color: red;
}
</style>