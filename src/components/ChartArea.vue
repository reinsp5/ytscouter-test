<template>
  <canvas :id="id"></canvas>
</template>
<style>
canvas {
  max-width: 15vw;
  max-height: 15vw;
}
</style>

<script>
import Chart from "chart.js/auto";
export default {
  props: {
    data: Array,
    id: String,
  },
  methods: {
    renderChart() {
      const x = this.data[0] + this.data[1];
      if (x !== 0) {
        const chartArea = document.getElementById(this.id).getContext("2d");
        const myChart = new Chart(chartArea, {
          type: "doughnut",
          data: {
            labels: ["Like", "Dislike"],
            datasets: [
              {
                label: "# of Votes",
                data: this.data,
                backgroundColor: [
                  "rgba(0, 128, 0, 0.2)",
                  "rgba(255, 0, 0, 0.2)",
                ],
                borderColor: ["rgba(0, 100, 0, 1)", "rgba(139, 0, 0, 1)"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            legend: {
              display: false,
            },
            animation: {
              easing: "easeOutQuart",
            },
          },
        });
      }
    },
  },
  mounted() {
    this.renderChart();
  },
};
</script>