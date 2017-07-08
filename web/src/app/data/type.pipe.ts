import { Inject, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ProductTypes, ProductType } from '../../../../conartist';
import StorageService from './storage.service';

@Pipe({
  name: 'type',
  pure: false,
})
export default class TypePipe implements PipeTransform {
  private types: BehaviorSubject<ProductTypes>
  constructor(@Inject(StorageService) storage: StorageService) {
    this.types = storage.types;
  }

  transform<K extends keyof ProductType>(id: number): ProductType;
  transform<K extends keyof ProductType>(id: number, prop: K): ProductType[K];
  transform<K extends keyof ProductType>(id: number, prop?: K) {
    const type = this.types.getValue().find(_ => _.id === id) || { name: 'Unknown Type', id: -1, color: 0xFFFFFF, discontinued: false };
    if(prop) {
      return type[prop];
    } else {
      return type;
    }
  }
}
