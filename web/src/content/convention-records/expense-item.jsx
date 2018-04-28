/* @flow */
import * as React from 'react'
import moment from 'moment'

import { l } from '../../localization'
import { Item } from '../../common/list/item'
import { Font } from '../../common/font'
import { model } from '../../model'
import type { Expense } from '../../model/expense'
import S from './item.css'

export type Props = {
  expense: Expense,
}

function format(date: Date): string {
  return moment(date).format(l`h:mm`)
}

export function ExpenseItem({ expense }: Props) {
  return (
    <Item>
      <div className={`${S.item} ${S.expense}`}>
        <div className={S.category}>{expense.category}</div>
        <div className={S.amount}>
          {expense.price.toString()}
        </div>
      </div>
    </Item>
  )
}