# -*- coding: utf-8 -*-

import sys
import json
from argparse import ArgumentParser

from . csv2geojson import csv2geojson
from . shp2geojson import shp2Elementary_loc, shp2MiddleSchool_loc,\
                          shp2Elementary, shp2MiddleSchool, shp2geojson


def csv2geojson_cli(args):
    _input = args.input
    if _input == '-':
        _input = sys.stdin
    if args.output == '-':
        return json.dump(csv2geojson(_input, encoding=args.encoding),
                         sys.stdout, ensure_ascii=False)
    with open(args.output, 'w', encoding='utf-8') as _output:
        return json.dump(csv2geojson(_input, encoding=args.encoding),
                         _output, ensure_ascii=False)


def shp2geojson_cli_decorator(func):
    def f(args):
        _input = args.input
        if args.output == '-':
            return json.dump(func(_input), sys.stdout,
                             ensure_ascii=False)
        with open(args.output, 'w', encoding='utf-8') as _output:
            return json.dump(func(_input), _output,
                             ensure_ascii=False)
    return f


parser = ArgumentParser(prog='cfktools')
subparsers = parser.add_subparsers(help='sub-command')

parser_csv2geojson = subparsers.add_parser('csv2geojson',
                                           help='csv から geojson へ変換')
parser_csv2geojson.add_argument('input', help='入力ファイル名か - (標準入力)')
parser_csv2geojson.add_argument('-e', '--encoding', default=None,
                                help='入力の文字コード（CP932）')
parser_csv2geojson.add_argument('-o', '--output', action='store',
                                dest='output', default='-',
                                help='出力ファイル名 (default: 標準出力)')
parser_csv2geojson.set_defaults(func=csv2geojson_cli)

parser_shp2geojson = subparsers.add_parser(
    'shp2geojson',
    help='shp から geojson へ変換'
)
parser_shp2geojson.add_argument('input', help='入力ファイル名')
parser_shp2geojson.add_argument('-o', '--output', action='store',
                                dest='output', default='-',
                                help='出力ファイル名 (default: 標準出力)')
parser_shp2geojson.set_defaults(
    func=shp2geojson_cli_decorator(shp2geojson)
)

parser_shp2Elementary_loc = subparsers.add_parser(
    'shp2Elementary_loc',
    help='shp から geojson へ変換'
)
parser_shp2Elementary_loc.add_argument('input', help='入力ファイル名')
parser_shp2Elementary_loc.add_argument('-o', '--output', action='store',
                                       dest='output', default='-',
                                       help='出力ファイル名 (default: 標準出力)')
parser_shp2Elementary_loc.set_defaults(
    func=shp2geojson_cli_decorator(shp2Elementary_loc)
)

parser_shp2MiddleSchool_loc = subparsers.add_parser(
    'shp2MiddleSchool_loc',
    help='shp から geojson へ変換'
)
parser_shp2MiddleSchool_loc.add_argument('input', help='入力ファイル名')
parser_shp2MiddleSchool_loc.add_argument('-o', '--output', action='store',
                                         dest='output', default='-',
                                         help='出力ファイル名 (default: 標準出力)')
parser_shp2MiddleSchool_loc.set_defaults(
    func=shp2geojson_cli_decorator(shp2MiddleSchool_loc)
)

parser_shp2Elementary = subparsers.add_parser(
    'shp2Elementary',
    help='shp から geojson へ変換'
)
parser_shp2Elementary.add_argument('input', help='入力ファイル名')
parser_shp2Elementary.add_argument('-o', '--output', action='store',
                                   dest='output', default='-',
                                   help='出力ファイル名 (default: 標準出力)')
parser_shp2Elementary.set_defaults(
    func=shp2geojson_cli_decorator(shp2Elementary)
)

parser_shp2MiddleSchool = subparsers.add_parser(
    'shp2MiddleSchool',
    help='shp から geojson へ変換'
)
parser_shp2MiddleSchool.add_argument('input', help='入力ファイル名')
parser_shp2MiddleSchool.add_argument('-o', '--output', action='store',
                                     dest='output', default='-',
                                     help='出力ファイル名 (default: 標準出力)')
parser_shp2MiddleSchool.set_defaults(
    func=shp2geojson_cli_decorator(shp2MiddleSchool)
)


if __name__ == '__main__':
    args = parser.parse_args()
    args.func(args)
