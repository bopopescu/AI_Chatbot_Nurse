<template>
  <section class="content">
     <el-table
    :data="tableData"
    height="700"
    style="width: 100%"
    empty-text="No data" >
    <el-table-column header-align="center"
    align="center"
      prop="name"
      label="Name"
      width="180">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="age"
      label="Age"
      width="50">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="sex"
      label="Sex"
      width="50">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="prediction"
      label="Prediction"
      width="90">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="score"
      label="Confidence"
      width="100">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="chest_pain"
      label="Chest Pain"
      width="100">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="rbp"
      label="Resting BP"
      width="100">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="fbp"
      label="Fasting BP"
      width="100">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="recg"
      label="Resting ECG"
      width="100">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="mhr"
      label="Maximum Heart Rate"
      width="100">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="eia"
      label="Excercise Induced Angina"
      width="180">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="std"
      label="ST Depression"
      width="120">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="slope"
      label="Slope of ST Segment"
      width="150">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="symptoms"
      label="Symptoms"
      width="180">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="breath"
      label="Short Breath"
      width="100">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="c_flutter"
      label="Chest Flutter"
      width="100">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="c_heart"
      label="Heart pain"
      width="100">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="c_pressure"
      label="Chest Pressure"
      width="120">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="chest"
      label="Chest Discomfort"
      width="60">
    </el-table-column>
    <el-table-column header-align="center"
    align="center"
      prop="numb"
      label="Numb"
      width="60">
    </el-table-column>
    <el-table-column label="Tools" width="70" header-align="center">
        <template scope="scope">
          <el-button size="small" @click="handleData(scope.$index, scope.row)">Data</el-button>
        </template>
      </el-table-column>
  </el-table>
  <el-dialog title="Data" :visible.sync="dataFormVisible" :close-on-click-modal="false">
     <apexchart width="500" height="350" type="bar" :options="chartOptions" :series="series"></apexchart>
    </el-dialog>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      tableData: [],
      dataFormVisible: false,
      chartOptions: {
        colors: ['#7CFC00', '#F44336'],
        plotOptions: {
          bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '55%'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']
        },
        yaxis: {
          title: {
            text: 'Prediction'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return val
            }
          }
        }
      },
      series: [ {
        name: 'Safe',
        data: [0.91, 0.85, 0.53, 0.3, 0.1, 0.09]
      }, {
        name: 'Danger',
        data: [0.19, 0.15, 0.47, 0.7, 0.9, 0.91]
      }]
    }
  },
  methods: {
    handleData: function (index, row) {
      console.log('ehandle diting')
      this.dataFormVisible = true
    }
  },
  mounted() {
    axios
      .get('https://nursejoy-152cb.firebaseio.com/.json')
      .then(response => {
        console.log(response.data)
        let patients = Object.keys(response.data)
        for (let i = 0; i < patients.length; i++) {
          let patient = response.data[patients[i]]
          let symptoms = []
          if (patient.dizziness !== 0) {
            symptoms.push('dizziness')
          }
          if (patient.fainting !== 0) {
            symptoms.push('fainting')
          }
          if (patient.fatigue !== 0) {
            symptoms.push('fatigue')
          }
          if (patient.sweating !== 0) {
            symptoms.push('sweating')
          }
          if (patient.vomiting !== 0) {
            symptoms.push('vomiting')
          }
          if (patient.vertigo !== 0) {
            symptoms.push('vertigo')
          }
          if (patient.weakness !== 0) {
            symptoms.push('weakness')
          }
          if (patient.nausea !== 0) {
            symptoms.push('nausea')
          }
          this.tableData.push({
            name: patients[i],
            age: patient.details[0],
            sex: patient.details[1] === 1 ? 'Male' : 'Female',
            chest_pain: patient.details[2],
            rbp: patient.details[3] === 0 ? 'NA' : patient.details[3],
            fbp: patient.details[4] === 0 ? 'NA' : patient.details[4],
            recg: patient.details[5],
            mhr: patient.details[6],
            eia: patient.details[7],
            std: patient.details[8],
            slope: patient.details[9],
            breath: patient.breath === 0 ? 'No' : 'Yes',
            c_flutter: patient.c_flutter === 0 ? 'No' : 'Yes',
            c_heart: patient.c_heart === 0 ? 'No' : 'Yes',
            c_pain: patient.c_pressure === 0 ? 'No' : 'Yes',
            c_pressure: patient.c_pressure === 0 ? 'No' : 'Yes',
            chest: patient.chest === 0 ? 'No' : 'Yes',
            numb: patient.numb === 0 ? 'No' : 'Yes',
            prediction: patient.predict === '1' ? 'Danger' : 'Safe',
            score: patient.predict === '1' ? 1 - patient.score : patient.score,
            symptoms: symptoms.join(',')
          })
        }
      })
  }
}
</script>

<style>
/* Using the bootstrap style, but overriding the font to not draw in
   the Glyphicons Halflings font as an additional requirement for sorting icons.

   An alternative to the solution active below is to use the jquery style
   which uses images, but the color on the images does not match adminlte.

@import url('/static/js/plugins/datatables/jquery.dataTables.min.css');
*/


table.dataTable thead .sorting:after,
table.dataTable thead .sorting_asc:after,
table.dataTable thead .sorting_desc:after {
  font-family: 'FontAwesome';
}

table.dataTable thead .sorting:after {
  content: '\f0dc';
}

table.dataTable thead .sorting_asc:after {
  content: '\f0dd';
}

table.dataTable thead .sorting_desc:after {
  content: '\f0de';
}
</style>
