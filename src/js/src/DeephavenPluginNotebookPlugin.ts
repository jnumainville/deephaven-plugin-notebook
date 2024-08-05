import { type WidgetPlugin, PluginType } from '@deephaven/plugin';
import { vsGraph } from '@deephaven/icons';
import { DeephavenPluginNotebookView } from './DeephavenPluginNotebookView';

// Register the plugin with Deephaven
export const DeephavenPluginNotebookPlugin: WidgetPlugin = {
  // The name of the plugin
  name: 'deephaven-plugin-notebook',
  // The type of plugin - this will generally be WIDGET_PLUGIN
  type: PluginType.WIDGET_PLUGIN,
  // The supported types for the plugin. This should match the value returned by `name`
  // in DeephavenPluginNotebookType in deephaven_plugin_notebook_type.py
  supportedTypes: 'DeephavenPluginNotebook',
  // The component to render for the plugin
  component: DeephavenPluginNotebookView,
  // The icon to display for the plugin
  icon: vsGraph,
};

export default DeephavenPluginNotebookPlugin;
