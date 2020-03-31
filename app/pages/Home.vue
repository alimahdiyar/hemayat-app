<template>
  <Page>
    <ActionBar flat="true">
          <Label text="حمایت" horizontalAlignment="center" style="padding: 15; font-size: 20; color: white"/>
    </ActionBar>

    <NetworkFailure v-if="networkFailureRetryObject" @retryRequest="networkFailureRetry"></NetworkFailure>
    
    <ActivityIndicator v-else-if="loadingLocal" width="50" busy="true"></ActivityIndicator>

    <GridLayout v-else rows="*, auto" columns="*">
      <MapView
        v-if="allowExecution"
        row="0"
        col="0"
        width="100%"
        height="100%"
        :latitude="chosenPosition.latitude"
        :longitude="chosenPosition.longitude"
        :zoom="14"
        mapAnimationsEnabled="true"
        @coordinateLongPress="onCoordinateLongPress"
        @mapReady="onMapReady"
        @markerSelect="onMarkerSelect"
      />
      <Button v-if="chosenPosition" style="margin: 10 20 10 20" text="تایید" class="hemayat-btn" @tap="submit()" row="1" col="0" />
      
    </GridLayout>
  </Page>
</template>

<script>
import * as platform from 'platform'
import Vue from 'nativescript-vue';


import * as permissions from 'nativescript-permissions'

import * as http from "tns-core-modules/http";
import { appToken, hostUrl } from "~/config";

import { Position, Marker, Polyline, Bounds } from "nativescript-google-maps-sdk";

export default {
  data() {
    return {
      loadingLocal: true,
      chosenPosition: {
        latitude: 29.591768,
        longitude: 52.583698
      },
      allowExecution: false,
      locations: null,
    };
  },
  methods: {
    onMarkerSelect(args) {
        const mapView = args.object;
        console.log("Clicked on " +args.marker.title);
        console.log(args.marker.position.latitude);
        console.log(args.marker.position.longitude);
        mapView.removeMarker(args.marker);
    },
    onMapReady(args) {
      var mapView = args.object;
      for (let i = 0; i < this.locations.length; i++) {
        const location = this.locations[i];
        var marker = new Marker();
        marker.position = Position.positionFromLatLng(
            Number(location.lat), 
            Number(location.lon)
        );
        marker.title = location.note_text;
        mapView.addMarker(marker); 
      }

      if (platform.isAndroid) {
          let uiSettings = mapView.gMap.getUiSettings();
          uiSettings.setMyLocationButtonEnabled(true);
          /* enable my location button on android */
          mapView.gMap.setMyLocationEnabled(true);
      } else {
          /* enable my location button on iOS */
          mapView.gMap.myLocationEnabled = true;
          mapView.gMap.settings.myLocationButton = true;
      }

    },
    onCoordinateLongPress(args) {
      let latitude = args.position.latitude;
      let longitude = args.position.longitude;
      this.chosenPosition = {
        latitude,
        longitude
      }

      var mapView = args.object;
      var marker = new Marker();
      marker.position = Position.positionFromLatLng(
        Number(latitude), 
        Number(longitude)
      );
      marker.title = "hi";
      mapView.addMarker(marker);
    },
    submit(){

      Vue.set(this.chosenPosition.latitude, 'latitude', this.chosenPosition.latitude)
      Vue.set(this.chosenPosition.latitude, 'longitude', this.chosenPosition.longitude)
    //   this.$navigateBack();

    }
  },
  created(){
    /* dont run the android permissions routine for iOS */
    if (platform.isIOS) {
      this.allowExecution = true;
      return;
    }
    /* list of permissions needed */
    let permissionsNeeded = [
      android.Manifest.permission.ACCESS_FINE_LOCATION,
      android.Manifest.permission.ACCESS_COARSE_LOCATION
    ];
    /* showing up permissions dialog */
    permissions
      .requestPermissions(permissionsNeeded, "Give it to me!")
      .then(() => this.allowExecution = true)
      .catch(() => this.allowExecution = false);
    
        const headers = {
          'Cache-Control': 'no-cache',
          'Authorization': 'token ' + appToken
        }
        console.log(hostUrl + '/api/v1/location/list/');
        http.request({
          url: hostUrl + '/api/v1/location/list/',
          method: 'GET',
          headers: headers
        }).then(response => {
          // console.log('dataLoader fetchData action for ' + dataModel.label)
          // console.log(response.content.toString())
          if (response.statusCode === 401) {
            alert('توکن اپ اشتباه است. لطفا به ارائه دهنده اطلاع دهید');
          } else {
            this.locations = response.content.toJSON();
            this.loadingLocal = false;
          }
        }, error => {
          console.log(error.message)
        }).catch(error => {
          console.log(error.message)
        })
    
  }
};
</script>

<style scoped>
</style>