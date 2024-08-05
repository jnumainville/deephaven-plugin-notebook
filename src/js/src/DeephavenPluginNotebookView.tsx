import React, { CSSProperties, useEffect, useState } from 'react';
import { useApi } from '@deephaven/jsapi-bootstrap';
import Log from '@deephaven/log';
import { WidgetComponentProps } from '@deephaven/plugin';
import type { Widget } from '@deephaven/jsapi-types';
import { Button, TextField } from '@deephaven/components';

const log = Log.module('deephaven-plugin-notebook.DeephavenPluginNotebookView');

// Create a custom style for the component
export const DeephavenPluginNotebookViewStyle: CSSProperties = {
  // CSS variables can be used to style the component according to the theme
  color: "var(--dh-color-purple-700)",
  fontSize: "x-large",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  width: "100%",
  flexDirection: "column"
};

export function DeephavenPluginNotebookView(props: WidgetComponentProps): JSX.Element {
  const { fetch } = props;
  const [widget, setWidget] = useState<Widget | null>(null);
  const [iframeSrc, setIframeSrc] = useState<string | undefined>(undefined);
  const dh = useApi();

  useEffect(() => {
    async function init() {
       // Fetch the widget from the server
      const fetched_widget = await fetch() as Widget;
      setWidget(fetched_widget);

      // Add an event listener to the widget to listen for messages from the server
      fetched_widget.addEventListener<Widget>(
          dh.Widget.EVENT_MESSAGE,
          ({ detail }) => {
            // When a message is received, update the text in the component
            const html_str = detail.getDataAsString();
            if (html_str) {
              setIframeSrc(html_str);
            }
          }
      );
    }

    init();
  }, [dh, fetch]);

  return (
    <div style={{ height: '100%' }}>
      {iframeSrc ? <iframe srcDoc={iframeSrc} style={{ width: '100%', height: '100%', border: 'none' }} /> : null}
    </div>
  );
}

export default DeephavenPluginNotebookView;
