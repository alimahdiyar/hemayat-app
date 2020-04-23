import {
    ValueList
} from 'nativescript-drop-down'
  
export default {
  computed: {
    noteTypes () {
      return this.$store.getters.noteTypes
    }
  },
  data () {
    return {
      noteTypesList: null
    }
  },
  watch: {
    noteTypes (_newValue, _oldValue) {
      this.updatenoteTypesddSelectedIndex()
    }
  },
  methods: {
    updatenoteTypesddSelectedIndex () {
      let noteTypesListItems = [{
        value: 0,
        display: 'تعیین نشده'
      }]
      if (this.noteTypes) {
        this.noteTypes.forEach((item) => {
          noteTypesListItems.push({
            value: item.pk,
            display: item.title
          })
        })
      }
      this.noteTypesList = new ValueList(noteTypesListItems)
      if (this.$refs.noteTypesdd && this.$refs.noteTypesdd.nativeView) {
        this.$refs.noteTypesdd.nativeView.selectedIndex = this.noteTypeIndex;
      }
    }
  }
}
  