import { Component, OnInit } from '@angular/core';

import { Conversion } from '../conversion';
import { ConversionService } from '../conversion.service';

@Component({
  selector: 'app-conversions',
  templateUrl: './conversions.component.html',
  styleUrls: ['./conversions.component.css']
})  
export class ConversionsComponent implements OnInit {	
  conversions: Conversion[];

  constructor(private conversionService: ConversionService) { }

  ngOnInit() {
    this.getConversions();
  }

  getConversions(): void {
	  this.conversionService.getConversions()
    .subscribe(conversions => this.conversions = conversions);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.conversionService.addConversion({ name } as Conversion)
      .subscribe(conversion => {
        this.conversions.push(conversion);
      });
  }

  
delete(conversion: Conversion): void {
  this.conversions = this.conversions.filter(h => h !== conversion);
  this.conversionService.deleteConversion(conversion).subscribe();
  }

}