rm -rf build
rm -rf dist
pushd src/js
npm run build
popd
python -m build --wheel
pip install --force-reinstall --no-deps dist/*.whl
deephaven server