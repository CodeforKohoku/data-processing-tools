# data-processing-tools

## インストール

Python 3.5.x で動くようにしています。
`venv` パッケージを使って仮想環境でセットアップすることをお勧めします。

1. 仮想環境のインストール
`$ python -m venv .venv`

2. 仮想環境のアクティベート

(windows)
`$ ./.venv/Scripts/activate.bat`

(Mac/Linux)
`$ ./.venv/Scripts/activate.bat`

(以下では `.venv` に仮想環境を構築したものとして話を進めます)

(抜けるときは `deactivate`)

### MacOS/Linux の場合

`$ pip install git+https://github.com/CodeforKohoku/data-processing-tools.git`

または

`$ pip install git+git@github.com/CodeforKohoku/data-processing-tools.git`

### Windows の場合

`fiona` と `GDAL` を先にインストールしておく必要がある。

[http://www.lfd.uci.edu/~gohlke/pythonlibs/#fiona](http://www.lfd.uci.edu/~gohlke/pythonlibs/#fiona) から `Fiona‑1.7.0‑cp35‑cp35m‑win_amd64.whl` (64bit) または `Fiona‑1.7.0‑cp35‑cp35m‑win32.whl` (32bit) をダウンロード。

[http://www.lfd.uci.edu/~gohlke/pythonlibs/#gdal](http://www.lfd.uci.edu/~gohlke/pythonlibs/#gdal) から `GDAL‑2.0.3‑cp35‑cp35m‑win_amd64.whl` (64bit) または `GDAL‑2.1.2‑cp35‑cp35m‑win32.whl` (32bit) をダウンロード。

`./` に置いたとして、以下を実行:

```sh
> pip install GDAL‑2.0.3‑cp35‑cp35m‑win_amd64.whl
> pip install Fiona‑1.7.0‑cp35‑cp35m‑win_amd64.whl
```

その後、`./.venv/Scripts/activate.bat` の下記の行を変更

(変更前) `set "PATH=%VIRTUAL_ENV%\Scripts;%PATH%"``

(変更後) `set "PATH=%VIRTUAL_ENV%\Scripts;%VIRTUAL_ENV%/Lib/site-packages/osgeo;%PATH%"``

一度コマンドプロンプト等を開きなおして、仮想環境を再度アクティベート後、以下のコマンドでインストール。

`$ pip install git+https://github.com/CodeforKohoku/data-processing-tools.git`

または

`$ pip install git+git@github.com/CodeforKohoku/data-processing-tools.git`

## 使い方

### csv2geojson

`nurseryFacilities.geojson` を作るコマンドです。

```sh
$ python -m cfktools csv2geojson [入力ファイル] -o [出力ファイル]
```

### shp2Elementary_loc

`shp2Elementary_loc.geojson` を作るコマンドです。

```sh
$ python -m cfktools shp2Elementary_loc [入力ファイル] -o [出力ファイル]
```

### shp2Elementary

`shp2Elementary.geojson` を作るコマンドです。

```sh
$ python -m cfktools shp2Elementary [入力ファイル] -o [出力ファイル]
```

### shp2MiddleSchool_loc

`shp2MiddleSchool_loc.geojson` を作るコマンドです。

```sh
$ python -m cfktools shp2MiddleSchool_loc [入力ファイル] -o [出力ファイル]
```

### shp2MiddleSchool

`shp2MiddleSchool.geojson` を作るコマンドです。

```sh
$ python -m cfktools shp2MiddleSchool [入力ファイル] -o [出力ファイル]
```
