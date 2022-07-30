import * as vscode from 'vscode'
import { Annotation, lookupDocument } from '../store'

const anchorName = (annotationId: number) => `annotation-${annotationId}`

const renderStylesheet = () => `
  <style type="text/css">
    section.annotation {
      border: 1px solid red;
      margin-bottom: 1em;
    }
  </style>
`

const renderAnnotation = (annotation: Annotation) =>
  `
  <section class="annotation">
    <a name="${anchorName(annotation.id)}"></a>
    <b>${annotation.username}</b><br/>
    <p>${annotation.message}</p>
    ${
      annotation.externalUri
        ? `<a href="${annotation.externalUri}">View externally</a>`
        : ''
    }
  </section>
  `

const goToAnnotationId = (annotationId: number) => {
  return `
    <script type="text/javascript">
      window.location.href = '#${anchorName(annotationId)}';
    </script>
  `
}

export const getWebviewContent = async (
  treePath: string,
  annotationId?: number
) => {
  const document = await lookupDocument(treePath)
  if (!document) {
    return `No file found.`
  }
  return `
    ${renderStylesheet()}
    <h1>${document.treePath}</h1>
    <hr/>
    ${document.annotations.map(renderAnnotation).join('\n')}
    ${annotationId !== undefined ? goToAnnotationId(annotationId) : ''}
  `
}
