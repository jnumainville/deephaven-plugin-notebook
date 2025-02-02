# deephaven_plugin_notebook

This is a Python plugin for Deephaven generated from a [deephaven-plugin](https://github.com/deephaven/deephaven-plugins) template.

This is an experimental plugin that can create and embed simple jupyter notebooks within deephaven.
It cannot show more complex resources like ipywidgets at this time.

## Plugin Structure

The `src` directory contains the Python and JavaScript code for the plugin.
Within the `src` directory, the deephaven_plugin_notebook directory contains the Python code, and the `js` directory contains the JavaScript code.

The Python files have the following structure:
`deephaven_plugin_notebook_object.py` defines a simple Python class that can wrap a notebook
`deephaven_plugin_notebook_type.py` defines the Python type for the plugin (which is used for registration) and a simple message stream.
`js_plugin.py` defines the Python class that will be used to setup the JavaScript side of the plugin.
`register.py` registers the plugin with Deephaven.

The JavaScript files have the following structure:
`DeephavenPluginNotebookPlugin.ts` registers the plugin with Deephaven.
`DeephavenPluginNotebookView.tsx` defines the plugin panel and loads the notebook.

Additionally, the `test` directory contains Python tests for the plugin. This demonstrates how the embedded Deephaven server can be used in tests.
It's recommended to use `tox` to run the tests, and the `tox.ini` file is included in the project.

## Building the Plugin

To build the plugin, you will need `npm` and `python` installed, as well as the `build` package for Python.
`nvm` is also strongly recommended, and an `.nvmrc` file is included in the project.
The python venv can be created and the recommended packages installed with the following commands:
```sh
cd deephaven_plugin_notebook
python -m venv .venv
source .venv/bin/activate
pip install --upgrade -r requirements.txt
```

Build the JavaScript plugin from the `src/js` directory:

```sh
cd src/js
nvm install
npm install
npm run build
```

Then, build the Python plugin from the top-level directory:

```sh
cd ../..
python -m build --wheel
```

The built wheel file will be located in the `dist` directory.

If you modify the JavaScript code, remove the `build` and `dist` directories before rebuilding the wheel:
```sh
rm -rf build dist
```

## Installing the Plugin

The plugin can be installed into a Deephaven instance with `pip install <wheel file>`.
The wheel file is stored in the `dist` directory after building the plugin.
Exactly how this is done will depend on how you are running Deephaven.
If using the venv created above, the plugin and server can be created with the following commands:
```sh
pip install deephaven-server
pip install dist/deephaven_plugin_notebook-0.0.1.dev0-py3-none-any.whl
deephaven server
```
See the [plug-in documentation](https://deephaven.io/core/docs/how-to-guides/use-plugins/) for more information.

After the initial setup, you can call
```sh
./rebuild.sh
```
which will reinstall and run the server.

## Using the Plugin

Once the Deephaven server is running, the plugin should be available to use.

```python
from deephaven_plugin_notebook import DeephavenPluginNotebookObject

obj = DeephavenPluginNotebookObject()
```

Here is a simple example that uses [dh.ui](https://pypi.org/project/deephaven-plugin-ui/) to make a simple notebook with input.  
There are two cell types that reflect the two main jupyter cell types. Any `"code"` blocks are ran automatically, sequentially.
```python
from deephaven_plugin_notebook import DeephavenPluginNotebookObject
from ipywidgets import IntSlider
import deephaven.ui as ui

def render_notebook(text):
    notebook = [
        {
            "type": "markdown",
            "source": "Hello, World!"
        },
        {
            "type": "code",
            "source": f"print('{text}')"
        }
    ]

    return DeephavenPluginNotebookObject(notebook)

@ui.component
def demo():
    text, set_text = ui.use_state("Hello, World!")
    print_input = ui.text_field(value=text, on_change=set_text)
    rendered_notebook = ui.use_memo(lambda: render_notebook(text), [text])

    return ui.flex(print_input, rendered_notebook, direction="column", width="100%")

notebook_input = demo()
```
The function `render_notebook` could also be ran on it's own if not using `dh.ui`

## Distributing the Plugin
To distribute the plugin, you can upload the wheel file to a package repository, such as [PyPI](https://pypi.org/).
The version of the plugin can be updated in the `setup.cfg` file.

There is a separate instance of PyPI for testing purposes.
Start by creating an account at [TestPyPI](https://test.pypi.org/account/register/).
Then, get an API token from [account management](https://test.pypi.org/manage/account/#api-tokens), setting the “Scope” to “Entire account”.

To upload to the test instance, use the following commands:
```sh
python -m pip install --upgrade twine
python -m twine upload --repository testpypi dist/*
```

Now, you can install the plugin from the test instance. The extra index is needed to find dependencies:
```sh
pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple/ deephaven_plugin_notebook
```

For a production release, create an account at [PyPI](https://pypi.org/account/register/).
Then, get an API token from [account management](https://pypi.org/manage/account/#api-tokens), setting the “Scope” to “Entire account”.

To upload to the production instance, use the following commands. 
Note that `--repository` is the production instance by default, so it can be omitted:
```sh
python -m pip install --upgrade twine
python -m twine upload dist/*
```

Now, you can install the plugin from the production instance:
```sh
pip install deephaven_plugin_notebook
```

See the [Python packaging documentation](https://packaging.python.org/en/latest/tutorials/packaging-projects/#uploading-the-distribution-archives) for more information.
