import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

interface Game {
title: string;
platform: string;
score: string;
genre: string;
editor_choice: string;
}

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  games = [];
  private allGames = [];
  currentPageGames = new Subject();
  perPage = 10;
  currentPage = 1;
  isAsc = false;
  platforms = [];

  constructor(private http: HttpClient) {}

  updateGames() {
    const g = this.games.slice(((this.currentPage - 1) * this.perPage), (this.currentPage * this.perPage));
    this.currentPageGames.next(g);
  }

  getGamesApi() {
    this.http
      .get('http://starlord.hackerearth.com/gamesarena')
      .subscribe((res: Game[]) => {
        this.games = res.splice(1);
        this.allGames = this.games;
        this.updateGames();
        this.setPlatforms();
      });
  }

  setPlatforms() {
    const platforms = [];
    this.allGames.map(game => {
      if (platforms.indexOf(game.platform) === -1) {
        platforms.push(game.platform);
      }
    });
    this.platforms = platforms;
  }

  gamesForPlatform(pf: string | null) {
    let filteredData;
    if (pf !== null) {
      filteredData = this.allGames.filter(game => game.platform === pf);
    } else {
      filteredData = this.allGames;
    }
    this.games = filteredData;
    const g = filteredData.slice(0, this.perPage);
    this.currentPageGames.next(g);
  }

  searchGames(val: string) {
    const filteredData = this.allGames.filter((game: Game) => game.title.toLowerCase().includes(val.toLowerCase()));
    this.games = filteredData;
    const g = filteredData.slice(0, this.perPage);
    this.currentPageGames.next(g);
  }

  getPages() {
    const maxPage = Math.ceil(this.games.length / this.perPage);
    return Array(maxPage || 0).fill(0).map((x, i) => i + 1);
  }

  updatePage(page) {
    this.currentPage = page;
    this.updateGames();
  }

  sortGames() {
    this.isAsc = !this.isAsc;
    const sortedData = this.allGames.sort((a , b) =>  {
      if (this.isAsc) {
        return a.title > b.title ? 1 : -1;
      } else {
        return b.title > a.title ? 1 : -1;
      }
    });
    this.games = sortedData;
    const g = sortedData.slice(0, this.perPage);
    this.currentPageGames.next(g);
  }

}
