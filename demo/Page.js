// Page.js https://github.com/fritx/react-editor
import React, { Component } from 'react'
import Editor from 'react-editor'
// import At from '../dist'
import At from '../src/At'
import './Page.css'


const html = `
  <div>Awesome Electron&nbsp;<img src="../demo/awesome.svg"></div><div><img src="../demo/electron.svg"></div><div>Useful resources for creating apps with&nbsp;Electron</div><div>Inspired by the&nbsp;awesome&nbsp;list thing. You might also like&nbsp;awesome-nodejs.</div><div>Example apps</div><div>Some good apps written with Electron.</div><div>Open Source</div><div>Atom&nbsp;- Code editor.</div><div>Nuclide&nbsp;- Unified IDE.</div><div>Playback&nbsp;- Video player.</div>
`.trim() // fix trailing abnormal nodes
const isCtrlSend = true

const members = [
  /* eslint-disable */
  "Roxie Miles","grace.carroll",
  "小浩",
  "Helena Perez","melvin.miller",
  "椿木",
  "myrtie.green","elsie.graham","Elva Neal",
  "肖逵",
  "amy.sandoval","katie.leonard","lottie.hamilton",
  /* eslint-enable */
]

export default class Page extends Component {

  componentDidMount() {
    this.refs.editor.setHTML(html) // 初始化内容

    window.addEventListener('click', () => {
      this.forceUpdate() // demo中模拟外部render
    })
  }

  submitForm() {
    // todo
    console.log('submitForm')
  }

  onFocus() {
    this.refs.editor.restoreRange()
  }
  onBlur() {
    const { editor } = this.refs
    editor.lint()
    editor.saveRange()

    // 解决win上其他域选中干扰
    editor.clearRange()
  }
  onKeyDown(e) {
    // note: hasCtrl && !isCtrlSend insert换行
    // 造成editor滚动失效
    if (e.keyCode === 13) {
      const hasCtrl = e.ctrlKey || e.metaKey
      if (hasCtrl ^ isCtrlSend) { // 不一致
        if (hasCtrl) {
          e.preventDefault() // 滚动失效
          this.refs.editor.insertText('\n')
        } // else不处理 采用默认行为
      } else { // 一致
        e.preventDefault()
        this.submitForm()
      }
      return
    }
  }

  render() {
    return (
      <div
        onFocus={(e) => this.onFocus(e)}
        onBlur={(e) => this.onBlur(e)}
        onKeyDown={(e) => this.onKeyDown(e)}
      >
        <At members={members}>
          <Editor ref="editor" className="editor" />
        </At>
      </div>
    )
  }
}
