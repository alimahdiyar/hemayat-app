<template>
  <Page>
    <ActionBar flat="true">
          <Label text="حمایت" horizontalAlignment="center" style="padding: 15; font-size: 20; color: white"/>
    </ActionBar>

    <NetworkFailure v-if="networkFailureRetryObject" @retryRequest="networkFailureRetry"></NetworkFailure>
    
    <ActivityIndicator v-else-if="loadingLocal" width="50" busy="true"></ActivityIndicator>

    <GridLayout v-else>
      <MapView
        v-if="allowExecution"
        width="100%"
        height="100%"
        :latitude="29.591768"
        :longitude="52.583698"
        :zoom="14"
        mapAnimationsEnabled="true"
        @coordinateLongPress="onCoordinateLongPress"
        @mapReady="onMapReady"
        @markerSelect="onMarkerSelect"
      />

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
      loadingLocal: true,
      mapViewObject: null,
      allowExecution: false,
      locations: null,
    };
  },
  methods: {
    onMarkerSelect(args) {
      this.$showModal(this.$routes.SetNote, {props:{'location': args.marker.label , 'addNewLocationFunc': this.addLocation }});
    },
    addLocation(location){
      this.locations.push(location)
      this.addMarkerToMap(location)
    },
    addMarkerToMap(location){
      const marker = new Marker();
      marker.position = Position.positionFromLatLng(
          Number(location.latitude), 
          Number(location.longitude)
      );
      marker.title = location.title;
      marker.label = location;
      this.mapViewObject.addMarker(marker); 
    },
    onMapReady(args) {
      const mapView = args.object;
      this.mapViewObject = mapView;
      
      for (let i = 0; i < this.locations.length; i++) {
        this.addMarkerToMap(this.locations[i])
      }

      if (platform.isAndroid) {
          // let uiSettings = mapView.gMap.getUiSettings();
          // uiSettings.setMyLocationButtonEnabled(true);
          // mapView.settings.mapToolbarEnabled = true;
          /* enable my location button on android */
          mapView.settings.mapToolbarEnabled = true;
          mapView.gMap.setMyLocationEnabled(true);
          mapView.settings.zoomControlsEnabled = true;
      } else {
          /* enable my location button on iOS */
          mapView.gMap.myLocationEnabled = true;
          mapView.settings.myLocationButton = true;
      }
    },
    onCoordinateLongPress(args) {
      let latitude = args.position.latitude;
      let longitude = args.position.longitude;
      
      this.$showModal(this.$routes.SetNote, {props: {
            'location': {
              pk: null,
              title: '',
              latitude,
              longitude,
              note_text: '',
            },
            'addNewLocationFunc': this.addLocation 
          }
        });
    },
    loadLocations(){
      const headers = {
        'Accept-Language': 'fa',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'Authorization': 'token ' + this.$store.getters.userToken
      }
      // console.log(hostUrl + '/api/v3/location/list/');
      http.request({
        url: hostUrl + '/api/v3/location/list/',
        method: 'GET',
        headers: headers
      }).then(response => {
        // console.log('dataLoader fetchData action for ' + dataModel.label)
        // console.log(response.content.toString())
        if (response.statusCode === 401) {
          alert('توکن شما اشتباه است. لطفا به ارائه دهنده اطلاع دهید');
          this.$store.dispatch('logout');
        } else {
          this.locations = response.content.toJSON();
          // console.log(this.locations);
          this.loadingLocal = false;
        }
      }, error => {
        this.onNetworkFailure({ func: this.loadLocations, args: [] });
        console.log(error.message)
      }).catch(error => {
        this.onNetworkFailure({ func: this.loadLocations, args: [] });
        console.log(error.message)
      })
    },
    loadNoteTypes(){
      const headers = {
        'Accept-Language': 'fa',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'Authorization': 'token ' + this.$store.getters.userToken
      }
      // console.log(hostUrl + '/api/v3/location/list/');
      http.request({
        url: hostUrl + '/api/v3/note-types/',
        method: 'GET',
        headers: headers
      }).then(response => {
        // console.log('dataLoader fetchData action for ' + dataModel.label)
        // console.log(response.content.toString())
        if (response.statusCode === 401) {
          alert('توکن شما اشتباه است. لطفا به ارائه دهنده اطلاع دهید');
          this.$store.dispatch('logout');
        } else {
          this.$store.commit('updateNoteTypes', response.content.toJSON());
          this.loadLocations();
        }
      }, error => {
        this.onNetworkFailure({ func: this.loadNoteTypes, args: [] });
        console.log(error.message)
      }).catch(error => {
        this.onNetworkFailure({ func: this.loadNoteTypes, args: [] });
        console.log(error.message)
      })
    }
  },
  created(){
    this.loadNoteTypes();
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
      .requestPermissions(permissionsNeeded, "اجازه دسترسی")
      .then(() => this.allowExecution = true)
      .catch(() => this.allowExecution = false); 
  }
};
</script>

<style scoped>
</style>