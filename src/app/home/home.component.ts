import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomeService } from './home.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  games;
  isFocus = false;
  numberOfPages = [];

  myControl = new FormControl('');

  filteredOptions: Observable<string[]>;

  constructor(
    public homeService: HomeService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.page) {
        this.homeService.updatePage(params.page);
      }
    });
  }

  ngOnInit() {
    this.homeService.getGamesApi();
    this.homeService.currentPageGames.subscribe((res) => {
      this.games = res;
      this.numberOfPages = this.homeService.getPages();
    });

    // auto complete
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    // filter content
    this.myControl.valueChanges.subscribe((res) => {
      this.homeService.searchGames(res);
      this.numberOfPages = this.homeService.getPages();
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.homeService.games.filter(
      (option) => option.title.toLowerCase().indexOf(filterValue) === 0
    );
  }

  toggleFocus(val) {
    this.isFocus = val;
  }

  clearSearch() {
    this.myControl.setValue('');
    this.homeService.searchGames('');
  }

  platformChange(e) {
    this.homeService.gamesForPlatform(e.value);
  }

  ngOnDestroy() {
    this.homeService.currentPageGames.unsubscribe();
  }
}
