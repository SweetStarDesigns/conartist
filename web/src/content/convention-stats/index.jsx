/* @flow */
import * as React from 'react'
import { SecondaryCardFade as Fade } from '../../common/animation/fade/secondary-card'
import { CardView } from '../card-view'
import { InventoryChart } from './chart/inventory'
import { SalesByTypeChart } from './chart/sales-by-type'
import type { Convention } from '../../model/convention'

export type Props = {
  name: 'convention-stats',
  convention: Convention,
}

type State = {
  settings: ?React.Node
}

export class ConventionStats extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      settings: null,
    }
  }

  render() {
    const { convention } = this.props
    const { settings } = this.state

    // $FlowIgnore
    const { products = [], records = [], productTypes = [] } = convention;

    const showSettings = settings => this.setState({ settings })

    return (
      <CardView>
        <InventoryChart productTypes={productTypes} products={products} records={records} showSettings={showSettings} />
        <SalesByTypeChart productTypes={productTypes} products={products} records={records} showSettings={showSettings} />
        <Fade>
          {/* $FlowIgnore */}
          { settings || null }
        </Fade>
      </CardView>
    )
  }
}
