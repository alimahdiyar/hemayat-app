<template>
  <Page>
    <ActionBar flat="true">
          <Label text="حمایت" horizontalAlignment="center" style="padding: 15; font-size: 20; color: white"/>
    </ActionBar>

    <NetworkFailure v-if="networkFailureRetryObject" @retryRequest="networkFailureRetry"></NetworkFailure>
    
    <ActivityIndicator v-else-if="loadingLocal" width="50" busy="true"></ActivityIndicator>

    <ScrollView v-else>
      <StackLayout style="padding-bottom: 17">
        <Label v-if="location.title" :text="location.title" style="font-size: 18; padding-top: 17; text-align: center;" textWrap="true" />
        <StackLayout v-for="note in notes"
          :key="note.pk"
          style="text-align: left; font-size: 18; border-width: 4; border-radius:30;
                border-color: #cccccc; padding: 10 20; margin: 17 13 3 13;">
          <Label :text="'سازنده: ' + (note.user_profile ? note.user_profile.username : 'تعیین نشده')" textWrap="true" />
          <Label :text="'زمان: ' + toPersianDateTimeString(note.timestamp)" textWrap="true" />
          <Label :text="note.text" textWrap="true" />
        </StackLayout>
      </StackLayout>      
    </ScrollView>
  </Page>
</template>

<script>
import * as http from "tns-core-modules/http";
import { hostUrl } from "~/config";

export default {
  data() {
    return {
      notes: null
    };
  },
  props: [
    'location'
  ],
  methods: {
    loadNotes(){
      const headers = {
        'Accept-Language': 'fa',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'Authorization': 'token ' + this.$store.getters.userToken
      }
      console.log(this.location);
      http.request({
        url: hostUrl + '/api/v2/location/notes/list/',
        method: 'POST',
        headers: headers,
        content: JSON.stringify(this.location)
      }).then(response => {
        // console.log('dataLoader fetchData action for ' + dataModel.label)
        console.log(response.content.toString())
        if (response.statusCode === 401) {
          alert('توکن شما اشتباه است. لطفا به ارائه دهنده اطلاع دهید');
          this.$store.dispatch('logout');
        } else {
          this.notes = response.content.toJSON();
          this.loadingLocal = false;
        }
      }, error => {
        this.onNetworkFailure({ func: this.loadNotes, args: [] });
        console.log(error.message)
      }).catch(error => {
        this.onNetworkFailure({ func: this.loadNotes, args: [] });
        console.log(error.message)
      })
    }
  },
  created(){
    this.loadNotes();
  }
};
</script>

<style scoped>
</style>