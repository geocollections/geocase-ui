<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark v-on="on">
        <span>{{ $t("search.export.export") }}</span>
        <v-icon right>fas fa-file-export</v-icon>
      </v-btn>
    </template>
    <v-list color="primary" dark dense>
      <v-list-item @click="exportToCSV">
        <v-list-item-title>
          {{ $t("search.export.exportToCsv") }}
          <v-icon right>far fa-file</v-icon>
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="copyToClipboard">
        <v-list-item-title>
          {{ $t("search.export.copyToClipboard") }}
          <v-icon right>far fa-copy</v-icon>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import { mapGetters, mapState } from "vuex";

export default {
  name: "ExportButtons",
  mixins: [toastMixin],
  props: {
    filename: {
      type: String,
      default: "GeoCASe",
    },
    tableData: {
      type: Array,
    },
  },
  computed: {
    ...mapGetters("search", ["getAllFieldNamesForExport"]),
  },
  methods: {
    exportToCSV() {
      if (this.tableData) {
        if (this.tableData && this.tableData.length > 0) {
          let csvString = this.convertJsonToCsv(this.tableData);

          if (csvString.length === 0) {
            this.toastError({ text: this.$t("search.export.downloadFailed") });
            return;
          }

          let file = new Blob([csvString], { type: "text/plain" });

          if (window.navigator.msSaveOrOpenBlob)
            // IE10+
            window.navigator.msSaveOrOpenBlob(file, this.filename + ".csv");
          else {
            // Others
            let a = document.createElement("a");
            let url = URL.createObjectURL(file);
            a.href = url;
            a.download = this.filename + ".csv";
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }, 0);
          }

          this.toastSuccess({
            text: this.$t("search.export.exportSuccessful", { type: "CSV" }),
          });
        } else
          this.toastError({ text: this.$t("search.export.downloadFailed") });
      } else this.toastError({ text: this.$t("search.export.downloadFailed") });
    },

    convertJsonToCsv(jsonArray) {
      const { Parser } = require("json2csv");

      // Possibility to export exact fields for each object
      let fields = Object.keys(jsonArray[0]);
      if (this.getAllFieldNamesForExport) fields = this.allFieldNames;
      const opts = { fields };

      try {
        const parser = new Parser(opts);
        return parser.parse(jsonArray);
      } catch (err) {
        this.toastError({ text: err });
        return "";
      }
    },

    copyToClipboard() {
      if (this.tableData) {
        let el = document.getElementsByClassName("table");

        let body = document.body,
          range,
          sel;
        if (document.createRange && window.getSelection) {
          range = document.createRange();
          sel = window.getSelection();
          sel.removeAllRanges();
          try {
            range.selectNodeContents(el[0]);
            sel.addRange(range);
          } catch (e) {
            range.selectNode(el[0]);
            sel.addRange(range);
          }
        } else if (body.createTextRange) {
          range = body.createTextRange();
          range.moveToElementText(el[0]);
          range.select();
        }
        document.execCommand("Copy");
        sel.removeAllRanges();

        this.toastSuccess({ text: this.$t("search.export.copySuccessful") });
      } else {
        this.toastError({ text: this.$t("search.export.copyFailed") });
      }
    },
  },
};
</script>

<style scoped></style>
