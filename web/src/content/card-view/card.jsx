/* @flow */
import * as React from 'react'
import { Expand } from '../../common/animation/expand'
import { IconButton } from '../../common/icon-button'
import { Icon } from '../../common/icon'
import type { Action } from '../../common/button'
import S from './card.css'

export type Props<E: React.ElementType> = {
  id?: string,
  topAction?: ?Action,
  defaultCollapsed?: boolean,
  bottomAction?: ?Action,
  className?: string,
  collapsible?: boolean,
  style?: { [string]: string | number },
  children: [React.Node, React.Element<E>] | React.Element<E>,
}


type State = {
  collapsed: boolean,
}

export class Card<E: React.ElementType> extends React.Component<Props<E>, State> {
  constructor(props: Props<E>) {
    super(props)
    this.state = {
      collapsed: props.defaultCollapsed || false,
    }
  }

  handleToggleCollapsed() {
    this.setState({ collapsed: !this.state.collapsed })
  }

  render() {
    const { children, collapsible, topAction, bottomAction, id, className, style } = this.props
    const { collapsed } = this.state
    const isCollapsed = collapsed && collapsible
    const [header, content] = children instanceof Array
      ? [...children]
      : [, children]
    return (
      <div className={`${S.card} ${className || ''}`} id={id || ''} style={style || {}}>
        { header
            ? <div className={S.header}>
                { header }
                { collapsible
                    ? <IconButton
                        title={collapsed ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        priority="secondary"
                        className={S.rightAction}
                        action={() => this.handleToggleCollapsed()}
                        quiet
                        />
                    : null
                }
                { topAction ? <IconButton {...topAction} priority="tertiary" className={S.topAction} /> : null }
              </div>
            : null
        }
        <div className={S.content}>
          <Expand>
            { !isCollapsed ? content : null }
          </Expand>
          { !isCollapsed && bottomAction ? <IconButton {...bottomAction} priority="tertiary" className={S.bottomAction} /> : null }
        </div>
      </div>
    )
  }
}
