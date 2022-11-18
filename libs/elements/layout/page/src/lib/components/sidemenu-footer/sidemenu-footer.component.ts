import { Component, Input, OnInit } from '@angular/core';

import { User } from '@iote/bricks';

import { TranslateService } from '@ngfi/multi-lang';

@Component({
  selector: 'app-sidemenu-footer',
  templateUrl: './sidemenu-footer.component.html',
  styleUrls: [ './sidemenu-footer.component.scss' ]
})
export class SideMenuFooterComponent implements OnInit
{
  @Input() user: User;

  lang : string;

  constructor(private _translateService: TranslateService) {
    this.lang = this._translateService.initialise();
  }

  ngOnInit() {  }

  setLang(lang: 'en' | 'fr' | 'nl')
  {
    this.lang = lang;
    this._translateService.setLang(lang);
  }
}
