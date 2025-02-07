/*import { Component, OnInit } from '@angular/core';
import { StatistiqueService } from 'src/app/Service/statistique.service';
import { Chart, ChartConfiguration, ChartItem,registerables  } from 'chart.js';


@Component({
  selector: 'app-statistique',
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.scss']
})
export class StatistiqueComponent implements OnInit {
  public chart: Chart<'pie', number[], string> | undefined;
  public data: number[] = [];
  public labels: string[] = [];
  demandesAchatParMois: Map<string, number> = new Map();
  bonsCommandeParMois: Map<string, number> = new Map();
  OffresParMois: Map<string, number> = new Map();
  demandesAchatParRegion: Map<string, number> = new Map();

  constructor(private statistiqueService: StatistiqueService) { }

  ngOnInit(): void {
    Chart.register(...registerables); // Register all chart types

    this.statistiqueService.getDemandesAchatParMois().subscribe(stats => {
      this.createPieChart('canvasBonsCommandeParMois', Object.keys(stats), Object.values(stats));
    });

    this.statistiqueService.getBonsCommandeParMois().subscribe(stats => {
      this.createPieChart('canvasOffresParMois', Object.keys(stats), Object.values(stats));
    });

    this.statistiqueService.getOffresParMois().subscribe(stats => {
      this.createPieChart('canvasDemandesAchatParRegion', Object.keys(stats), Object.values(stats));
    });
    this.statistiqueService.getStatistiques().subscribe(stats => {
      this.labels = Object.keys(stats);
      this.data = Object.values(stats);

      const chartConfig: ChartConfiguration<'pie', number[], string> = {
        type: 'pie',
        data: {
          labels: this.labels,
          datasets: [{
            data: this.data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      };

      const canvas = <ChartItem>document.getElementById('canvas');
      if (canvas) {
        this.chart = new Chart(canvas, chartConfig);
      }
    });
  }
    private createPieChart(canvasId: string, labels: string[], data: number[]): void {
    const chartConfig: ChartConfiguration<'pie', number[], string> = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
}
}

*/
import { Component, OnInit } from '@angular/core';
import { StatistiqueService } from 'src/app/Service/statistique.service';
import { Chart, ChartConfiguration, ChartItem, registerables } from 'chart.js';

@Component({
  selector: 'app-statistique',
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.scss']
})
export class StatistiqueComponent implements OnInit {
  public chartDemandesAchatParMois: Chart<'pie', number[], string> | undefined;
  public chartBonsCommandeParMois: Chart<'pie', number[], string> | undefined;
  public chartOffresParMois: Chart<'pie', number[], string> | undefined;
  public chartDemandesAchatParRegion: Chart<'pie', number[], string> | undefined;

  constructor(private statistiqueService: StatistiqueService) { }

  ngOnInit(): void {
    Chart.register(...registerables); // Enregistrer tous les types de graphiques

    // Démarrer les appels API et création de graphiques
    this.statistiqueService.getDemandesAchatParMois().subscribe(stats => {
      this.createPieChart('canvasDemandesAchatParMois', Object.keys(stats), Object.values(stats));
    });

    this.statistiqueService.getBonsCommandeParMois().subscribe(stats => {
      this.createPieChart('canvasBonsCommandeParMois', Object.keys(stats), Object.values(stats));
    });

    this.statistiqueService.getOffresParMois().subscribe(stats => {
      this.createPieChart('canvasOffresParMois', Object.keys(stats), Object.values(stats));
    });

    this.statistiqueService.getDemandesAchatParStatut().subscribe(stats => {
      this.createPieChart('canvasDemandesAchatParStatut', Object.keys(stats), Object.values(stats));
    });

    this.statistiqueService.getStatistiques().subscribe(stats => {
      this.createPieChart('canvasStatistiquesGlobales', Object.keys(stats), Object.values(stats));
    });
  }

  private createPieChart(canvasId: string, labels: string[], data: number[]): void {
    const chartConfig: ChartConfiguration<'pie', number[], string> = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };

    const canvas = <ChartItem>document.getElementById(canvasId);
    if (canvas) {
      new Chart(canvas, chartConfig);
    }
  }
}
