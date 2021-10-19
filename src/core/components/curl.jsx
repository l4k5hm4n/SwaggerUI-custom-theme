import React from "react"
import PropTypes from "prop-types"
import { CopyToClipboard } from "react-copy-to-clipboard"
import {SyntaxHighlighter, getStyle} from "core/syntax-highlighting"
import get from "lodash/get"
import { requestSnippetGenerator_curl_bash } from "../plugins/request-snippets/fn"

export default class Curl extends React.Component {
  static propTypes = {
    getConfigs: PropTypes.func.isRequired,
    request: PropTypes.object.isRequired
  }

  render() {
    let { request, getConfigs } = this.props
    let curl = requestSnippetGenerator_curl_bash(request)

    const config = getConfigs()

    const curlBlock = get(config, "syntaxHighlight.activated")
      ? <SyntaxHighlighter
          language="bash"
          className="curl microlight"
          onWheel={this.preventYScrollingBeyondElement}
          style={getStyle(get(config, "syntaxHighlight.theme"))}
          >
          {curl}
        </SyntaxHighlighter>
      :
      <textarea readOnly={true} className="curl" value={curl}></textarea>

    return (
      <div className="curl-command">
      <div className="curl-header">
        <h4>Curl Request</h4>
        <div className="utility-buttons">
        <CopyToClipboard text={curl}><button/></CopyToClipboard>
            <button className="maximize-btn"></button>
        </div>
      </div>

        <div>
          {curlBlock}
        </div>
      </div>
    )
  }

}
