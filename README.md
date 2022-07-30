# vscode

Boilerplate from https://github.com/tjx666/vscode-extension-boilerplate

The vscode extension that shows conversations alongside code.

## wow

This is the best resource ever: https://github.com/microsoft/vscode-extension-samples

"Blame annotation" in gitlens is what we're after.
You are going to implement this: https://cs.github.com/gitkraken/vscode-gitlens/blob/681368353bb5daa4b247a6e9df606a43fedeeb27/src/annotations/lineAnnotationController.ts?q=LineAnnotationController#L33

- calls this: https://cs.github.com/gitkraken/vscode-gitlens/blob/681368353bb5daa4b247a6e9df606a43fedeeb27/src/annotations/annotations.ts#L230
- https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions

https://vscode.rocks/decorations/

https://github.com/microsoft/vscode/blob/3b549009fe133f5b98f1fd9c8d3116dbd033dbe9/extensions/markdown-language-features/src/preview/preview.ts

To make a local web server (remember to make available via port mappings)
https://github.com/microsoft/vscode-livepreview/tree/main/src/server

The page to render: https://github.com/firebase/firebaseui-web

## what we do

1. Gutter icon, e.g. slack (or "there are multiple" icon), clickable?
2. After decoration: the start of the text of whatever message links here
3. Open up sidebar that syncs to your cursor position
4. Override that cursor position by clicking into a conversation -- then going back puts you into automatic mode again
5. Pop-up notification if you haven't seen a conversation in a while (or at all)

## later

mentor queue
  - subscribe iff the mentor queue tab is open
  - when a mentorship request has been accepted, prompt the mentee to start a live share session
    - https://code.visualstudio.com/api/extension-guides/command to interact with VSLS
  - if we want to support non-vscode in the future can also think about https://tmate.io/ for sharing terminals

