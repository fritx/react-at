# react-at

<img width="400" height="388" src="https://raw.githubusercontent.com/fritx/react-at/dev/shot.jpeg">

- [x] Filter/Scroll/Insert/Delete
- [x] Keyboard/Mouse events
- [x] Plain-Text based, no jquery, no extra nodes
- [x] ContentEditable
- [ ] Textarea

## Motivation

[At.js][at.js] is awesome (4000+ stars), but:

- It is [buggy][buggy].
- It seems like out of maintainment.
- It is based on jQuery.
- Its code is like "Spaghetti" and hard to read or modify.

Finally I lost interest in [patching it][buggy] and ended up creating my at library.

```jsx
import Editor from 'react-editor'
import At from 'react-at'
const members = ['Roxie Miles', 'grace.carroll', '小浩']

<At members={members}>
  <Editor />
</At>
```

[at.js]: https://github.com/ichord/At.js
[buggy]: https://github.com/ichord/At.js/issues/411#issuecomment-256662090
