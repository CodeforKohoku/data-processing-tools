# -*- coding: utf-8 -*-

import sys
import json
from argparse import ArgumentParser

from . csv2geojson import csv2geojson


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


if __name__ == '__main__':
    args = parser.parse_args()
    args.func(args)