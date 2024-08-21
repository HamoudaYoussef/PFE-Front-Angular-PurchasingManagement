import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewOffre } from 'src/app/Models/offre.model';
import { OffreService } from 'src/app/Service/offre.service';

@Component({
  selector: 'app-offre-by-da',
  templateUrl: './offre-by-da.component.html',
  styleUrls: ['./offre-by-da.component.scss']
})
export class OffreByDaComponent implements OnInit {

  offres: NewOffre[] = [];
  demandeachatId: number;

  constructor(private route: ActivatedRoute, private offreService: OffreService) { }

  ngOnInit(): void {
    this.demandeachatId = +this.route.snapshot.paramMap.get('demandeachatId');
    this.loadOffres();
  }

  loadOffres(): void {
    this.offreService.getOnlyOffresByDemandeAchat(this.demandeachatId).subscribe(
      (data: NewOffre[]) => {
        this.offres = data;
        console.log('Offres fetched successfully:', data);
      },
      error => {
        console.error('Error fetching offres:', error);
      }
    );
  }

}
