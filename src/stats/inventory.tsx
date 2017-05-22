'use strict';
import * as React from 'react';
import { Subheader, SelectField, MenuItem, Drawer, IconButton, AppBar, RaisedButton } from 'material-ui';
import { red300, green300 } from 'material-ui/styles/colors';
import Settings from 'material-ui/svg-icons/action/settings'
import Close from 'material-ui/svg-icons/navigation/close'
import * as JSZip from 'jszip'
import { saveAs } from 'file-saver';

import StackedBarChart from './chart/stacked-bar-chart';
import { Products,Record, ProductTypes } from '../types';

type Props = {
  products: Products;
  records: Record[];
};
type State = {
  type: keyof ProductTypes;
  settings: boolean;
};

export default class Inventory extends React.Component<Props, State> {
  state: State = {
    type: 'Print11x17',
    settings: false
  };
  private get bars(): { [key: string]: { [key: string]: number } } {
    return this.barsForType(this.state.type);
  }
  private get legend(): { [key: string]: { color: string, name: string } } {
    return {
      quantity: { name: 'Quantity', color: green300 },
      sold: { name: 'Sold', color: red300 }
    }
  }

  private barsForType(type: keyof ProductTypes): { [key: string]: { [key: string]: number } } {
    const bars: { [key: string]: { [key: string]: number } } = {};
    (this.props.products[type] || []).forEach(([name, quantity]) => {
      bars[name] = { quantity, sold: 0 };
    });
    this.props.records
      .filter(({type: _}) => _ === type)
      .forEach(({ products }) => products.forEach(product => (++bars[product].sold, bars[product].quantity && --bars[product].quantity)));
    return bars;
  }

  private typeChange(_: __MaterialUI.TouchTapEvent, __: number, type: keyof ProductTypes) {
    this.setState({ type });
  }

  private async save() {
    const zip = new JSZip();
    Object.keys(ProductTypes).map<[string, string]>((type: keyof ProductTypes) => {
      const bars = this.barsForType(type);
      type Entry = [string, number, number, number];
      const products: Entry[] = Object.keys(bars).map<Entry>(name =>
        [name, this.props.products[type].find(([_]) => name === _)![1], bars[name].quantity, bars[name].sold]
      )
      return [`${type}.csv`, 'Name,Initial,Final,Sold\n' + products.map(_ => _.join(',')).join('\n')];
    }).forEach(([name, content]) => zip.file(name, content));
    saveAs(await zip.generateAsync({type: 'blob'}), 'inventory.zip');
  }

  render() {
    return (
      <div style={{ position: 'relative'}}>
        <Subheader style={{ fontSize: '16px', fontFamily: 'Roboto,sans-serif' }}>Inventory</Subheader>
        <IconButton
          style={{ position: 'absolute', top: 0, right: 10 }}
          onTouchTap={() => this.setState({ settings: true })}>
          <Settings />
        </IconButton>
        <StackedBarChart bars={this.bars} legend={this.legend}/>
        <Drawer
          open={this.state.settings}
          openSecondary
          width='100%'
          style={{display: 'flex'}}>
          <AppBar
            title='Inventory Settings'
            iconElementLeft={<IconButton><Close /></IconButton>}
            onLeftIconButtonTouchTap={() => this.setState({settings: false})} />
          <div style={{padding: '16px'}}>
            <SelectField
              floatingLabelText='Product Type'
              value={this.state.type}
              onChange={(event, index, value: keyof ProductTypes) => this.typeChange(event, index, value)}>
              { Object.keys(ProductTypes).map((type: keyof ProductTypes, i) =>
                <MenuItem key={i} value={type} primaryText={ProductTypes[type]} />
              ) }
            </SelectField>
            <div>
              <RaisedButton label='Export All' primary onClick={() => this.save()}/>
            </div>
          </div>
        </Drawer>
      </div>
    )
  }
};
