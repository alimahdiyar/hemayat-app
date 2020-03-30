<template>
  <Page>
    <ActionBar flat="true">
          <Label text="حمایت" horizontalAlignment="center" style="padding: 15; font-size: 20; color: white"/>
    </ActionBar>
    <GridLayout rows="*, auto" columns="*">
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
import { hostUrl } from "~/config";

import { Position, Marker, Polyline, Bounds } from "nativescript-google-maps-sdk";

export default {
  data() {
    return {
      chosenPosition: {
        latitude: 29.591768,
        longitude: 52.583698
      },
      allowExecution: false,
    };
  },
  methods: {
    
    onMapReady(args) {
      var mapView = args.object;
      var marker = new Marker();
      marker.position = Position.positionFromLatLng(
          Number(29.591768), 
          Number(52.583698)
      );
      marker.title = "hi";
      mapView.addMarker(marker);

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
      mapView.clear();
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
  }
};
</script>

<style scoped>
</style>