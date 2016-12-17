import React, { Component, PropTypes } from 'react'
import './At.scss'
import {
  closest, getOffset, getPrecedingRange,
  getRange, applyRange
} from './util'

// todo: textarea
// http://stackoverflow.com/questions/12194113/how-to-get-range-of-selected-text-of-textarea-in-javascript

const at = '@'

export default class Atwho extends Component {

  static propTypes = {
    members: PropTypes.array.isRequired,
  };

  constructor(...args) {
    super(...args)
    this.handleCompositionStart = ::this.handleCompositionStart
    this.handleCompositionEnd = ::this.handleCompositionEnd
    this.handleInput = ::this.handleInput
    this.handleKeyDown = ::this.handleKeyDown
    this.handleItemHover = ::this.handleItemHover
    this.handleItemClick = ::this.handleItemClick

    this.hasComposition = false
    this.state = {
      atwho: null,
    }
  }

  handleItemClick() {
    this.selectItem()
  }
  handleItemHover(e) {
    const { atwho } = this.state
    const el = closest(e.target, d => d.dataset.index)
    const cur = +el.dataset.index
    this.setState({
      atwho: {
        ...atwho,
        cur
      }
    })
  }
  handleDelete(e) {
    const range = getPrecedingRange()
    if (range) {
      const text = range.toString()
      const index = text.lastIndexOf(at)
      if (index > -1) {
        const chunk = text.slice(index + 1, -1)
        const { members } = this.props
        const has = members.indexOf(chunk) > -1
        if (has) {
          e.preventDefault()
          e.stopPropagation()
          const r = getRange()
          if (r) {
            r.setStart(r.endContainer, index)
            r.deleteContents()
            applyRange(r)
          }
        }
      }
    }
  }
  handleKeyDown(e) {
    const { atwho } = this.state
    if (atwho) {
      if (e.keyCode === 38 || e.keyCode === 40) { // ↑/↓
        // fixme: props hook
        if (!(e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          e.stopPropagation()
          const offset = e.keyCode === 38 ? -1 : 1
          const { members } = this.props
          const { cur } = atwho
          this.setState({
            atwho: {
              ...atwho,
              cur: (cur + offset + members.length ) % members.length,
            }
          }, () => {
            this.refs.cur.scrollIntoViewIfNeeded()
          })
        }
        return
      }
      if (e.keyCode === 13) { // enter
        this.selectItem()
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (e.keyCode === 27) { // esc
        this.closePanel()
        return
      }
    }
    setTimeout(this.handleInput, 50)

    if (e.keyCode === 8) {
      this.handleDelete(e)
    }
  }

  // compositionStart -> input -> compositionEnd
  handleCompositionStart() {
    this.hasComposition = true
  }
  handleCompositionEnd() {
    this.hasComposition = false
    this.handleInput()
  }
  handleInput() {
    if (this.hasComposition) return
    const range = getPrecedingRange()
    if (range) {
      let show = true
      const text = range.toString()
      const index = text.lastIndexOf(at)
      if (index < 0) show = false
      const prev = text[index - 1]

      // 上一个字符不能为字母数字 避免与邮箱冲突
      if (/^[a-z0-9]$/i.test(prev)) show = false
      const chunk = text.slice(index + 1)
      // chunk以空白字符开头不匹配 避免`@ `也匹配
      if (/^\s/.test(chunk)) show = false

      if (!show) {
        this.closePanel()
      } else {
        const chunk_l = chunk.toLowerCase()
        const { members } = this.props
        const matched = members.filter(item => { // match at lower-case
          return item.toLowerCase().indexOf(chunk_l) > -1
        })
        if (matched.length) {
          this.openPanel(matched, range, index)
        } else {
          this.closePanel()
        }
      }
    }
  }

  closePanel() {
    if (this.state.atwho) {
      this.setState({
        atwho: null,
      })
    }
  }
  openPanel(list, range, offset) {
    const fn = () => {
      const r = range.cloneRange()
      r.setStart(r.endContainer, offset + 1) // 从@后第一位开始
      // todo: 根据窗口空间 判断向上或是向下展开
      const rect = r.getClientRects()[0]
      this.setState({
        atwho: {
          range,
          offset,
          list,
          x: rect.left,
          y: rect.top - 4,
          cur: 0, // todo: 尽可能记录
        }
      })
    }
    if (this.state.atwho) {
      fn()
    } else { // 焦点超出了显示区域 需要提供延时以移动指针 再计算位置
      setTimeout(fn, 10)
    }
  }
  selectItem() {
    const { atwho: { range, offset, list, cur } } = this.state
    const r = range.cloneRange()
    r.setStart(r.endContainer, offset + 1) // 从@后第一位开始
    // hack: 连续两次 可以确保click后 focus回来 range真正生效
    applyRange(r)
    applyRange(r)
    document.execCommand('insertText', 0, list[cur] + ' ')
  }

  renderList() {
    const { atwho } = this.state
    if (!atwho) return null
    const { list, cur, x, y } = atwho
    let style = null
    const { wrap } = this.refs
    if (wrap) {
      const offset = getOffset(wrap)
      const left = x - offset.left
      const top = y - offset.top
      style = { left, top }
    }
    return (
      <div className="atwho-panel" style={style}>
        <div className="atwho-inner">
          <div className="atwho-view">
            <ul className="atwho-view-ul">
              {list.map((item, index) => {
                const isCur = index === cur
                return (
                  <li key={item} className={isCur && 'cur'}
                    ref={isCur && 'cur'}
                    data-index={index}
                    onMouseEnter={this.handleItemHover}
                    onClick={this.handleItemClick}
                  >
                    <span>{item}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // Getting DOM node from React child element
  // http://stackoverflow.com/questions/29568721/getting-dom-node-from-react-child-element
  render() {
    const { children } = this.props
    return (
      <div
        ref="wrap"
        className="atwho-wrap"
        onCompositionStart={this.handleCompositionStart}
        onCompositionEnd={this.handleCompositionEnd}
        onInput={this.handleInput}
        onKeyDown={this.handleKeyDown}
      >
        {this.renderList()}
        {children}
      </div>
    )
  }
}
